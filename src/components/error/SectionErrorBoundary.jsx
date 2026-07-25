import { Component } from 'react'

export class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error(`SectionErrorBoundary [${this.props.section}] caught an error:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[40vh] p-4">
          <div className="text-center">
            <p className="font-body-md text-body-md text-on-surface-variant mb-3">
              Something went wrong in this section.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-primary-container text-on-primary-container rounded font-label-md text-label-md hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}