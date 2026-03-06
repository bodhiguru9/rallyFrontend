/**
 * ErrorBoundary Component
 *
 * React Error Boundary to catch and handle errors in the component tree.
 * Shows a native Alert dialog when errors occur and logs error details.
 * In development mode, shows detailed error information.
 * Prevents app from crashing and allows user to try again.
 *
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */

import React, { Component, ReactNode } from 'react';
import { Alert } from 'react-native';
import { logger } from '../logger/logger';

// Declare __DEV__ global
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __DEV__: boolean;

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details
    logger.error('🚨 React Error Boundary caught an error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
    });

    // Update state with error info
    this.setState(
      {
        errorInfo,
      },
      () => {
        // Show alert after state is updated
        this.showErrorAlert(error, errorInfo);
      },
    );

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  showErrorAlert = (error: Error, errorInfo: React.ErrorInfo): void => {
    const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

    if (isDev) {
      // Development mode - show detailed error with options
      const errorSummary = `${error.name}: ${error.message}`;
      const errorDetails = `
Error Name: ${error.name}

Message: ${error.message}

Stack Trace:
${error.stack || 'No stack trace available'}

Component Stack:
${errorInfo.componentStack || 'No component stack available'}
      `.trim();

      Alert.alert(
        '🚨 Error Occurred (Dev Mode)',
        errorSummary,
        [
          {
            text: 'View Full Error',
            onPress: () => {
              Alert.alert('Error Details', errorDetails, [
                {
                  text: 'Dismiss',
                  onPress: () => {
                    logger.info('Error details dismissed');
                  },
                  style: 'cancel',
                },
                {
                  text: 'Try Again',
                  onPress: this.handleReset,
                },
              ]);
            },
          },
          {
            text: 'Try Again',
            onPress: this.handleReset,
          },
          {
            text: 'Dismiss',
            onPress: () => {
              logger.info('Error alert dismissed without reset');
            },
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    } else {
      // Production mode - show simple error message
      Alert.alert(
        'Something went wrong',
        'We encountered an unexpected error. Please try restarting the app.',
        [
          {
            text: 'Try Again',
            onPress: this.handleReset,
          },
          {
            text: 'OK',
            style: 'cancel',
            onPress: () => {
              logger.info('Production error dismissed');
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  handleReset = (): void => {
    logger.info('Error boundary reset - attempting to recover');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    // Always render children - the alert will handle error notification
    // This prevents the app from showing a blank screen
    return this.props.children;
  }
}
