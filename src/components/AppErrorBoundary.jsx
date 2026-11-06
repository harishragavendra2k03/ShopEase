import { Component } from "react";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ShopEase encountered an unexpected error.", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error-fallback" role="alert">
          <h1>Something went wrong</h1>
          <p>ShopEase could not display this page. Please try again.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
