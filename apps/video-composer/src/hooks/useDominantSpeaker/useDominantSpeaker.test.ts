import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useDominantSpeaker from './useDominantSpeaker';

describe('the useDominantSpeaker hook', () => {
  const mockRoom: any = new EventEmitter();
  mockRoom.dominantSpeaker = 'mockDominantSpeaker';

  it('should return room.dominantSpeaker by default', () => {
    const { result } = renderHook(() => useDominantSpeaker(mockRoom));
    expect(result.current).toBe('mockDominantSpeaker');
  });

  it('should respond to "dominantSpeakerChanged" events', async () => {
    const { result } = renderHook(() => useDominantSpeaker(mockRoom));
    act(() => {
      mockRoom.emit('dominantSpeakerChanged', 'newDominantSpeaker');
    });
    expect(result.current).toBe('newDominantSpeaker');
  });

  it('should set "null" when there is no dominant speaker', () => {
    const { result } = renderHook(() => useDominantSpeaker(mockRoom));
    expect(result.current).toBe('mockDominantSpeaker');
    act(() => {
      mockRoom.emit('dominantSpeakerChanged', null);
    });
    expect(result.current).toBe(null);
  });

  it('should return "null" as the default value when there is no room', () => {
    const { result } = renderHook(() => useDominantSpeaker(undefined));
    expect(result.current).toBe(null);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useDominantSpeaker(mockRoom));
    expect(mockRoom.listenerCount('dominantSpeakerChanged')).toBe(1);
    unmount();
    expect(mockRoom.listenerCount('dominantSpeakerChanged')).toBe(0);
  });
});
