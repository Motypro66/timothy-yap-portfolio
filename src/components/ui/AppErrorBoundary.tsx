import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[portfolio]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="room-shell room-shell--fallback">
          <div className="app-error">
            <p className="app-error__label type-label">Room preview paused</p>
            <h1 className="app-error__title type-display">Timothy Yap</h1>
            <p className="app-error__line type-body">
              The 3D room could not load in this browser. Scroll to explore, or refresh once.
            </p>
            <p className="app-error__detail type-caption">{this.state.error.message}</p>
            <button
              type="button"
              className="magnetic-btn magnetic-btn--primary"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
