import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, TooltipProvider } from '../Tooltip'

describe('Tooltip', () => {
  it('renders trigger', () => {
    render(
      <TooltipProvider openDelay={0} closeDelay={0}>
        <Tooltip content="hi"><button>trig</button></Tooltip>
      </TooltipProvider>,
    )
    expect(screen.getByText('trig')).toBeInTheDocument()
  })

  it('shows on hover', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider openDelay={0} closeDelay={0}>
        <Tooltip content="tip"><button>trig</button></Tooltip>
      </TooltipProvider>,
    )
    await user.hover(screen.getByText('trig'))
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
  })

  it('shows on focus', async () => {
    render(
      <TooltipProvider openDelay={0} closeDelay={0}>
        <Tooltip content="tip"><button>trig</button></Tooltip>
      </TooltipProvider>,
    )
    screen.getByText('trig').focus()
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
  })

  it('hides on blur', async () => {
    render(
      <TooltipProvider openDelay={0} closeDelay={0}>
        <Tooltip content="tip"><button>trig</button></Tooltip>
      </TooltipProvider>,
    )
    const btn = screen.getByText('trig')
    btn.focus()
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
    btn.blur()
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })

  it('aria-describedby set when open', async () => {
    render(
      <TooltipProvider openDelay={0} closeDelay={0}>
        <Tooltip content="tip"><button>trig</button></Tooltip>
      </TooltipProvider>,
    )
    const btn = screen.getByText('trig')
    btn.focus()
    await waitFor(() => expect(btn).toHaveAttribute('aria-describedby'))
  })
})
