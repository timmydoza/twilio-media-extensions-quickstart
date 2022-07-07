import { decorator as TwilioVideoMockDecorator } from '../src/stories/mocks/twilio-video.js';

// Add the decorator to all stories
export const decorators = [TwilioVideoMockDecorator];

export const parameters = {
  layout: 'fullscreen',
  viewport: {
    defaultViewport: '720p',
    viewports: {
      'Full size': {
        name: 'Full size',
        styles: {
          width: '100%',
          height: '100%',
        },
      },
      '720p': {
        name: '720p',
        styles: {
          width: '1280px',
          height: '720px',
        },
      },
      '1080p': {
        name: '1080p',
        styles: {
          width: '1920px',
          height: '1080px',
        },
      },
    },
  },
};
