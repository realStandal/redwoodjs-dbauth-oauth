import { render } from '@redwoodjs/testing/web'

import GrantPage from './GrantPage'

describe('GrantPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<GrantPage />)
    }).not.toThrow()
  })
})
