import { Toaster } from '@redwoodjs/web/toast'

type AuthLayoutProps = {
  children?: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <Toaster
        toastOptions={{
          className: 'rw-toast',
          duration: 6000,
          position: 'bottom-center',
        }}
      />
      <main className="auth-layout">{children}</main>
    </>
  )
}

export default AuthLayout
