import React, { ReactNode } from "react";
import { logInternalError } from "errors/userSafeError";
import "./styles.scss";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary component catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the entire app.
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    this.setState({ errorInfo });
    logInternalError(error, {
        endpoint: "component.error_boundary",
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <div className="error-boundary__content">
              <h1 className="error-boundary__title">Something went wrong</h1>
              <p className="error-boundary__message">
                An unexpected error occurred. Our team has been notified.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="error-boundary__details">
                  <summary>Error Details (Development Only)</summary>
                  <pre className="error-boundary__stack">
                    {this.state.error.toString()}
                    {"\n\n"}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              <button
                className="error-boundary__button"
                onClick={this.resetError}
                type="button"
              >
                Try Again
              </button>
              <a
                className="error-boundary__link"
                href="/"
                title="Go to home page"
              >
                Back to Home
              </a>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
