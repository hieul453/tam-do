import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/lib/auth'
import { LuoiAnToan } from '@/components/LuoiAnToan'
import { batTuCapNhat } from '@/lib/tu-cap-nhat'
import App from '@/App'
import '@/styles/index.css'

batTuCapNhat()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Ngoài cùng: lỗi ở bất cứ provider nào bên trong cũng còn chỗ hứng. */}
    <LuoiAnToan>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </LuoiAnToan>
  </StrictMode>,
)
