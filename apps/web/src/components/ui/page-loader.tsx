import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export function PageLoader({ size = "md", text, fullScreen = false }: PageLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-surface z-50"
    : "flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`animate-spin text-secondary ${sizeClasses[size]}`} />
        {text && <p className="text-sm text-on-surface-variant">{text}</p>}
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10">
          <Loader2 className="animate-spin text-secondary h-8 w-8" />
        </div>
      )}
    </div>
  );
}
