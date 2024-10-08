import React from "react";
import { FallbackProps } from "react-error-boundary";

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="container">
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <button className="btn btn-primary" onClick={resetErrorBoundary}>Home</button>
    </div>
  );
};

export default ErrorFallback;