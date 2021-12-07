import { useEffect, useRef } from 'react'
import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import OAuthButtons from 'src/components/OAuthButtons'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  // focus on email box on page load
  const usernameRef = useRef<HTMLInputElement>()
  useEffect(() => {
    usernameRef.current.focus()
  }, [])

  const onSubmit = async (data) => {
    const response = await signUp({ ...data })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('Welcome!')
    }
  }

  return (
    <>
      <MetaTags title="Signup" />
      <div className="card">
        <div className="auth-card-body">
          <header className="auth-header">
            <h2>Sign Up</h2>
            <p>
              Create an account using the form below or import one using our
              supported providers.
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
                    message: 'An e-mail address is required to signup.',
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
                    message: 'A password is required to signup.',
                  },
                }}
              />
              <FieldError name="password" className="invalid-feedback" />
            </div>

            <div className="d-grid gap-3">
              <Submit className="btn btn-primary">Sign Up</Submit>
              <OAuthButtons />
            </div>
          </Form>
        </div>
      </div>
      <div className="my-3 text-center w-100">
        <span>Already have an account?</span>{' '}
        <Link to={routes.login()} className="rw-link">
          Log in!
        </Link>
      </div>
    </>
  )
}

export default SignupPage
