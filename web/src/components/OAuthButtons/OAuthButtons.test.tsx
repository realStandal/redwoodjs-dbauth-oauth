import { render } from '@redwoodjs/testing/web'

import OAuthButtons from './OAuthButtons'

describe('OAuthButtons', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OAuthButtons />)
    }).not.toThrow()
  })
})
