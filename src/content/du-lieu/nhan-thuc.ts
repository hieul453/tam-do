import type { Nhanh } from '../schema'

/**
 * Nhánh mở khoá của bản pilot.
 *
 * Nội dung lấy chất liệu từ chương Trí nhớ đã soạn và kiểm chứng nguồn, viết
 * lại theo dạng bài tập ngắn. Mọi con số trong đây đều truy được về nguồn ghi
 * ở phần ĐÀO SÂU — không bịa.
 */
export const nhanThuc: Nhanh = {
  id: 'nhan-thuc',
  tieuDe: 'Tâm lý học nhận thức',
  moTa: 'Cách tâm trí thu nhận, lưu giữ và dùng lại thông tin',
  icon: 'Brain',
  trangThai: 'mo',
  chuong: [
    {
      id: 'tri-nho',
      tieuDe: 'Trí nhớ',
      cauHoi: 'Ta lưu giữ quá khứ như thế nào, và vì sao đôi khi nó đánh lừa ta?',
      trangThai: 'mo',
      phan: [
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
              giaiThich:
                'Ba bước nối tiếp nhau. Biết mình hỏng ở bước nào thì mới chọn đúng cách sửa.',
            },
            {
              id: 'bb-3',
              loai: 'chon-mot',
              cauHoi: 'Gặp lại người quen, nhớ rõ mặt nhưng không gọi được tên. Hỏng ở bước nào?',
              luaChon: ['Mã hoá', 'Lưu trữ', 'Truy xuất'],
              dapAn: 2,
              giaiThich: 'Thông tin vẫn còn trong đầu, chỉ là chưa tìm ra đường lấy nó ra.',
            },
            {
              id: 'bb-4',
              loai: 'the-lat',
              mat_truoc: 'Chứng quên thuận chiều',
              mat_sau:
                'Mất khả năng tạo ký ức MỚI, trong khi ký ức cũ vẫn còn nguyên. Ca bệnh H.M. là ví dụ kinh điển.',
            },
            {
              id: 'bb-5',
              loai: 'dung-sai',
              menhDe: 'Trí nhớ là một cái kho duy nhất trong não.',
              dung: false,
              giaiThich:
                'Ca H.M. cho thấy ngược lại: ông mất khả năng tạo ký ức mới nhưng vẫn học được kỹ năng mới. Nhiều hệ thống khác nhau, hỏng riêng lẻ được.',
            },
          ],
        },
        {
          id: 'quen',
          tieuDe: 'Quên có phải là mất hẳn?',
          moTa: 'Phần lớn cái ta gọi là quên thật ra chỉ là không tìm thấy',
          trangThai: 'mo',
        },
        {
          id: 'nho-sai',
          tieuDe: 'Nhớ sai mà vẫn chắc chắn',
          moTa: 'Mỗi lần nhớ lại là một lần dựng lại — và dựng thì có thể dựng lệch',
          trangThai: 'mo',
        },
        {
          id: 'hoc-sao-nho-lau',
          tieuDe: 'Học sao cho nhớ lâu',
          moTa: 'Những cách học có bằng chứng, và những cách ai cũng làm mà vô ích',
          trangThai: 'sap-co',
        },
      ],
    },
    {
      id: 'chu-y',
      tieuDe: 'Chú ý',
      cauHoi: 'Vì sao ta nhìn mà không thấy?',
      trangThai: 'sap-co',
      phan: [],
    },
    {
      id: 'tu-duy',
      tieuDe: 'Tư duy và ra quyết định',
      cauHoi: 'Những lối tắt nào của não hay dẫn ta đi sai?',
      trangThai: 'sap-co',
      phan: [],
    },
  ],
}
