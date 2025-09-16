"use client";

import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CommentsErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

function CommentsErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
}) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          Comments Error
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Something went wrong while loading the comments. Please try refreshing the page.
        </p>
        <Button
          onClick={() => {
            resetErrorBoundary();
            window.location.reload();
          }}
          size="sm"
          variant="outline"
        >
          <RefreshCw className="mr-2 size-4" />
          Refresh Page
        </Button>
      </CardContent>
    </Card>
  );
}

export function CommentsErrorBoundary({ 
  children, 
  fallback 
}: CommentsErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : CommentsErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Comments error:", error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}