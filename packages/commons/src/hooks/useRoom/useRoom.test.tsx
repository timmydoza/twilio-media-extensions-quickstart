import { renderHook } from '@testing-library/react-hooks';
import { connect } from 'twilio-video';
import { useRoom } from './useRoom';

jest.mock('twilio-video', () => ({
  connect: jest.fn(() => Promise.resolve('mock-room')),
}));

describe('the useRoom hook', () => {
  beforeEach(() => {
    window.context = {
      TWILIO_ACCESS_TOKEN: 'test-token',
    };
  });

  describe('when TWILIO_ACCESS_TOKEN is not present', () => {
    it('should not connect to a room', async () => {
      window.context = {};
      const { waitForNextUpdate } = renderHook(useRoom);
      return expect(waitForNextUpdate()).rejects.toThrow();
    });
  });

  describe('when TWILIO_ACCESS_TOKEN is present and a room is not already connected to', () => {
    it('should connect to a room', async () => {
      const { result, waitForNextUpdate } = renderHook(useRoom);
      await waitForNextUpdate();
      expect(result.current).toEqual('mock-room');
      expect(connect).toHaveBeenCalledWith('test-token', {
        audio: false,
        environment: 'prod',
        tracks: [],
        video: false,
      });
    });

    it('should connect to a "stage" room when TWILIO_ENVIRONMENT is "stage"', async () => {
      window.context = {
        TWILIO_ACCESS_TOKEN: 'test-token',
        TWILIO_ENVIRONMENT: 'stage',
      };
      const { waitForNextUpdate } = renderHook(useRoom);
      await waitForNextUpdate();
      expect(connect).toHaveBeenCalledWith('test-token', {
        audio: false,
        environment: 'stage',
        tracks: [],
        video: false,
      });
    });
  });

  describe('when is a video room, TWILIO_ACCESS_TOKEN is present and a room is not already connected to', () => {
    it('should connect to a room', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useRoom({ isVideo: true }));
      await waitForNextUpdate();
      expect(result.current).toEqual('mock-room');
      expect(connect).toHaveBeenCalledWith('test-token', {
        audio: false,
        environment: 'prod',
        dominantSpeaker: true,
        tracks: [],
        video: false,
        bandwidthProfile: {
          video: {
            mode: 'grid',
            clientTrackSwitchOffControl: 'manual',
          },
        },
      });
    });
  });
});
