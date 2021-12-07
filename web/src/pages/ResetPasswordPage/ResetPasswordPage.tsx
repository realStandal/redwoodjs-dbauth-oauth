import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  Label,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const ResetPasswordPage = ({ resetToken }) => {
  const { isAuthenticated, reauthenticate, validateResetToken, resetPassword } =
    useAuth()
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  useEffect(() => {
    const validateToken = async () => {
      const response = await validateResetToken(resetToken)
      if (response.error) {
        setEnabled(false)
        toast.error(response.error)
      } else {
        setEnabled(true)
      }
    }
    validateToken()
  }, [resetToken, validateResetToken])

  const passwordRef = useRef<HTMLInputElement>()
  useEffect(() => {
    passwordRef.current.focus()
  }, [])

  const onSubmit = async (data) => {
    const response = await resetPassword({
      resetToken,
      password: data.password,
    })

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Password changed!')
      await reauthenticate()
      navigate(routes.login())
    }
  }

  return (
    <>
      <MetaTags title="Reset Password" />
      <div className="card">
        <div className="auth-card-body">
          <header className="auth-header">
            <h2>Reset Password</h2>
            <p>
              Update your account&apos;s password and continue to the
              application.
            </p>
          </header>
          <Form onSubmit={onSubmit} className="auth-form">
            <div className="text-left">
              <Label
                name="password"
                className="form-label"
                errorClassName="form-label"
              >
                New Password
              </Label>
              <PasswordField
                name="password"
                autoComplete="new-password"
                className="form-control"
                errorClassName="form-control form-control-error"
                disabled={!enabled}
                ref={passwordRef}
                validation={{
                  required: {
                    value: true,
                    message: 'Password is required',
                  },
                }}
              />

              <FieldError name="password" className="invalid-feedback" />
            </div>

            <div className="d-grid gap-3">
              <Submit className="btn btn-primary" disabled={!enabled}>
                Submit
              </Submit>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default ResetPasswordPage
