export declare global {
    interface Window {
      context?: {
        TWILIO_ENVIRONMENT?: 'dev' | 'stage';
        TWILIO_ACCESS_TOKEN?: string;
        TWILIO_PLAYER_STREAMER_SID?: string;
        ENV_METADATA_FORMAT?: 'condensed';
      };
    }
  }