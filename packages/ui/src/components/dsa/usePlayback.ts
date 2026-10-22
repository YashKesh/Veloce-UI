import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'done'

export interface PlaybackState<S> {
  /** Current step snapshot. */
  snapshot: S
  /** Zero-based index of the current step. */
  stepIndex: number
  /** Total steps (−1 if unknown ahead of time). */
  totalSteps: number
  status: PlaybackStatus
  speed: number
  setSpeed: (ms: number) => void
  play: () => void
  pause: () => void
  stepOnce: () => void
  reset: () => void
}

export interface PlaybackOptions<S> {
  /** Builds the whole step list up-front. Must return at least one entry (the initial state). */
  buildSteps: () => S[]
  /** Milliseconds between auto-advanced steps. Default 500. */
  intervalMs?: number
  /** Autoplay on mount / after build. Default false. */
  autoPlay?: boolean
  /** Callback when playback reaches the final step. */
  onComplete?: (final: S) => void
  /** Dependencies that should rebuild the step list. */
  deps?: unknown[]
}

/**
 * Generic playback engine for every "watch the algorithm run" visualiser.
 * Builds the full step list eagerly (fine for teaching sizes — N<1000) and
 * ticks through it on a timer that can be paused / stepped / reset.
 */
export function usePlayback<S>({
  buildSteps,
  intervalMs = 500,
  autoPlay = false,
  onComplete,
  deps = [],
}: PlaybackOptions<S>): PlaybackState<S> {
  // Rebuild steps whenever deps change.
  const steps = useMemo(() => buildSteps(), deps) // eslint-disable-line react-hooks/exhaustive-deps
  const [stepIndex, setStepIndex] = useState(0)
  const [status, setStatus] = useState<PlaybackStatus>(autoPlay ? 'playing' : 'idle')
  const [speed, setSpeed] = useState(intervalMs)
  const timerRef = useRef<number | null>(null)

  // Reset when the step list changes.
  useEffect(() => {
    setStepIndex(0)
    setStatus(autoPlay ? 'playing' : 'idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps])

  // Auto-tick while playing.
  useEffect(() => {
    if (status !== 'playing') return
    if (stepIndex >= steps.length - 1) {
      setStatus('done')
      onComplete?.(steps[steps.length - 1])
      return
    }
    timerRef.current = window.setTimeout(() => setStepIndex((i) => i + 1), speed)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [status, stepIndex, speed, steps, onComplete])

  const play = useCallback(() => {
    if (stepIndex >= steps.length - 1) setStepIndex(0)
    setStatus('playing')
  }, [stepIndex, steps.length])

  const pause = useCallback(() => setStatus('paused'), [])

  const stepOnce = useCallback(() => {
    setStatus('paused')
    setStepIndex((i) => Math.min(steps.length - 1, i + 1))
  }, [steps.length])

  const reset = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setStepIndex(0)
    setStatus('idle')
  }, [])

  return {
    snapshot: steps[stepIndex],
    stepIndex,
    totalSteps: steps.length,
    status,
    speed,
    setSpeed,
    play,
    pause,
    stepOnce,
    reset,
  }
}
