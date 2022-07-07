import { act, renderHook } from '@testing-library/react-hooks';
import { EventEmitter } from 'events';
import usePresentationParticipant from './usePresentationParticipant';

function MockRoom() {
  const mockRoom = new EventEmitter() as any;
  const mockLocalParticipant = new EventEmitter() as any;
  mockLocalParticipant.tracks = new Map();

  mockRoom.localParticipant = mockLocalParticipant;
  mockRoom.state = 'connected';
  mockRoom.participants = new Map();
  return mockRoom;
}

describe('the usePresentationParticipant hook', () => {
  it('return undefined when there are no participants presenting', () => {
    const { result } = renderHook(usePresentationParticipant);
    expect(result.current).toEqual(undefined);
  });

  it('should return a remoteParticipant when they are presenting a video track', () => {
    const mockRoom = MockRoom();
    const mockParticipant = {
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'video' }]]),
    };
    mockRoom.participants = new Map([[0, mockParticipant]]);

    const { result } = renderHook(() => usePresentationParticipant(mockRoom));
    expect(result.current).toEqual(mockParticipant);
  });

  it('should return the remoteParticipant who is first to have a presentation track', () => {
    const mockRoom = MockRoom();
    const mockParticipant1 = {
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'video' }]]),
    };
    const mockParticipant2 = {
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'video' }]]),
    };

    mockRoom.participants = new Map([
      [0, mockParticipant1],
      [1, mockParticipant2],
    ]);

    const { result } = renderHook(() => usePresentationParticipant(mockRoom));

    expect(result.current).toBe(mockParticipant1);
  });

  it('should return the remoteParticipant that publishes a presentation track first', () => {
    const mockRoom = MockRoom();
    const mockParticipant = {
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'video' }]]),
    };
    const mockParticipant2 = {
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'video' }]]),
    };

    const { result } = renderHook(() => usePresentationParticipant(mockRoom));

    act(() => {
      mockRoom.participants = new Map([[0, mockParticipant2]]);
      mockRoom.emit('trackPublished');
    });

    expect(result.current).toBe(mockParticipant2);

    act(() => {
      mockRoom.participants = new Map([
        [0, mockParticipant2],
        [1, mockParticipant],
      ]);
      mockRoom.emit('trackPublished');
    });

    expect(result.current).toBe(mockParticipant2);
  });

  it('should ignore new participants with a presentation track when there is already an active presentation participant', () => {
    const mockRoom = MockRoom();
    const mockParticipant = {
      identity: 'mockParticipant',
      tracks: new Map(),
    };
    const mockParticipant2 = {
      identity: 'mockParticipant2',
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'video' }]]),
    };

    const { result } = renderHook(() => usePresentationParticipant(mockRoom));

    act(() => {
      mockRoom.participants = new Map([
        [0, mockParticipant],
        [1, mockParticipant2],
      ]);
      mockRoom.emit('trackPublished');
    });

    expect(result.current).toBe(mockParticipant2);

    act(() => {
      mockParticipant.tracks.set(0, { trackName: 'video-composer-presentation', kind: 'video' });
      mockRoom.emit('trackPublished');
    });

    expect(result.current).toBe(mockParticipant2);
  });

  it('should return the first remoteParticipant that publishes a video track named "video-composer-presentation"', () => {
    const mockRoom = MockRoom();
    const mockParticipant1 = {
      tracks: new Map([[0, { trackName: '', kind: 'audio' }]]),
    };
    const mockParticipant2 = {
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'data' }]]),
    };
    const mockParticipant3 = {
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'video' }]]),
    };

    const { result } = renderHook(() => usePresentationParticipant(mockRoom));

    act(() => {
      mockRoom.participants = new Map([[0, mockParticipant1]]);
      mockRoom.emit('trackPublished');
    });

    expect(result.current).toEqual(undefined);

    act(() => {
      mockRoom.participants = new Map([
        [0, mockParticipant1],
        [1, mockParticipant2],
      ]);
      mockRoom.emit('trackPublished');
    });

    expect(result.current).toEqual(undefined);

    act(() => {
      mockRoom.participants = new Map([
        [0, mockParticipant1],
        [1, mockParticipant2],
        [3, mockParticipant3],
      ]);
      mockRoom.emit('trackPublished');
    });

    expect(result.current).toEqual(mockParticipant3);
  });

  it('should respond to "trackPublished" and "trackUnpublished" events emitted from the room', () => {
    const mockRoom = MockRoom();
    const mockParticipant = {
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'video' }]]),
    };

    const { result } = renderHook(() => usePresentationParticipant(mockRoom));
    expect(result.current).toEqual(undefined);

    act(() => {
      mockRoom.participants = new Map([[0, mockParticipant]]);
      mockRoom.emit('trackPublished');
    });

    expect(result.current).toEqual(mockParticipant);

    act(() => {
      mockRoom.participants = new Map([]);
      mockRoom.emit('trackUnpublished');
    });

    expect(result.current).toEqual(undefined);
  });

  it('should respond to "participantConnected" events emitted from the room', () => {
    const mockRoom = MockRoom();

    mockRoom.participants = new Map([]);

    const { result } = renderHook(() => usePresentationParticipant(mockRoom));

    expect(result.current).toEqual(undefined);

    const mockParticipant = {
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'video' }]]),
    };

    act(() => {
      mockRoom.participants = new Map([[0, mockParticipant]]);
      mockRoom.emit('participantConnected');
    });

    expect(result.current).toEqual(mockParticipant);
  });

  it('should respond to "participantDisconnected" events emitted from the room', () => {
    const mockRoom = MockRoom();
    const mockParticipant = {
      tracks: new Map([[0, { trackName: 'video-composer-presentation', kind: 'video' }]]),
    };
    mockRoom.participants = new Map([[0, mockParticipant]]);

    const { result } = renderHook(() => usePresentationParticipant(mockRoom));

    expect(result.current).toEqual(mockParticipant);

    act(() => {
      mockRoom.participants = new Map();
      mockRoom.emit('participantDisconnected');
    });

    expect(result.current).toEqual(undefined);
  });

  it('should clean up all listeners when unmounted', () => {
    const mockRoom = MockRoom();

    const { unmount } = renderHook(() => usePresentationParticipant(mockRoom));

    expect(mockRoom.listenerCount('trackPublished')).toBe(1);
    expect(mockRoom.listenerCount('trackUnpublished')).toBe(1);
    expect(mockRoom.listenerCount('participantConnected')).toBe(1);
    expect(mockRoom.listenerCount('participantDisconnected')).toBe(1);

    unmount();

    expect(mockRoom.listenerCount('trackPublished')).toBe(0);
    expect(mockRoom.listenerCount('trackUnpublished')).toBe(0);
    expect(mockRoom.listenerCount('participantConnected')).toBe(0);
    expect(mockRoom.listenerCount('participantDisconnected')).toBe(0);
  });
});
