import { Component } from 'react'

export class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('GlobalErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReport = () => {
    const message = `Error: ${this.state.error?.message}\nStack: ${this.state.error?.stack}\nComponent: ${this.state.errorInfo?.componentStack}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090E] text-on-surface flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-4">Something went wrong</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-primary-container text-on-primary-container rounded font-label-md text-label-md hover:opacity-90 transition-opacity"
              >
                Reload
              </button>
              <button
                onClick={this.handleReport}
                className="px-4 py-2 bg-surface-container text-on-surface rounded font-label-md text-label-md border border-outline hover:border-primary transition-colors"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}