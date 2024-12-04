// src/components/ErrorFallback.tsx
import { FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4 bg-red-50 border border-red-400 rounded">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
        {error.message}
      </pre>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
}

export default ErrorFallback;