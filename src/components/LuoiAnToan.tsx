import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Nut } from '@/components/ui/Nut'

/**
 * Lưới an toàn cuối cùng.
 *
 * Một lỗi render ở bất cứ đâu trong React sẽ gỡ sạch cây DOM và để lại màn
 * hình trắng. Trắng thì người dùng không biết chuyện gì xảy ra, và giữa một
 * buổi demo thì đó là hỏng cả buổi. Màn này ít nhất nói được ba điều: có lỗi,
 * không phải lỗi của bạn, và bấm đây để quay lại.
 *
 * Quyền riêng tư: lỗi KHÔNG được gửi đi đâu cả. Nó chỉ nằm trong console của
 * máy này và trong khối chi tiết gập lại bên dưới. Khi nào có Sentry (đang ở
 * backlog) thì phải lọc kỹ trước khi gửi — nhật ký và câu chuyện người dùng
 * kể cho AI có thể lọt vào thông điệp lỗi.
 */

type Trang = { loi: Error | null }

export class LuoiAnToan extends Component<{ children: ReactNode }, Trang> {
  state: Trang = { loi: null }

  static getDerivedStateFromError(loi: Error): Trang {
    return { loi }
  }

  componentDidCatch(loi: Error, chiTiet: ErrorInfo) {
    // Chỉ ra console của chính máy này, không gửi đi đâu.
    console.error('Lỗi không bắt được:', loi, chiTiet.componentStack)
  }

  render() {
    if (!this.state.loi) return this.props.children

    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <div className="w-full max-w-md text-center">
          <AlertTriangle className="mx-auto mb-4 size-12 text-vang" strokeWidth={1.8} aria-hidden />
          <h1 className="text-xl font-extrabold">Có gì đó hỏng rồi</h1>
          <p className="mt-2 mb-6 leading-relaxed text-chu-phu">
            Lỗi nằm ở phía app, không phải ở bạn. Tiến độ đã học vẫn được lưu — tải lại là tiếp tục
            được.
          </p>

          <div className="flex flex-col gap-2.5">
            <Nut co="lon" onClick={() => window.location.reload()}>
              Tải lại
            </Nut>
            <Nut kieu="tron" co="lon" onClick={() => window.location.assign('/')}>
              Về lộ trình
            </Nut>
          </div>

          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-xs text-chu-mo">Chi tiết lỗi</summary>
            <pre className="mt-2 overflow-x-auto rounded-vua bg-nen-chim p-3 text-xs break-words whitespace-pre-wrap text-chu-phu">
              {this.state.loi.message}
            </pre>
            <p className="mt-2 text-xs text-chu-mo">
              Bản đang chạy <span className="font-mono">{__MA_BUILD__}</span>
            </p>
          </details>
        </div>
      </div>
    )
  }
}
