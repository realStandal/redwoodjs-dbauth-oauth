import { OAuthProviders, requestOAuth } from 'src/util/oauth'

const OAuthButtons = () => {
  return (
    <>
      {OAuthProviders.map((v) => (
        <button
          className={`btn btn-${v}`}
          key={v}
          onClick={requestOAuth(v)}
          type="button"
        >
          <i className={`fab fa-${v}`}></i>
          <span>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
        </button>
      ))}
    </>
  )
}

export default OAuthButtons
