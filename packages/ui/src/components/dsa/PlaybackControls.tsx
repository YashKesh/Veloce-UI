import type { CSSProperties } from 'react'
import type { PlaybackState } from './usePlayback'

export interface PlaybackControlsProps<S> {
  state: PlaybackState<S>
  /** Optional label shown left of the controls (e.g. "step 4 / 12"). */
  showStepCounter?: boolean
  className?: string
  style?: CSSProperties
}

const btn: CSSProperties = {
  height: 28,
  padding: '0 10px',
  fontSize: 12,
  borderRadius: 'var(--r-sm)',
  border: '1px solid var(--line-2)',
  background: 'var(--bg-2)',
  color: 'var(--fg-2)',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

export function PlaybackControls<S>({ state, showStepCounter = true, className, style }: PlaybackControlsProps<S>) {
  const { status, stepIndex, totalSteps, speed, setSpeed, play, pause, stepOnce, reset } = state
  const isPlaying = status === 'playing'
  const isDone = status === 'done'

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: 6,
        borderRadius: 'var(--r-md)',
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      data-vl-playback-controls=""
    >
      <button
        type="button"
        style={{ ...btn, background: isPlaying ? 'color-mix(in oklch, var(--ac) 15%, var(--bg-1))' : btn.background }}
        onClick={isPlaying ? pause : play}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '❚❚' : isDone ? '↻ replay' : '▶ play'}
      </button>
      <button type="button" style={btn} onClick={stepOnce} aria-label="Step once">
        ↠ step
      </button>
      <button type="button" style={btn} onClick={reset} aria-label="Reset">
        ↺ reset
      </button>
      <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <label htmlFor="vl-playback-speed">speed</label>
        <input
          id="vl-playback-speed"
          type="range"
          min={60}
          max={1200}
          step={20}
          value={1260 - speed}
          onChange={(e) => setSpeed(1260 - Number(e.target.value))}
          style={{ width: 80, accentColor: 'var(--ac)' }}
        />
      </span>
      {showStepCounter && (
        <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', minWidth: 56, textAlign: 'right' }}>
          {Math.min(stepIndex + 1, totalSteps)} / {totalSteps}
        </span>
      )}
    </div>
  )
}
