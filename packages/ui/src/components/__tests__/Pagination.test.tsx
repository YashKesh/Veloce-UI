import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  it('renders page numbers for small page count', () => {
    render(<Pagination page={1} pageCount={5} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('clicking a page fires onPageChange', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<Pagination page={1} pageCount={5} onPageChange={fn} />)
    await user.click(screen.getByText('3'))
    expect(fn).toHaveBeenCalledWith(3)
  })

  it('shows ellipsis for many pages', () => {
    render(<Pagination page={10} pageCount={20} />)
    expect(screen.getAllByText('…').length).toBeGreaterThan(0)
  })

  it('prev disabled on first page', () => {
    render(<Pagination page={1} pageCount={5} />)
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('next disabled on last page', () => {
    render(<Pagination page={5} pageCount={5} />)
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('aria-current on active page', () => {
    render(<Pagination page={2} pageCount={5} />)
    expect(screen.getByText('2')).toHaveAttribute('aria-current', 'page')
  })

  it('arrow keys change page when focused', () => {
    const fn = vi.fn()
    render(<Pagination page={2} pageCount={5} onPageChange={fn} />)
    const nav = screen.getByRole('navigation')
    fireEvent.keyDown(nav, { key: 'ArrowRight' })
    expect(fn).toHaveBeenCalledWith(3)
  })
})
