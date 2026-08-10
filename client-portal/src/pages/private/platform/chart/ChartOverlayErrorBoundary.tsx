import { Component, ErrorInfo, ReactNode } from "react";

export class ChartOverlayErrorBoundary extends Component<{ name: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Optional chart overlay disabled", { overlay: this.props.name, error: error.name, componentStack: info.componentStack }); }
  render() { return this.state.failed ? <p className="chart-overlay-error" role="status">{this.props.name} unavailable. The market chart remains active.</p> : this.props.children; }
}
