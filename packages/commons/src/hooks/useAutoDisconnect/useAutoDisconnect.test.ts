import { renderHook } from '@testing-library/react-hooks';
import { useAutoDisconnect, AUTO_DISCONNECT_DELAY } from './useAutoDisconnect';

jest.useFakeTimers();

describe('the useAutoDisconnect hook', () => {
  it('should disconnect from a room when it has been empty for AUTO_DISCONNECT_DELAY', () => {
    const mockRoom = { disconnect: jest.fn() };
    renderHook(() => useAutoDisconnect(mockRoom as any, []));
    jest.advanceTimersByTime(AUTO_DISCONNECT_DELAY);
    expect(mockRoom.disconnect).toHaveBeenCalled();
  });

  it('should not disconnect from a room when it is not empty', () => {
    const mockRoom = { disconnect: jest.fn() };
    renderHook(() => useAutoDisconnect(mockRoom as any, ['mockParticipant'] as any));
    jest.advanceTimersByTime(AUTO_DISCONNECT_DELAY);
    expect(mockRoom.disconnect).not.toHaveBeenCalled();
  });

  it('should clear the timeout function when a participant joins an empty room', () => {
    const mockRoom = { disconnect: jest.fn() };
    jest.spyOn(window, 'clearTimeout');
    const { rerender } = renderHook(({ room, participants }: any) => useAutoDisconnect(room as any, participants), {
      initialProps: { room: mockRoom, participants: [] },
    });
    rerender({ room: mockRoom, participants: ['mockParticipant'] as any });
    jest.advanceTimersByTime(AUTO_DISCONNECT_DELAY);
    expect(window.clearTimeout).toHaveBeenCalledWith(expect.any(Number));
    expect(mockRoom.disconnect).not.toHaveBeenCalled();
  });
});
