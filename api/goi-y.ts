export const config = { runtime: 'edge' }

/**
 * Trợ lý AI của tầng ÁP DỤNG.
 *
 * Chạy ở phía máy chủ vì khoá Gemini không được phép ra tới trình duyệt — mọi
 * biến `VITE_*` đều nằm trong bundle công khai.
 *
 * ── Những gì đã đo được trên gói miễn phí, và đều nằm trong code dưới đây ──
 *
 *  1. `gemini-2.5-flash` không còn cấp cho tài khoản mới (404).
 *  2. Gemini 3.x mặc định bật "thinking" và nó ăn hết ngân sách token đầu ra —
 *     đặt 700 token mà chỉ nhận về 93 ký tự. `thinkingConfig: { thinkingBudget: 0 }`.
 *  3. Model đông KHÔNG trả 503 ngay. Đo thực tế: `gemini-3.8-flash` mất 120
 *     giây mới chịu nói 503, `gemini-3.7-flash` mất 288 giây. Fallback xếp
 *     hàng tuần tự vì thế chết trước khi tới được model đang rảnh — Edge
 *     function của Vercel chỉ có 25 giây.
 *  4. Model nào rảnh thay đổi theo từng phút. Cùng một `gemini-3.6-flash`:
 *     lần đo đầu 7,3 giây, lần sau treo quá 20 giây. Không có thứ tự cố định
 *     nào đáng tin.
 *  5. `gemini-4-*` trả 429 (không nằm trong gói miễn phí);
 *     `*-flash-lite-latest` trả 400 với payload này.
 *
 * ── Vì (3) và (4): gọi gối đầu thay vì xếp hàng ──
 *
 * Phóng model tốt nhất trước. Cứ `TRE_GOI_THEM` mà chưa ai trả lời thì phóng
 * thêm một model nữa. Ai về trước thì lấy, huỷ hết phần còn lại. Model tốt
 * đang rảnh vẫn thắng vì nó được chạy trước; model tốt đang treo không còn
 * giữ người dùng làm con tin.
 *
 * Cái giá là có lúc gọi hai, ba lời gọi song song. Lời gọi bị huỷ thì Google
 * không trả kết quả, nên đổi lại là xứng: một bản demo trả về trang lỗi 504
 * của Vercel thì tệ hơn nhiều.
 *
 * Quyền riêng tư: câu chuyện người dùng kể KHÔNG được ghi log. Chỉ log mã lỗi.
 */

// Xếp theo chất lượng giảm dần. Tất cả đều đã thử gọi được với payload này.
const MODEL = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite',
]

/** Chưa ai trả lời sau khoảng này thì phóng thêm một model. */
const TRE_GOI_THEM = 2000

/**
 * Model vừa trả lời được, nhớ lại cho lần sau.
 *
 * Đo thực tế: ba model đầu đang đông, nên lượt nào cũng là model thứ tư thắng
 * sau ~10 giây, mà 7,5 giây trong đó chỉ là ngồi chờ. Thử model vừa thắng
 * trước thì lượt sau về trong khoảng 3 giây.
 *
 * Biến ở mức module nên chỉ sống trong một isolate và có thể mất bất cứ lúc
 * nào — đúng như ý: đây là lời phỏng đoán để chạy nhanh hơn, không phải trạng
 * thái mà tính đúng đắn dựa vào.
 */
let modelThangLanTruoc: string | null = null

/** Tổng thời gian cho phép. Edge function của Vercel chết ở 25 giây. */
const HAN_TONG = 21_000

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

/**
 * Gộp nhiều tín hiệu huỷ thành một.
 *
 * Tự viết thay vì dùng `AbortSignal.any`: hàm đó mới, và một bản runtime
 * không có nó sẽ làm tính năng chết hẳn chứ không chỉ chậm.
 */
function gopTinHieu(...ds: AbortSignal[]): AbortSignal {
  const c = new AbortController()
  for (const s of ds) {
    if (s.aborted) {
      c.abort()
      break
    }
    s.addEventListener('abort', () => c.abort(), { once: true })
  }
  return c.signal
}

/** Chờ, nhưng bỏ chờ ngay khi có ai huỷ. */
function cho(ms: number, tinHieu: AbortSignal) {
  return new Promise<void>((xong, bo) => {
    if (tinHieu.aborted) return bo(new Error('bỏ'))
    const hen = setTimeout(xong, ms)
    tinHieu.addEventListener(
      'abort',
      () => {
        clearTimeout(hen)
        bo(new Error('bỏ'))
      },
      { once: true },
    )
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
      thinkingConfig: { thinkingBudget: 0 },
    },
  })

  // Huỷ khi đã có người thắng, và huỷ khi hết tổng thời gian.
  const thang = new AbortController()
  const hetGio = AbortSignal.timeout(HAN_TONG)
  const loiGapPhai: string[] = []
  const batDau = Date.now()

  async function thu(model: string, thuTu: number) {
    if (thuTu > 0) await cho(thuTu * TRE_GOI_THEM, gopTinHieu(thang.signal, hetGio))

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${khoa}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: payload,
        signal: gopTinHieu(thang.signal, hetGio),
      },
    )

    if (!res.ok) {
      loiGapPhai.push(`${model}:${res.status}`)
      throw new Error(String(res.status))
    }

    const du = (await res.json()) as {
      error?: { code?: number }
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }

    if (du.error) {
      loiGapPhai.push(`${model}:${du.error.code ?? '?'}`)
      throw new Error('lỗi body')
    }

    const chu = du.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
    if (!chu.trim()) {
      loiGapPhai.push(`${model}:rỗng`)
      throw new Error('rỗng')
    }

    // Có câu trả lời: dừng những model còn lại ngay, đừng để chúng chạy tiếp.
    thang.abort()
    modelThangLanTruoc = model
    return { goiY: chu, model, ms: Date.now() - batDau }
  }

  // Model vừa thắng lên đầu hàng, phần còn lại giữ nguyên thứ tự chất lượng.
  const thuTuGoi = modelThangLanTruoc
    ? [modelThangLanTruoc, ...MODEL.filter((m) => m !== modelThangLanTruoc)]
    : MODEL

  try {
    return traLoi(await Promise.any(thuTuGoi.map(thu)))
  } catch {
    // Chỉ log mã lỗi, không bao giờ log câu chuyện của người dùng.
    console.error(`Gemini không phản hồi sau ${Date.now() - batDau}ms:`, loiGapPhai.join(', '))
    return traLoi(
      { loi: 'Trợ lý đang quá tải. Thử lại sau một lát giúp mình nhé.', chiTiet: loiGapPhai },
      503,
    )
  }
}
