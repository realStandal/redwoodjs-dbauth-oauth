import { useEffect, useRef } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { Link, navigate, routes } from '@redwoodjs/router'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import OAuthButtons from 'src/components/OAuthButtons'

const LoginPage = () => {
  const { isAuthenticated, logIn } = useAuth()

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
    const response = await logIn({ ...data })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Welcome back!')
    }
  }

  return (
    <>
      <MetaTags title="Login" />
      <div className="card">
        <div className="auth-card-body">
          <header className="auth-header">
            <h2>Login</h2>
            <p>
              Enter your account&apos;s e-mail address and password, or use one
              of our supported providers.
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
                  required: {
                    value: true,
                    message: 'An e-mail address is required to login.',
                  },
                }}
              />
              <FieldError name="username" className="invalid-feedback" />
            </div>

            <div className="form-group">
              <Label name="password" className="form-label">
                Password
              </Label>
              <PasswordField
                name="password"
                className="form-control"
                autoComplete="current-password"
                validation={{
                  required: {
                    value: true,
                    message: 'A password is required to login.',
                  },
                }}
              />
              <div className="d-flex flex-row-reverse mt-2">
                <Link
                  className="link-secondary small"
                  to={routes.forgotPassword()}
                >
                  Forgot Password?
                </Link>
              </div>
              <FieldError name="password" className="invalid-feedback" />
            </div>

            <div className="d-grid gap-3">
              <Submit className="btn btn-primary">Login</Submit>
              <OAuthButtons />
            </div>
          </Form>
        </div>
      </div>
      <div className="my-3 text-center w-100">
        <span className="text-muted">Don&apos;t have an account?</span>{' '}
        <Link to={routes.signup()} className="link-primary">
          Sign up!
        </Link>
      </div>
    </>
  )
}

export default LoginPage
