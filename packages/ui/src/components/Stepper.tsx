import { forwardRef, Fragment, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export interface StepperStep {
  label: ReactNode
  description?: ReactNode
}

export interface StepperProps extends ComponentProps<'div'> {
  steps: StepperStep[]
  activeStep: number
  orientation?: 'horizontal' | 'vertical'
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  { steps, activeStep, orientation = 'horizontal', className, style, ...rest },
  ref,
) {
  const horiz = orientation === 'horizontal'

  const circleFor = (state: 'complete' | 'active' | 'upcoming', i: number) => (
    <span
      data-vl-stepper-circle=""
      aria-current={state === 'active' ? 'step' : undefined}
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600,
        background: state === 'upcoming' ? 'var(--bg-2)' : 'var(--ac)',
        color: state === 'upcoming' ? 'var(--fg-2)' : 'var(--ac-fg)',
        border: state === 'active' ? '2px solid var(--ac)' : '1px solid var(--line)',
        flexShrink: 0,
      }}
    >
      {state === 'complete' ? '✓' : i + 1}
    </span>
  )

  const labelFor = (s: StepperStep, state: 'complete' | 'active' | 'upcoming') => (
    <div style={{ fontSize: 13, color: 'var(--fg)', textAlign: horiz ? 'center' : 'left' }}>
      <div style={{ fontWeight: state === 'active' ? 600 : 500 }}>{s.label}</div>
      {s.description && (
        <div style={{ color: 'var(--fg-2)', fontSize: 12, marginTop: 2 }}>{s.description}</div>
      )}
    </div>
  )

  if (horiz) {
    return (
      <div
        ref={ref}
        data-vl-stepper=""
        data-orientation="horizontal"
        className={cx('vl-stepper', className)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 0,
          fontFamily: 'var(--font-sans)',
          ...style,
        }}
        {...rest}
      >
        {steps.map((s, i) => {
          const state = i < activeStep ? 'complete' : i === activeStep ? 'active' : 'upcoming'
          const isLast = i === steps.length - 1
          return (
            <Fragment key={i}>
              <div
                data-vl-stepper-step=""
                data-state={state}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {circleFor(state, i)}
                {labelFor(s, state)}
              </div>
              {!isLast && (
                <div
                  data-vl-stepper-line=""
                  aria-hidden
                  style={{ flex: 1, height: 1, background: 'var(--line)', marginTop: 11 }}
                />
              )}
            </Fragment>
          )
        })}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      data-vl-stepper=""
      data-orientation="vertical"
      className={cx('vl-stepper', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 10,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {steps.map((s, i) => {
        const state = i < activeStep ? 'complete' : i === activeStep ? 'active' : 'upcoming'
        const isLast = i === steps.length - 1
        return (
          <Fragment key={i}>
            <div
              data-vl-stepper-step=""
              data-state={state}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              {circleFor(state, i)}
              {labelFor(s, state)}
            </div>
            {!isLast && (
              <span
                data-vl-stepper-line=""
                aria-hidden
                style={{ width: 1, height: 20, marginLeft: 11, background: 'var(--line)' }}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
})
