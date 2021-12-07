import { useEffect } from 'react'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { handleOAuth } from 'src/util/oauth'

import BusinessDeal from './business_deal.svg'

const getTitle = (error: string) => {
  if (!error) return 'OAuth Access Granted'

  switch (error) {
    case 'access_denied':
      return 'OAuth Grant Rejected'

    default:
      return 'OAuth Grant Error'
  }
}

export interface GrantPageProps {
  code: string
  state: string
  //
  error?: string
  error_description?: string
  error_uri?: string
}

const GrantPage = ({
  code,
  error,
  error_description,
  state,
}: GrantPageProps) => {
  useEffect(() => {
    if (error) {
      switch (error) {
        case 'access_denied': {
          const timeout = setTimeout(() => window.close(), 5000)
          return () => clearTimeout(timeout)
        }

        default: {
          error_description && toast.error(error_description)
          return
        }
      }
    }

    toast.promise(handleOAuth({ code, state }), {
      error: (err: Error) => err.message,
      loading: "Logging you in using the provider's OAuth access code.",
      success: 'Successfully logged in. This page will close in 5s.',
    })
  }, [code, error, error_description, state])

  return (
    <>
      <MetaTags title="OAuth Confirmation" />
      {!error && (
        <BusinessDeal
          className="d-block mx-auto mb-4"
          height="auto"
          width="40%"
        />
      )}
      <div className="card">
        <div className="auth-card-body">
          <header className="auth-header mb-0">
            <h2>{getTitle(error)}</h2>
            {error && <p>This page should close in 5 seconds.</p>}
            {!error && (
              <p>
                Our request to log you in using a third-party provider was
                accepted.
              </p>
            )}
          </header>
        </div>
      </div>
    </>
  )
}

export default GrantPage
