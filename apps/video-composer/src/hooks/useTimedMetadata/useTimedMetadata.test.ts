import { renderHook } from '@testing-library/react-hooks';
import useTimedMetadata, { TIMED_METADATA_INTERVAL } from './useTimedMetadata';

jest.useFakeTimers();

describe('the useTimedMetadata function', () => {
  let mockStats: any;
  let mockRoom: any;
  let mockParticipants: any;

  beforeEach(() => {
    window.context = {
      TWILIO_ACCESS_TOKEN: 'mock-token',
    };

    Date.now = () => 1632193775265;
    window.putMetadataAsync = jest.fn();

    mockStats = [
      {
        localAudioTrackStats: [],
        localVideoTrackStats: [],
        peerConnectionId: '',
        remoteAudioTrackStats: [{ trackSid: '1', audioLevel: 50 }],
        remoteVideoTrackStats: [],
      },
    ];
    mockRoom = { getStats: () => Promise.resolve(mockStats) };

    mockParticipants = [
      { identity: 'test-user-1', audioTracks: new Map([[1, { trackSid: '1', isTrackEnabled: true }]]) },
    ];
  });

  describe('when no room is present', () => {
    it('should not make requests to the timed metadata function', async () => {
      renderHook(() => useTimedMetadata(undefined, []));
      jest.advanceTimersByTime(TIMED_METADATA_INTERVAL);
      await Promise.resolve(); // Skips a tick
      expect(window.putMetadataAsync).not.toHaveBeenCalled();
    });
  });

  it('should call putMetadataAsync with the correct timed metadata payload', async () => {
    renderHook(() => useTimedMetadata(mockRoom, mockParticipants));
    jest.advanceTimersByTime(TIMED_METADATA_INTERVAL);
    await Promise.resolve(); // Skips a tick
    expect(window.putMetadataAsync).toHaveBeenCalledWith({
      request: JSON.stringify({
        p: {
          'test-user-1': { v: 50 },
        },
        s: 1632193775265,
      }),
      onFailure: expect.any(Function),
    });
  });

  it('should correctly respond to participants joining and leaving the room', async () => {
    const mockParticipants: any = [
      { identity: 'test-user-1', audioTracks: new Map([[1, { trackSid: '1', isTrackEnabled: true }]]) },
    ];

    const { rerender } = renderHook(() => useTimedMetadata(mockRoom, mockParticipants));

    jest.advanceTimersByTime(TIMED_METADATA_INTERVAL);
    await Promise.resolve(); // Skips a tick
    expect(window.putMetadataAsync).toHaveBeenLastCalledWith(
      expect.objectContaining({
        request: JSON.stringify({
          p: {
            'test-user-1': { v: 50 },
          },
          s: 1632193775265,
        }),
        onFailure: expect.any(Function),
      })
    );

    mockParticipants.push({
      identity: 'test-user-2',
      audioTracks: new Map([[2, { trackSid: '2', isTrackEnabled: false }]]),
    });
    rerender();

    jest.advanceTimersByTime(TIMED_METADATA_INTERVAL);
    await Promise.resolve(); // Skips a tick
    expect(window.putMetadataAsync).toHaveBeenLastCalledWith(
      expect.objectContaining({
        // Here test-user-2 has volume of -1 to show that their audio track has isTrackEnabled: false
        request: JSON.stringify({
          p: {
            'test-user-1': { v: 50 },
            'test-user-2': { v: -1 },
          },
          s: 1632193775265,
        }),
        onFailure: expect.any(Function),
      })
    );

    mockParticipants.push({
      identity: 'test-user-3',
      audioTracks: new Map([]),
    });
    rerender();

    jest.advanceTimersByTime(TIMED_METADATA_INTERVAL);
    await Promise.resolve(); // Skips a tick
    expect(window.putMetadataAsync).toHaveBeenLastCalledWith(
      expect.objectContaining({
        // Here test-user-3 has volume of -2 to show that they do not have an audio track published
        request: JSON.stringify({
          p: {
            'test-user-1': { v: 50 },
            'test-user-2': { v: -1 },
            'test-user-3': { v: -2 },
          },
          s: 1632193775265,
        }),
        onFailure: expect.any(Function),
      })
    );

    // Removes test-user-1
    mockParticipants.shift();
    rerender();

    jest.advanceTimersByTime(TIMED_METADATA_INTERVAL);
    await Promise.resolve(); // Skips a tick
    expect(window.putMetadataAsync).toHaveBeenLastCalledWith({
      request: JSON.stringify({
        p: {
          'test-user-2': { v: -1 },
          'test-user-3': { v: -2 },
        },
        s: 1632193775265,
      }),
      onFailure: expect.any(Function),
    });
  });
});
