# RedwoodJS: OAuth integration with dbAuth

This repository houses a set of OAuth integrations for [RedwoodJS' dbAuth](https://redwoodjs.com/docs/authentication#self-hosted-auth-installation-and-setup):

* Integration with [3rd-party identity providers](#3rd-party-identity-provider-integration).

## 3rd-Party Identity Provider Integration

Support for the following OAuth-compatible platforms (identity providers) can be found in this repository:

* [Discord](https://discord.com/developers/docs/topics/oauth2#oauth2)
* [GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow)

### CSRF Prevention

**All** requests to a 3rd-party identity provider make use of the [OAuth-standard state parameter](https://auth0.com/docs/configure/attack-protection/state-parameters) to mitigate CSRF attacks. This value is generated at the start of each OAuth request, and is stored using the browser's [`SessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) interface.

When a user is redirected after authorizing the OAuth request, the returned state-value is checked against the one in storage. If there is a match: the request is allowed and the user is authenticated; if there is *not* a match: the request is discarded, the user is notified of the possible attack, and the user is *not* authenticated.

This mitigation takes place **entirely** on the client. The web-side generates a random value, adds it to the OAuth request, stores the value, and performs response-matching *without* contacting the API.
