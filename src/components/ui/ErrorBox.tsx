import React from 'react';
import './ErrorBox.css';

interface ErrorBoxProps {
  message: string;
  recoveryAction?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({
  message,
  recoveryAction,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="error-box">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3 className="error-title">Error</h3>
        <p className="error-message">{message}</p>
        {recoveryAction && <p className="error-action">{recoveryAction}</p>}
      </div>
      <div className="error-buttons">
        {onRetry && (
          <button className="error-btn error-btn--primary" onClick={onRetry}>
            Retry
          </button>
        )}
        {onDismiss && (
          <button className="error-btn error-btn--secondary" onClick={onDismiss}>
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBox;
