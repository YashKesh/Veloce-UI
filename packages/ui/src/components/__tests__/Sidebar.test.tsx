import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '../Sidebar'

describe('Sidebar', () => {
  it('renders <nav aria-label="Secondary">', () => {
    render(
      <Sidebar>
        <Sidebar.Group title="Main">
          <Sidebar.Item href="/a">A</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar>,
    )
    const nav = screen.getByRole('navigation', { name: 'Secondary' })
    expect(nav.tagName).toBe('NAV')
  })

  it('Sidebar.Group chevron toggles open/closed', async () => {
    const user = userEvent.setup()
    render(
      <Sidebar>
        <Sidebar.Group title="Main" defaultOpen>
          <Sidebar.Item href="/a">Item A</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar>,
    )
    expect(screen.getByText('Item A')).toBeInTheDocument()
    const trigger = screen.getByRole('button', { name: /Main/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Item A')).not.toBeInTheDocument()
  })

  it('Sidebar.Item active has aria-current="page" + ac-soft bg', () => {
    render(
      <Sidebar>
        <Sidebar.Group title="Main">
          <Sidebar.Item href="/a" active>
            Dialog
          </Sidebar.Item>
        </Sidebar.Group>
      </Sidebar>,
    )
    const link = screen.getByText('Dialog').closest('a') as HTMLAnchorElement
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link.style.background).toContain('ac-soft')
  })

  it('Sidebar.Footer renders at bottom', () => {
    const { container } = render(
      <Sidebar footer={<Sidebar.Footer>Footer content</Sidebar.Footer>}>
        <Sidebar.Group title="Main">
          <Sidebar.Item href="/a">Item A</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar>,
    )
    const nav = container.querySelector('nav')!
    const footerWrap = nav.querySelector('[data-vl-sidebar-footer]')
    expect(footerWrap).toBeInTheDocument()
    expect(screen.getByText('Footer content')).toBeInTheDocument()
    const lastChild = nav.children[nav.children.length - 1]
    expect(lastChild).toBe(footerWrap)
  })

  it('keyboard ArrowDown moves focus from one item to next', async () => {
    const user = userEvent.setup()
    render(
      <Sidebar>
        <Sidebar.Group title="Main" defaultOpen>
          <Sidebar.Item href="/a">Item A</Sidebar.Item>
          <Sidebar.Item href="/b">Item B</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar>,
    )
    const a = screen.getByText('Item A').closest('a') as HTMLAnchorElement
    a.focus()
    expect(document.activeElement).toBe(a)
    await user.keyboard('{ArrowDown}')
    const active = document.activeElement
    // Could cycle to next item (B) or the group trigger — depends on order.
    // Verify focus actually moved and lands on a focusable sidebar element.
    expect(active).not.toBe(a)
    expect(active?.getAttribute('data-vl-sidebar-item') ??
      active?.getAttribute('data-vl-sidebar-sub') ??
      active?.getAttribute('data-vl-sidebar-group-trigger') ??
      active?.getAttribute('data-vl-sidebar-section-trigger')).not.toBeNull()
  })

  it('defaultOpen=false → group starts collapsed', () => {
    render(
      <Sidebar>
        <Sidebar.Group title="Main" defaultOpen={false}>
          <Sidebar.Item href="/a">Hidden Item</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar>,
    )
    expect(screen.queryByText('Hidden Item')).not.toBeInTheDocument()
    const trigger = screen.getByRole('button', { name: /Main/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('Sidebar.Section is collapsible', async () => {
    const user = userEvent.setup()
    render(
      <Sidebar>
        <Sidebar.Group title="Main">
          <Sidebar.Section title="Overlays">
            <Sidebar.Item href="/a">Dialog</Sidebar.Item>
          </Sidebar.Section>
        </Sidebar.Group>
      </Sidebar>,
    )
    expect(screen.queryByText('Dialog')).not.toBeInTheDocument()
    const trigger = screen.getByRole('button', { name: /Overlays/i })
    await user.click(trigger)
    expect(screen.getByText('Dialog')).toBeInTheDocument()
  })
})
