import { render } from '@redwoodjs/testing/web'

import AuthLayout from './AuthLayout'

describe('AuthLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AuthLayout />)
    }).not.toThrow()
  })
})
