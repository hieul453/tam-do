export const config = { runtime: 'edge' }

/**
 * Trợ lý AI của tầng ÁP DỤNG.
 *
 * Chạy ở phía máy chủ vì khoá Gemini không được phép ra tới trình duyệt — mọi
 * biến `VITE_*` đều nằm trong bundle công khai.
 *
 * Ba điều đã học được khi thử API thật, và cả ba đều nằm trong code dưới đây:
 *
 *  1. `gemini-2.5-flash` không còn cấp cho tài khoản mới.
 *  2. Gemini 3.x mặc định bật "thinking" và nó ăn hết ngân sách token đầu ra —
 *     đặt 700 token mà chỉ nhận về 93 ký tự. `thinkingBudget: 0` giải quyết.
 *  3. Gói miễn phí trả **503** khá thường xuyên khi model đông. Một model duy
 *     nhất là một điểm chết; phải có danh sách dự phòng.
 *
 * Quyền riêng tư: câu chuyện người dùng kể KHÔNG được ghi log. Chỉ log mã lỗi.
 */

// Xếp theo chất lượng giảm dần. Gặp 503 thì rơi xuống model kế tiếp.
const MODEL = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.1-flash-lite']

const GIOI_HAN_KY_TU = 2000

const LUAT = `Bạn là trợ lý học tập của Tâm Đồ, một app học tâm lý học.

Nhiệm vụ: dựa trên kiến thức của phần học và câu chuyện người dùng kể, đưa ra gợi ý thực tiễn.

Quy tắc bắt buộc:
- Trả lời bằng tiếng Việt, giọng gần gũi, xưng "bạn".
- Đưa đúng 3 gợi ý, mỗi gợi ý 2-3 câu, cụ thể và làm được ngay.
- Bám sát kiến thức của phần học. Không bịa nghiên cứu, không bịa con số.
- KHÔNG chẩn đoán, KHÔNG kết luận người dùng mắc rối loạn gì.
- Nếu câu chuyện có dấu hiệu khủng hoảng (tự hại, bạo lực, sang chấn nặng),
  bỏ qua định dạng trên và khuyên họ tìm chuyên gia hoặc người thân tin cậy.
- Định dạng: mỗi gợi ý bắt đầu bằng một dòng tiêu đề ngắn in đậm kiểu **Tiêu đề**,
  xuống dòng rồi mới tới nội dung. Không dùng tiêu đề markdown.`

type Than = { boiCanh?: unknown; cauChuyen?: unknown }

function traLoi(du: object, ma = 200) {
  return new Response(JSON.stringify(du), {
    status: ma,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return traLoi({ loi: 'Chỉ nhận POST' }, 405)

  const khoa = process.env.GEMINI_API_KEY
  if (!khoa) {
    return traLoi({ loi: 'Máy chủ chưa cấu hình khoá AI. Báo người quản trị giúp nhé.' }, 503)
  }

  let than: Than
  try {
    than = (await req.json()) as Than
  } catch {
    return traLoi({ loi: 'Dữ liệu gửi lên không hợp lệ.' }, 400)
  }

  const boiCanh = typeof than.boiCanh === 'string' ? than.boiCanh : ''
  const cauChuyen = typeof than.cauChuyen === 'string' ? than.cauChuyen.trim() : ''

  if (cauChuyen.length < 10) {
    return traLoi({ loi: 'Kể thêm một chút để mình hiểu tình huống của bạn nhé.' }, 400)
  }
  if (cauChuyen.length > GIOI_HAN_KY_TU) {
    return traLoi(
      { loi: `Câu chuyện hơi dài, rút gọn dưới ${GIOI_HAN_KY_TU} ký tự giúp mình.` },
      400,
    )
  }

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: `${LUAT}\n\nKiến thức của phần học:\n${boiCanh}` }] },
    contents: [{ role: 'user', parts: [{ text: cauChuyen }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1200,
      // Tắt "thinking": nếu không, phần suy luận nội bộ ăn hết ngân sách và
      // câu trả lời bị cắt giữa chừng.
      thinkingConfig: { thinkingBudget: 0 },
    },
  })

  const loiGapPhai: string[] = []

  for (const model of MODEL) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${khoa}`,
        { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload },
      )

      if (res.status === 503 || res.status === 429) {
        loiGapPhai.push(`${model}:${res.status}`)
        continue // model đang đông, thử model sau
      }

      const du = (await res.json()) as {
        error?: { code?: number; message?: string }
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> }
          finishReason?: string
        }>
      }

      if (du.error) {
        loiGapPhai.push(`${model}:${du.error.code ?? '?'}`)
        continue
      }

      const chu = du.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
      if (!chu.trim()) {
        loiGapPhai.push(`${model}:rong`)
        continue
      }

      return traLoi({ goiY: chu, model })
    } catch {
      loiGapPhai.push(`${model}:mang`)
    }
  }

  // Chỉ log mã lỗi, không bao giờ log câu chuyện của người dùng.
  console.error('Gemini không phản hồi:', loiGapPhai.join(', '))
  return traLoi(
    { loi: 'Trợ lý đang quá tải. Thử lại sau một lát giúp mình nhé.', chiTiet: loiGapPhai },
    503,
  )
}
