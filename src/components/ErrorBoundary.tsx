import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Search,
  Bug
} from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // TODO: Send to error reporting service
    this.logErrorToService(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // TODO: Integrate with error reporting service like Sentry
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.error('Error report:', errorData);
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              We're sorry, but something unexpected happened. Our team has been notified.
            </p>
            
            <div className="space-y-3">
              <Button onClick={this.handleRetry} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button variant="outline" onClick={this.handleReload} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              
              <Button variant="outline" onClick={this.handleGoHome} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Development mode error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  <Bug className="w-4 h-4 inline mr-1" />
                  Error Details (Dev Mode)
                </summary>
                <div className="mt-2 p-3 bg-muted rounded text-xs font-mono">
                  <div className="text-destructive font-semibold">
                    {this.state.error.message}
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap text-muted-foreground">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}

            <div className="mt-6 text-xs text-muted-foreground">
              If this problem persists, please contact support
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Network Error Component
export function NetworkError({ 
  onRetry, 
  message = "Unable to connect to our servers" 
}: { 
  onRetry: () => void;
  message?: string;
}) {
  return (
    <Card className="p-6 text-center">
      <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
      <h3 className="font-semibold mb-2">Connection Problem</h3>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      <Button onClick={onRetry} size="sm">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </Card>
  );
}

// Enhanced 404 Component
export function Enhanced404() {
  const handleSearch = (query: string) => {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3 mb-6">
          <Button onClick={() => window.location.href = '/'} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/browse'} 
            className="w-full"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Prompts
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mb-3">
          Or try searching for:
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {['coding', 'writing', 'marketing', 'design'].map(term => (
            <Button
              key={term}
              variant="outline"
              size="sm"
              onClick={() => handleSearch(term)}
            >
              {term}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}