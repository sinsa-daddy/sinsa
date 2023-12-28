import { Button, Result } from 'antd';
import type { ErrorInfo } from 'react';
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string;
}

export class ErrorBoundary extends React.Component<
  { children?: React.ReactNode },
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  state: ErrorBoundaryState = { hasError: false, errorInfo: '' };

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service

    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Result
          status="error"
          title="页面发生了错误"
          subTitle={`醒山小狗报错: ${this.state.errorInfo}`}
          extra={[
            <Button
              type="primary"
              key="refresh"
              onClick={e => {
                e.stopPropagation();
                window.location.reload();
              }}
            >
              刷新页面
            </Button>,
          ]}
        />
      );
    }
    return this.props.children;
  }
}
