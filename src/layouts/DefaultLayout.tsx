import { Outlet } from 'react-router-dom'
import { Header } from '../components/common/layouts/Header/Header'
import { Sidebar } from '../components/common/layouts/Sidebar/Sidebar'
import { Footer } from '../components/common/layouts/Footer/Footer'
import { ModalProvider } from '@/components/common/modal/ModalProvider'
import { Toaster } from 'sonner'

export const DefaultLayout: React.FC = () => {
  return (
    <ModalProvider>
      <div className="flex min-h-screen bg-gray-50 overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />

          <main className="flex-1 overflow-y-auto bg-background text-foreground">
            <div className="p-8">
              <Outlet />
              <Toaster
                toastOptions={{
                  classNames: {
                    error: 'bg-red-50! border-red-200! text-red-900!',
                    success: 'bg-green-50! border-green-200! text-green-900!',
                    warning:
                      'bg-yellow-50! border-yellow-200! text-yellow-900!',
                    info: 'bg-blue-50! border-blue-200! text-blue-900!',
                  },
                }}
              />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </ModalProvider>
  )
}
