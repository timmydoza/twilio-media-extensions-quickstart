import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

type putMetadataAsyncArgs = {
  request: string;
  onSuccess?: (response: string) => void;
  onFailure?: (errCode: number, errMessage: string) => void;
};

declare global {
  interface Window {
    putMetadataAsync: (props: putMetadataAsyncArgs) => number;
    context?: {
      TWILIO_ENVIRONMENT?: 'dev' | 'stage';
      TWILIO_ACCESS_TOKEN?: string;
      ENV_hideParticipantIdentities?: boolean;
    };
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
