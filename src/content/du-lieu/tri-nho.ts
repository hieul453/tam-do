import type { Chuong } from '../schema'

/**
 * Chương Trí nhớ — chương mở khoá của bản pilot.
 *
 * Mọi con số trong đây đều truy được về nguồn ghi ở phần ĐÀO SÂU của chính
 * phần đó. Không có con số nào được viết ra mà không mở nguồn kiểm.
 */
export const triNho: Chuong = {
  id: 'tri-nho',
  tieuDe: 'Trí nhớ',
  cauHoi: 'Ta lưu giữ quá khứ như thế nào, và vì sao đôi khi nó đánh lừa ta?',
  trangThai: 'mo',
  phan: [
    /* ───────────────────────────── Phần 1 ───────────────────────────── */
    {
      id: 'ba-buoc',
      tieuDe: 'Ba bước của trí nhớ',
      moTa: 'Đưa vào, giữ lại, lấy ra — hỏng bước nào cũng thành "quên"',
      trangThai: 'mo',

      nhanh: [
        {
          id: 'bb-1',
          loai: 'chon-mot',
          cauHoi:
            'Bạn đọc hết một chương sách, sáng hôm sau không nhớ gì. Nhiều khả năng hỏng ở bước nào?',
          luaChon: ['Lúc đọc', 'Lúc cất giữ', 'Lúc nhớ lại'],
          dapAn: 0,
          giaiThich:
            'Đọc mà không nghĩ về ý nghĩa thì thông tin chưa thật sự được đưa vào. Hỏng ngay ở bước mã hoá.',
        },
        {
          id: 'bb-2',
          loai: 'xep-thu-tu',
          cauHoi: 'Xếp ba bước của trí nhớ theo đúng thứ tự',
          dungThuTu: ['Mã hoá — đưa vào', 'Lưu trữ — giữ lại', 'Truy xuất — lấy ra'],
          giaiThich: 'Ba bước nối tiếp. Biết hỏng ở bước nào mới chọn đúng cách sửa.',
        },
        {
          id: 'bb-3',
          loai: 'the-lat',
          mat_truoc: 'Chứng quên thuận chiều',
          mat_sau:
            'Mất khả năng tạo ký ức MỚI, trong khi ký ức cũ vẫn còn nguyên. Ca bệnh H.M. là ví dụ kinh điển.',
        },
        {
          id: 'bb-4',
          loai: 'chon-mot',
          cauHoi: 'Gặp lại người quen, nhớ rõ mặt nhưng không gọi được tên. Hỏng ở bước nào?',
          luaChon: ['Mã hoá', 'Lưu trữ', 'Truy xuất'],
          dapAn: 2,
          giaiThich: 'Thông tin vẫn còn trong đầu, chỉ là chưa tìm ra đường lấy nó ra.',
        },
        {
          id: 'bb-5',
          loai: 'dung-sai',
          menhDe: 'Trí nhớ là một cái kho duy nhất trong não.',
          dung: false,
          giaiThich:
            'Ca H.M. cho thấy ngược lại: ông mất khả năng tạo ký ức mới nhưng vẫn học được kỹ năng mới. Nhiều hệ thống khác nhau, hỏng riêng lẻ được.',
        },
        {
          id: 'bb-6',
          loai: 'ghep-doi',
          cauHoi: 'Ghép mỗi bước với kiểu "quên" tương ứng',
          cap: [
            { trai: 'Mã hoá hỏng', phai: 'Đọc mà không vào đầu' },
            { trai: 'Lưu trữ hỏng', phai: 'Lâu không dùng nên phai dần' },
            { trai: 'Truy xuất hỏng', phai: 'Biết mà không nói ra được' },
          ],
        },
        {
          id: 'bb-7',
          loai: 'dien-tu',
          cauTruoc: 'Vùng não thiết yếu để đưa thông tin mới vào kho dài hạn là',
          cauSau: '.',
          dapAn: 'hồi hải mã',
          nhieu: ['tiểu não', 'thuỳ chẩm'],
          giaiThich:
            'Phần lớn hồi hải mã của H.M. bị cắt bỏ, và từ đó ông không tạo được ký ức mới.',
        },
      ],

      daoSau: {
        phutDoc: 5,
        tomTat: 'Vì sao trí nhớ là một chuỗi quá trình chứ không phải một khối',
        khoi: [
          {
            loai: 'doan',
            noiDung:
              'Các nhà tâm lý học mô tả trí nhớ bằng ba quá trình. **Mã hoá** biến điều ta thấy, nghĩ, cảm nhận thành dấu vết trong não. **Lưu trữ** giữ dấu vết đó theo thời gian. **Truy xuất** đưa thông tin trở lại ý thức khi cần. Nghe có vẻ hiển nhiên, nhưng phải nhờ một ca bệnh đặc biệt, giới khoa học mới thấy rõ ba bước này có thể tách rời nhau.',
          },
          {
            loai: 'nghienCuu',
            tieuDe: 'Người đàn ông sống mãi trong hiện tại',
            than: 'Năm 1953, Henry Molaison, 27 tuổi, bị động kinh nặng đến mức không thể đi làm. Bác sĩ phẫu thuật cắt bỏ một phần mô não ở cả hai bên thuỳ thái dương, gồm phần lớn hồi hải mã. Các cơn co giật giảm hẳn. Nhưng từ đó ông không còn tạo được ký ức mới: không nhớ mình đã ăn trưa chưa, không nhận ra người vừa gặp vài phút trước.\n\nĐiều lạ là ông vẫn nói chuyện bình thường, tính cách không đổi, và vẫn nhớ nhiều chuyện thời thơ ấu. Nhà tâm lý học Brenda Milner nghiên cứu ông gần 50 năm, và ông chưa bao giờ nhớ ra bà.',
            nghiaLa:
              'Việc đưa thông tin mới vào kho lâu dài cần một vùng não riêng, trong khi những gì đã lưu từ trước vẫn lấy ra được. Trí nhớ là nhiều bước, nhiều hệ thống, không phải một khối.',
            nguon: 'Milner & Scoville (1957)',
          },
          {
            loai: 'bang',
            cot: ['Quá trình', 'Giáo trình tiếng Việt gọi', 'Hỏng thì trông thế nào'],
            hang: [
              ['Mã hoá', 'Ghi nhớ', 'Đọc mà không vào đầu'],
              ['Lưu trữ', 'Giữ gìn', 'Lâu không dùng thì phai dần'],
              ['Truy xuất', 'Tái hiện', 'Biết mà không nói ra được'],
            ],
          },
          {
            loai: 'luuY',
            tieuDe: 'Hai bộ tên gọi',
            noiDung:
              'Giáo trình tiếng Việt và sách quốc tế dùng hai bộ tên khác nhau cho cùng một chuỗi quá trình; cần biết cả hai. Điểm mới hơn là truy xuất không chỉ "lấy ra": mỗi lần nhớ lại vừa làm ký ức chắc hơn, vừa có thể làm nó thay đổi.',
          },
        ],
        ghiNho: [
          'Trí nhớ gồm ba bước: mã hoá, lưu trữ, truy xuất.',
          'Ca H.M. cho thấy ba bước dựa trên những vùng não khác nhau và hỏng riêng lẻ được.',
          'Biết mình quên ở bước nào thì mới chọn đúng cách sửa.',
        ],
        thuatNgu: [
          { vi: 'mã hoá', en: 'encoding' },
          { vi: 'lưu trữ', en: 'storage' },
          { vi: 'truy xuất', en: 'retrieval' },
          { vi: 'hồi hải mã', en: 'hippocampus' },
          { vi: 'chứng quên thuận chiều', en: 'anterograde amnesia' },
        ],
        nguon: [
          {
            tenNgan: 'BrainFacts / SfN',
            moTa: 'The Curious Case of Patient H.M.',
            url: 'https://www.brainfacts.org/in-the-lab/tools-and-techniques/2018/the-curious-case-of-patient-hm-082818',
          },
          {
            tenNgan: 'Milner & Scoville (1957)',
            moTa: 'Báo cáo gốc về ca H.M.',
            url: 'https://www.themantic-education.com/ibpsych/?p=11679',
          },
          {
            tenNgan: 'Schacter, Gilbert & Wegner',
            moTa: 'Psychology, Worth Publishers, chương 6',
          },
        ],
      },

      apDung: {
        lamNgay: [
          {
            tieuDe: 'Dừng 10 giây sau khi đọc',
            moTa: 'Đọc xong một đoạn quan trọng, gấp lại và tự hỏi "mình vừa đọc gì?". Nếu không trả lời được thì thông tin chưa vào, đọc lại luôn còn hơn đọc tiếp.',
          },
          {
            tieuDe: 'Gọi tên kiểu quên của mình',
            moTa: 'Lần tới khi quên gì đó, hỏi: mình chưa đưa vào, hay đã mất, hay chỉ là không lấy ra được? Ba kiểu cần ba cách sửa khác nhau.',
          },
          {
            tieuDe: 'Tạo đường lấy ra',
            moTa: 'Tên người mới gặp: nhắc lại tên đó ngay trong câu đầu tiên bạn nói với họ. Bạn vừa tạo thêm một đường dẫn tới nó.',
          },
        ],
        thuThach: {
          soNgay: 7,
          tieuDe: 'Nhật ký quên',
          moTa: 'Mỗi lần quên một điều gì đó trong tuần này, ghi lại một dòng: quên gì, và bạn đoán hỏng ở bước nào. Cuối tuần xem bước nào bạn hay hỏng nhất — đó là chỗ đáng sửa trước.',
        },
        boiCanhAI:
          'Người dùng vừa học về ba quá trình của trí nhớ: mã hoá (đưa vào), lưu trữ (giữ lại), truy xuất (lấy ra), và việc ba bước này dựa trên những hệ thống não khác nhau nên có thể hỏng riêng lẻ. Hãy giúp họ nhận ra vấn đề của họ nằm ở bước nào và gợi ý cách xử lý tương ứng với bước đó.',
        viDuTinhHuong: [
          'Tôi học bài rất chăm nhưng vào phòng thi là quên sạch.',
          'Tôi hay quên tên người mới gặp, chỉ vài phút sau là không nhớ nổi.',
          'Tôi đọc sách chuyên môn rất nhiều nhưng không áp dụng được gì vào công việc.',
        ],
      },
    },

    /* ───────────────────────────── Phần 2 ───────────────────────────── */
    {
      id: 'quen',
      tieuDe: 'Quên có phải là mất hẳn?',
      moTa: 'Phần lớn cái ta gọi là quên thật ra chỉ là không tìm thấy',
      trangThai: 'mo',

      nhanh: [
        {
          id: 'q-1',
          loai: 'dung-sai',
          menhDe: 'Quên nghĩa là thông tin đã bị xoá khỏi não.',
          dung: false,
          giaiThich:
            'Phần lớn trường hợp thông tin vẫn còn, chỉ là thiếu gợi ý để tìm ra. Gặp đúng gợi ý là nhớ lại được ngay.',
        },
        {
          id: 'q-2',
          loai: 'chon-mot',
          cauHoi: 'Đường cong quên của Ebbinghaus cho thấy điều gì?',
          luaChon: [
            'Ta quên đều đặn mỗi ngày một ít',
            'Ta quên rất nhanh lúc đầu rồi chậm dần',
            'Ta quên chậm lúc đầu rồi nhanh dần',
          ],
          dapAn: 1,
          giaiThich:
            'Phần lớn mất mát xảy ra ngay trong những giờ đầu. Vì vậy ôn lại sớm có giá trị hơn ôn muộn.',
        },
        {
          id: 'q-3',
          loai: 'the-lat',
          mat_truoc: 'Hiện tượng "ở đầu lưỡi"',
          mat_sau:
            'Biết chắc là mình biết, thậm chí nhớ được chữ cái đầu hay số âm tiết, nhưng không lấy ra được từ đó. Bằng chứng rõ nhất cho thấy quên thường là lỗi truy xuất, không phải mất dữ liệu.',
        },
        {
          id: 'q-4',
          loai: 'ghep-doi',
          cauHoi: 'Ghép mỗi nguyên nhân quên với ví dụ của nó',
          cap: [
            { trai: 'Thiếu gợi ý', phai: 'Về tới nhà mới nhớ ra định mua gì' },
            { trai: 'Bị cái mới chen lấn', phai: 'Nhớ số điện thoại mới, quên số cũ' },
            { trai: 'Chưa từng vào đầu', phai: 'Không tả nổi mặt đồng xu dù thấy mỗi ngày' },
          ],
        },
        {
          id: 'q-5',
          loai: 'chon-mot',
          cauHoi: 'Cách nào giúp chống lại đường cong quên tốt nhất?',
          luaChon: [
            'Đọc lại nhiều lần trong một buổi',
            'Tự kiểm tra lại sau vài ngày, rồi vài tuần',
            'Tô màu những ý quan trọng',
          ],
          dapAn: 1,
          giaiThich:
            'Ôn giãn cách kết hợp tự kiểm tra làm đường cong phẳng ra. Đọc lại và tô màu cho cảm giác quen thuộc, nhưng cảm giác quen không phải là nhớ.',
        },
        {
          id: 'q-6',
          loai: 'dung-sai',
          menhDe: 'Cảm giác "cái này quen quá" là dấu hiệu đáng tin rằng bạn đã nhớ.',
          dung: false,
          giaiThich:
            'Quen thuộc đến từ việc nhìn thấy nhiều lần, không phải từ việc lấy ra được. Đó là lý do đọc lại cho cảm giác an tâm giả.',
        },
      ],

      daoSau: {
        phutDoc: 6,
        tomTat: 'Vì sao phần lớn sự quên là lỗi tìm kiếm, không phải lỗi lưu trữ',
        khoi: [
          {
            loai: 'doan',
            noiDung:
              'Cảm giác thường thấy khi quên là thông tin đã "bốc hơi". Nhưng phần lớn bằng chứng chỉ theo hướng khác: thông tin còn đó, chỉ là ta không tìm ra đường tới nó.',
          },
          {
            loai: 'nghienCuu',
            tieuDe: 'Người đầu tiên đo chính mình',
            than: 'Cuối thế kỷ 19, Hermann Ebbinghaus tự học thuộc hàng nghìn âm tiết vô nghĩa rồi đo xem mình còn nhớ bao nhiêu sau các khoảng thời gian khác nhau. Ông làm thí nghiệm trên chính mình trong nhiều năm.\n\nKết quả vẽ thành một đường cong dốc đứng rồi thoải dần: mất mát lớn nhất xảy ra ngay trong những giờ đầu, sau đó phần còn lại trụ khá lâu.',
            nghiaLa:
              'Thời điểm ôn lại quan trọng hơn số lần ôn. Ôn ngay sau khi học chặn được đoạn dốc nhất của đường cong.',
            nguon: 'Ebbinghaus (1885)',
          },
          {
            loai: 'doan',
            noiDung:
              'Hiện tượng **"ở đầu lưỡi"** là bằng chứng đời thường rõ nhất. Ta biết mình biết, đôi khi nhớ được cả chữ cái đầu, nhưng từ đó không chịu ra. Nếu thông tin đã bị xoá thì không thể có cảm giác đó.',
          },
          {
            loai: 'luuY',
            tieuDe: 'Một nghiên cứu kinh điển không lặp lại được',
            noiDung:
              'Thí nghiệm thợ lặn của Godden & Baddeley (1975) — học dưới nước thì nhớ tốt hơn khi ở dưới nước — thường được dẫn để nói về vai trò của bối cảnh. Một nghiên cứu lặp lại năm 2021 không tái hiện được hiệu ứng này. Bối cảnh vẫn có vai trò, nhưng đừng dẫn con số của nghiên cứu gốc như một sự thật đã yên.',
          },
        ],
        ghiNho: [
          'Phần lớn sự quên là không tìm thấy, không phải mất hẳn.',
          'Mất mát lớn nhất xảy ra ngay sau khi học, nên ôn sớm đáng giá hơn ôn nhiều.',
          'Cảm giác quen thuộc không phải là bằng chứng của nhớ.',
        ],
        thuatNgu: [
          { vi: 'đường cong quên', en: 'forgetting curve' },
          { vi: 'gợi ý truy xuất', en: 'retrieval cue' },
          { vi: 'hiện tượng ở đầu lưỡi', en: 'tip-of-the-tongue' },
          { vi: 'nhiễu', en: 'interference' },
        ],
        nguon: [
          {
            tenNgan: 'Ebbinghaus (1885)',
            moTa: 'Über das Gedächtnis — nghiên cứu gốc về đường cong quên',
            url: 'https://psychclassics.yorku.ca/Ebbinghaus/index.htm',
          },
          {
            tenNgan: 'Murre & Dros (2015)',
            moTa: 'Lặp lại thành công thí nghiệm đường cong quên của Ebbinghaus',
            url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0120644',
          },
        ],
      },

      apDung: {
        lamNgay: [
          {
            tieuDe: 'Ôn trong ngày, không để sang tuần',
            moTa: 'Học xong điều gì quan trọng, dành 2 phút trong cùng ngày tự nhắc lại. Hai phút lúc này đáng giá hơn hai mươi phút tuần sau.',
          },
          {
            tieuDe: 'Gấp sách lại rồi mới kiểm tra',
            moTa: 'Thay vì đọc lại, tự kể lại bằng lời của mình. Khó chịu hơn hẳn — và chính cái khó chịu đó là dấu hiệu nó đang có tác dụng.',
          },
          {
            tieuDe: 'Để sẵn gợi ý ở nơi sẽ cần',
            moTa: 'Quên mang gì đó đi làm thì đặt nó cạnh chìa khoá xe, đừng cố nhớ mạnh hơn. Gợi ý đúng chỗ thắng ý chí.',
          },
        ],
        thuThach: {
          soNgay: 5,
          tieuDe: 'Gấp sách lại',
          moTa: 'Năm ngày liền, sau mỗi lần đọc hoặc học gì đó, gấp lại và viết ra ba ý mình nhớ được, rồi mới mở ra đối chiếu. Ghi lại cảm giác khác nhau giữa "tưởng là nhớ" và "nhớ thật".',
        },
        boiCanhAI:
          'Người dùng vừa học rằng phần lớn sự quên là lỗi truy xuất chứ không phải mất dữ liệu, rằng đường cong quên dốc nhất ngay sau khi học, và rằng cảm giác quen thuộc không đồng nghĩa với nhớ được. Hãy gợi ý cách bố trí gợi ý truy xuất và thời điểm ôn lại cho tình huống cụ thể của họ.',
        viDuTinhHuong: [
          'Tôi hay quên mang đồ khi ra khỏi nhà dù đã nhắc mình từ tối hôm trước.',
          'Tôi ôn thi bằng cách đọc lại ghi chú nhiều lần nhưng vào phòng thi vẫn trống rỗng.',
          'Tôi gặp khách hàng xong là quên mất họ đã nói gì, dù lúc nghe thấy rất rõ ràng.',
        ],
      },
    },

    /* ───────────────────────────── Phần 3 ───────────────────────────── */
    {
      id: 'nho-sai',
      tieuDe: 'Nhớ sai mà vẫn chắc chắn',
      moTa: 'Mỗi lần nhớ lại là một lần dựng lại — và dựng thì có thể dựng lệch',
      trangThai: 'mo',

      nhanh: [
        {
          id: 'ns-1',
          loai: 'chon-mot',
          cauHoi:
            'Hai nhóm xem cùng một video tai nạn. Một nhóm được hỏi xe chạy nhanh bao nhiêu khi "đâm sầm" vào nhau, nhóm kia khi "chạm" vào nhau. Nhóm nào ước tốc độ cao hơn?',
          luaChon: ['Nhóm nghe "đâm sầm"', 'Nhóm nghe "chạm"', 'Hai nhóm như nhau'],
          dapAn: 0,
          giaiThich:
            'Nhóm nghe "đâm sầm" ước trung bình khoảng 41 dặm/giờ, nhóm nghe "chạm" khoảng 32. Chỉ khác một động từ trong câu hỏi.',
        },
        {
          id: 'ns-2',
          loai: 'dung-sai',
          menhDe: 'Càng chắc chắn về một ký ức thì ký ức đó càng có khả năng đúng.',
          dung: false,
          giaiThich:
            'Nghiên cứu về ký ức ngày 11/9 cho thấy độ chính xác giảm dần theo thời gian trong khi mức độ tin chắc thì không. Tự tin và đúng là hai chuyện khác nhau.',
        },
        {
          id: 'ns-3',
          loai: 'the-lat',
          mat_truoc: 'Hiệu ứng thông tin sai lệch',
          mat_sau:
            'Thông tin gặp SAU một sự việc có thể trộn vào ký ức về sự việc đó, khiến ta nhớ những chi tiết chưa từng xảy ra. Câu hỏi dẫn dắt là một nguồn gây ra nó.',
        },
        {
          id: 'ns-4',
          loai: 'chon-mot',
          cauHoi:
            'Quản lý muốn hỏi nhân viên về một vụ khiếu nại. Câu nào ít làm méo trí nhớ của nhân viên hơn?',
          luaChon: [
            '"Lúc khách nổi nóng, em đã xin lỗi chưa?"',
            '"Lúc đó chuyện gì đã xảy ra?"',
            '"Em có thấy khách khó chịu không?"',
          ],
          dapAn: 1,
          giaiThich:
            'Hai câu kia đã cài sẵn một giả định vào đầu người trả lời. Câu mở để họ kể trước khi bị gợi ý.',
        },
        {
          id: 'ns-5',
          loai: 'dung-sai',
          menhDe: 'Có thể khiến một người "nhớ" ra cả một sự kiện chưa từng xảy ra với họ.',
          dung: true,
          giaiThich:
            'Trong nghiên cứu "lạc ở trung tâm thương mại", khoảng một phần tư người tham gia nhớ ra chuyện bịa. Một nghiên cứu lặp lại năm 2023 với quy trình đăng ký trước cho con số còn cao hơn.',
        },
        {
          id: 'ns-6',
          loai: 'ghep-doi',
          cauHoi: 'Ghép mỗi kiểu sai lệch của trí nhớ với ví dụ',
          cap: [
            { trai: 'Gán sai nguồn', phai: 'Tin là sếp nói, thật ra đọc trên mạng' },
            { trai: 'Ám thị', phai: 'Câu hỏi dẫn dắt làm đổi lời kể' },
            { trai: 'Thiên kiến', phai: 'Đang giận ai thì chỉ nhớ chuyện xấu về họ' },
          ],
        },
        {
          id: 'ns-7',
          loai: 'dien-tu',
          cauTruoc: 'Nhớ lại không phải mở băng ghi hình, mà là một hành vi',
          cauSau: 'lại.',
          dapAn: 'dựng',
          nhieu: ['sao chép', 'phát'],
          giaiThich:
            'Não ghép các mảnh còn giữ được với những gì ta biết, tin và vừa nghe thấy. Cách làm này linh hoạt, nhưng cũng mở cửa cho sai lệch.',
        },
      ],

      daoSau: {
        phutDoc: 7,
        tomTat: 'Vì sao ký ức có thể bị viết lại, và vì sao tự tin không có nghĩa là đúng',
        khoi: [
          {
            loai: 'doan',
            noiDung:
              'Chúng ta hay nghĩ trí nhớ giống một đoạn phim lưu trong đầu. Thật ra, mỗi lần nhớ lại, não ghép các mảnh còn giữ được với những gì ta biết, tin và vừa nghe thấy. Cách làm này giúp trí nhớ linh hoạt, nhưng cũng mở cửa cho sai lệch.',
          },
          {
            loai: 'nghienCuu',
            tieuDe: 'Một động từ đổi cả vụ tai nạn',
            than: 'Năm 1974, Elizabeth Loftus và John Palmer cho sinh viên xem video các ô tô va chạm rồi hỏi tốc độ. Chỉ động từ trong câu hỏi là thay đổi. Nhóm nghe "đâm sầm" ước trung bình khoảng 41 dặm/giờ, nhóm nghe "chạm" chỉ khoảng 32.\n\nTrong thí nghiệm thứ hai, một tuần sau, người tham gia được hỏi có thấy kính vỡ không. Video không hề có kính vỡ. Vậy mà 32% nhóm "đâm sầm" nói có, so với 14% nhóm nghe "va" và 12% nhóm không bị hỏi về tốc độ.',
            nghiaLa:
              'Câu hỏi không chỉ lấy ký ức ra, mà còn có thể viết lại ký ức. Hiện tượng này gọi là hiệu ứng thông tin sai lệch.',
            nguon: 'Loftus & Palmer (1974)',
          },
          {
            loai: 'nghienCuu',
            tieuDe: 'Cấy một ký ức chưa từng có',
            than: 'Năm 1995, Loftus và Jacqueline Pickrell đưa cho người tham gia bốn câu chuyện thời thơ ấu lấy từ người thân của họ. Ba chuyện là thật, một chuyện bịa: bị lạc trong trung tâm thương mại lúc nhỏ. Sau vài buổi phỏng vấn, khoảng một phần tư người tham gia "nhớ" ra chuyện bịa, có người còn kể thêm chi tiết.\n\nNăm 2023, một nhóm ở Ireland làm lại với 123 người và đăng ký trước quy trình. Kết quả: 35% có ký ức sai, còn cao hơn nghiên cứu gốc.',
            nghiaLa:
              'Không chỉ chi tiết, cả một sự kiện cũng có thể được cấy vào trí nhớ, nhất là khi người gợi ý là người ta tin tưởng.',
            nguon: 'Loftus & Pickrell (1995); Murphy và cộng sự (2023)',
          },
          {
            loai: 'nghienCuu',
            tieuDe: 'Ký ức "khắc cốt ghi tâm" cũng phai',
            than: 'Ngày 12/9/2001, một ngày sau vụ khủng bố ở Mỹ, Jennifer Talarico và David Rubin nhờ 54 sinh viên Đại học Duke ghi lại lúc họ nghe tin, cùng một sự kiện bình thường mấy ngày trước đó. Sau 1, 6 hoặc 32 tuần, họ được hỏi lại.\n\nCả hai loại ký ức đều thay đổi theo thời gian như nhau. Khác biệt duy nhất: với ký ức về ngày 11/9, cảm giác sống động và niềm tin rằng mình nhớ đúng vẫn giữ nguyên.',
            nghiaLa:
              'Ký ức gắn với cảm xúc mạnh không chính xác hơn, chỉ được tin chắc hơn.',
            nguon: 'Talarico & Rubin (2003)',
          },
          {
            loai: 'luuY',
            tieuDe: 'Giáo trình nói gì, và điều chỉnh ở đâu',
            noiDung:
              'Nhiều tài liệu mô tả "ký ức chớp nhoáng" như loại ký ức đặc biệt chính xác về khoảnh khắc nghe tin gây sốc. Nghiên cứu ngày 11/9 cho thấy nó không chính xác hơn ký ức thường; cái đặc biệt chỉ là mức độ ta tin vào nó.',
          },
        ],
        ghiNho: [
          'Nhớ lại là dựng lại, nên thông tin đến sau có thể làm thay đổi ký ức.',
          'Có thể "nhớ" cả một sự kiện chưa từng xảy ra.',
          'Tự tin và sống động không đồng nghĩa với chính xác.',
        ],
        thuatNgu: [
          { vi: 'trí nhớ tái tạo', en: 'reconstructive memory' },
          { vi: 'hiệu ứng thông tin sai lệch', en: 'misinformation effect' },
          { vi: 'ký ức sai', en: 'false memory' },
          { vi: 'ký ức chớp nhoáng', en: 'flashbulb memory' },
        ],
        nguon: [
          {
            tenNgan: 'Loftus & Palmer (1974)',
            moTa: 'Số liệu hai thí nghiệm về câu hỏi dẫn dắt',
            url: 'https://tutor2u.net/psychology/reference/misleading-information-leading-questions',
          },
          {
            tenNgan: 'Loftus & Pickrell (1995)',
            moTa: 'Nghiên cứu "lạc ở trung tâm thương mại" và các phê bình',
            url: 'https://en.wikipedia.org/wiki/Lost_in_the_mall_technique',
          },
          {
            tenNgan: 'Talarico & Rubin (2003)',
            moTa: 'Ký ức chớp nhoáng về ngày 11/9 qua 32 tuần',
            url: 'https://scholars.duke.edu/publication/651206',
          },
          {
            tenNgan: 'Schacter (2001)',
            moTa: 'The Seven Sins of Memory',
          },
        ],
      },

      apDung: {
        lamNgay: [
          {
            tieuDe: 'Hỏi câu mở trước',
            moTa: 'Cần biết chuyện gì đã xảy ra thì bắt đầu bằng "Kể lại giúp mình xem nào", đừng bắt đầu bằng câu đã cài sẵn giả định.',
          },
          {
            tieuDe: 'Ghi trong ngày, đừng để sang tuần',
            moTa: 'Sau một cuộc họp hay sự việc quan trọng, ghi vài dòng ngay hôm đó. Bản ghi không bị viết lại, trí nhớ thì có.',
          },
          {
            tieuDe: 'Khi tranh cãi "ai đã nói gì"',
            moTa: 'Nhớ rằng cả hai bên đều có thể đang nhớ sai một cách rất thành thật. Tranh xem ai nhớ đúng thường vô ích hơn là thống nhất xem từ giờ làm thế nào.',
          },
        ],
        thuThach: {
          soNgay: 3,
          tieuDe: 'Đối chiếu ký ức',
          moTa: 'Chọn một kỷ niệm chung với người thân hoặc bạn bè. Mỗi người tự viết ra năm chi tiết mình nhớ, rồi so với nhau. Ghi lại: hai người khác nhau ở chi tiết nào, và ai cũng chắc chắn mình đúng đến đâu.',
        },
        boiCanhAI:
          'Người dùng vừa học về trí nhớ tái tạo và hiệu ứng thông tin sai lệch: mỗi lần nhớ lại là một lần dựng lại, thông tin đến sau có thể trộn vào ký ức, và mức độ tự tin không dự báo được độ chính xác. Hãy giúp họ xử lý tình huống mà hai bên nhớ khác nhau, hoặc cần thu thập lời kể mà không làm méo nó.',
        viDuTinhHuong: [
          'Tôi và chồng hay cãi nhau về việc ai đã nói gì, cả hai đều chắc chắn mình nhớ đúng.',
          'Tôi cần hỏi nhân viên về một sự cố mà không muốn làm lời kể của họ bị lệch.',
          'Tôi nhớ rất rõ một chuyện thời nhỏ nhưng mẹ tôi bảo chuyện đó chưa từng xảy ra.',
        ],
        khiNaoTimChuyenGia:
          'Nếu một ký ức đau buồn cứ quay lại ngoài ý muốn, khiến bạn mất ngủ, né tránh hoặc ảnh hưởng công việc kéo dài nhiều tuần, đó là lúc nên tìm chuyên gia tâm lý. Tâm Đồ là công cụ học tập, không thay thế chẩn đoán hay trị liệu.',
      },
    },

    /* ───────────────────────── Phần chưa làm ─────────────────────────── */
    {
      id: 'hoc-sao-nho-lau',
      tieuDe: 'Học sao cho nhớ lâu',
      moTa: 'Những cách học có bằng chứng, và những cách ai cũng làm mà vô ích',
      trangThai: 'sap-co',
    },
  ],
}
