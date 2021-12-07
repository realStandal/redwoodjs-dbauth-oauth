import { toast } from '@redwoodjs/web/toast'

import { randomStr } from 'src/util/randomStr'

const OAUTH_STATE_LENGTH = 40
const OAUTH_STATE_STORAGE_KEY = 'oauth.state'
const OAUTH_PROVIDER_STORAGE_KEY = 'oauth.provider'
const OAUTH_REDIRECT_URL = process.env.OAUTH_REDIRECT_URL

export const OAuthProviders = ['github', 'discord', 'twitch'] as const
export type OAuthProvider = typeof OAuthProviders[number]
export interface OAuthProviderData {
  client_id: string
  scope: string
  url: string
}

export interface OAuthResponse {
  code: string
  state: string
}

/**
 * A `map` of supported OAuth providers to their OAuth configuration.
 */
const OAuthData: Record<OAuthProvider, OAuthProviderData> = {
  discord: {
    client_id: process.env.DISCORD_OAUTH_CLIENT_ID,
    scope: process.env.DISCORD_OAUTH_SCOPE,
    url: process.env.DISCORD_OAUTH_URL,
  },
  github: {
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
    scope: process.env.GITHUB_OAUTH_SCOPE,
    url: process.env.GITHUB_OAUTH_URL,
  },
  twitch: {
    client_id: process.env.TWITCH_OAUTH_CLIENT_ID,
    scope: process.env.TWITCH_OAUTH_SCOPE,
    url: process.env.TWITCH_OAUTH_URL,
  },
}

/**
 * Generates an OAuth handler (function) which can be used to
 * initiate an authentication flow with the given identity provider.
 *
 * Calling the handler will:
 * * Generate and store a [state](https://auth0.com/docs/configure/attack-protection/state-parameters) value.
 * * Open a browser window to the provider's OAuth `/authenticate` page, with `client_id`,
 * `redirect_uri`, and `state` values provided.
 *
 * @param {SupportedProvider} provider One of the supported providers
 * @returns {() => void}
 */
export const requestOAuth = (provider: OAuthProvider) => () => {
  if (!OAuthProviders.includes(provider)) {
    toast.error(`The ${provider} OAuth provider is not supported.`)
    return
  }

  window.sessionStorage.setItem(OAUTH_PROVIDER_STORAGE_KEY, provider)

  const state = randomStr(OAUTH_STATE_LENGTH)
  window.sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state)

  const data = OAuthData[provider]
  const url = `${data.url}\
?client_id=${data.client_id}\
&redirect_uri=${OAUTH_REDIRECT_URL}\
&response_type=token\
&scope=${data.scope}\
&state=${state}`

  // Open the OAuth authorization request in a minified pop-up window.
  window.open(url, 'OAuth Authorization Grant', 'left=250,width=500')
}

export const handleOAuth = async ({ code, state }: OAuthResponse) => {
  if (!code) throw new Error('An authorization grant code is required.')
  if (!state) throw new Error('A state parameter is required.')

  const provider = window.sessionStorage.getItem(
    OAUTH_PROVIDER_STORAGE_KEY
  ) as OAuthProvider
  const storedState = window.sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY)

  if (!provider || !OAuthProviders.includes(provider))
    throw new Error('Could not retrieve stored OAuth provider.')

  if (!state)
    throw new Error('Could not retrieve stored OAuth state parameter.')

  if (state !== storedState)
    throw new Error('Could not validate OAuth state parameter.')

  // send code and provider to the API

  setTimeout(() => {
    const url = new URL(window.opener.location.href)
    const redirectTo = url.searchParams.get('redirectTo') || url.href
    window.opener.location.href = redirectTo

    window.close()
  }, 5000)
}
