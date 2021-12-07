import { useEffect, useRef } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { Form, Label, TextField, Submit, FieldError } from '@redwoodjs/forms'

const ForgotPasswordPage = () => {
  const { isAuthenticated, forgotPassword } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  const usernameRef = useRef<HTMLInputElement>()
  useEffect(() => {
    usernameRef.current.focus()
  }, [])

  const onSubmit = async (data) => {
    const response = await forgotPassword(data.username)

    if (response.error) {
      toast.error(response.error)
    } else {
      // The function `forgotPassword.handler` in api/src/functions/auth.js has
      // been invoked, let the user know how to get the link to reset their
      // password (sent in email, perhaps?)
      toast.success(
        'A link to reset your password was sent to ' + response.email
      )
      navigate(routes.login())
    }
  }

  return (
    <>
      <MetaTags title="Forgot Password" />
      <div className="card">
        <div className="auth-card-body">
          <header className="auth-header">
            <h2>Forgot Password</h2>
            <p>
              Enter your account&apos;s e-mail address to send a password reset.
            </p>
          </header>
          <Form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <Label name="username" className="form-label">
                E-Mail Address
              </Label>
              <TextField
                name="username"
                className="form-control"
                ref={usernameRef}
                validation={{
                  required: true,
                }}
              />

              <FieldError name="username" className="invalid-feedback" />
            </div>
            <div className="d-grid gap-3">
              <Submit className="btn btn-primary">Submit</Submit>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default ForgotPasswordPage
