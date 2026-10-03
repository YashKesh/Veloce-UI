import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar } from '../Navbar'

describe('Navbar', () => {
  it('renders as <header> with <nav aria-label="Main">', () => {
    const { container } = render(
      <Navbar>
        <Navbar.Brand>Veloce</Navbar.Brand>
      </Navbar>,
    )
    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav.tagName).toBe('NAV')
  })

  it('sticky applies position: sticky inline', () => {
    const { container } = render(
      <Navbar sticky>
        <Navbar.Brand>Veloce</Navbar.Brand>
      </Navbar>,
    )
    const header = container.querySelector('header') as HTMLElement
    expect(header.style.position).toBe('sticky')
    expect(header.style.top).toBe('0px')
  })

  it('sticky=false does not apply position: sticky', () => {
    const { container } = render(
      <Navbar sticky={false}>
        <Navbar.Brand>Veloce</Navbar.Brand>
      </Navbar>,
    )
    const header = container.querySelector('header') as HTMLElement
    expect(header.style.position).not.toBe('sticky')
  })

  it('announcement renders above the main bar', () => {
    const { container } = render(
      <Navbar announcement={<span>News!</span>}>
        <Navbar.Brand>Veloce</Navbar.Brand>
      </Navbar>,
    )
    const header = container.querySelector('header')!
    const announcement = header.querySelector('[data-vl-navbar-announcement]')
    const nav = header.querySelector('nav')
    expect(announcement).toBeInTheDocument()
    expect(screen.getByText('News!')).toBeInTheDocument()
    // announcement should come before nav
    const children = Array.from(header.children)
    expect(children.indexOf(announcement as Element)).toBeLessThan(children.indexOf(nav as Element))
  })

  it('Navbar.Link active has aria-current="page"', () => {
    render(
      <Navbar>
        <Navbar.Nav>
          <Navbar.Link href="/a" active>
            Analytics
          </Navbar.Link>
        </Navbar.Nav>
      </Navbar>,
    )
    const link = screen.getByText('Analytics').closest('a')!
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('Navbar.Brand with href renders as <a>', () => {
    render(<Navbar><Navbar.Brand href="/">Veloce</Navbar.Brand></Navbar>)
    const brand = screen.getByText('Veloce').closest('a')
    expect(brand).toBeInTheDocument()
    expect(brand).toHaveAttribute('href', '/')
  })

  it('composition: Brand + Nav + Actions render in order', () => {
    const { container } = render(
      <Navbar>
        <Navbar.Brand>Brand</Navbar.Brand>
        <Navbar.Nav>
          <Navbar.Link href="/x">Link</Navbar.Link>
        </Navbar.Nav>
        <Navbar.Actions>
          <button>Act</button>
        </Navbar.Actions>
      </Navbar>,
    )
    const nav = container.querySelector('nav')!
    const kids = Array.from(nav.children)
    const brand = container.querySelector('[data-vl-navbar-brand]')
    const navEl = container.querySelector('[data-vl-navbar-nav]')
    const actions = container.querySelector('[data-vl-navbar-actions]')
    expect(brand).toBeInTheDocument()
    expect(navEl).toBeInTheDocument()
    expect(actions).toBeInTheDocument()
    expect(kids.indexOf(brand as Element)).toBeLessThan(kids.indexOf(navEl as Element))
    expect(kids.indexOf(navEl as Element)).toBeLessThan(kids.indexOf(actions as Element))
  })
})
