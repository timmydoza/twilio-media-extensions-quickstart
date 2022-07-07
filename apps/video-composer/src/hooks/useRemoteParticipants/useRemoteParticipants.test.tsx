import { act, renderHook } from '@testing-library/react-hooks';
import { useRoom } from '@media-extensions/commons';
import EventEmitter from 'events';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useRemoteParticipants from './useRemoteParticipants';
import usePresentationParticipant from '../usePresentationParticipant/usePresentationParticipant';

jest.mock('@media-extensions/commons');
jest.mock('../useDominantSpeaker/useDominantSpeaker');
jest.mock('../usePresentationParticipant/usePresentationParticipant');

const mockUseDominantSpeaker = useDominantSpeaker as jest.Mock<any>;
const mockUseRoom = useRoom as jest.Mock<any>;
const mockUsePresentationParticipant = usePresentationParticipant as jest.Mock<any>;

describe('the useRemoteParticipants hook', () => {
  let mockRoom: any;

  beforeEach(() => {
    mockRoom = new EventEmitter();
    mockRoom.participants = new Map([
      [0, 'participant1'],
      [1, 'participant2'],
    ]);
    mockUseDominantSpeaker.mockImplementation(() => null);
    mockUseRoom.mockImplementation(() => mockRoom);
  });

  it('should return an array of mockParticipants by default', () => {
    const { result } = renderHook(() => useRemoteParticipants(mockRoom));
    expect(result.current).toEqual(['participant1', 'participant2']);
  });

  it('should handle "participantConnected" events', async () => {
    const { result } = renderHook(() => useRemoteParticipants(mockRoom));
    act(() => {
      mockRoom.emit('participantConnected', 'newParticipant');
    });
    expect(result.current).toEqual(['participant1', 'participant2', 'newParticipant']);
  });

  it('should handle "participantDisconnected" events', async () => {
    const { result } = renderHook(() => useRemoteParticipants(mockRoom));
    act(() => {
      mockRoom.emit('participantDisconnected', 'participant1');
    });
    expect(result.current).toEqual(['participant2']);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useRemoteParticipants(mockRoom));
    unmount();
    expect(mockRoom.listenerCount('participantConnected')).toBe(0);
    expect(mockRoom.listenerCount('participantDisconnected')).toBe(0);
  });

  describe('dominant speaker updates', () => {
    it('should return the connected participants when dominantSpeaker is not null, but not connected', () => {
      const mockParticipants = new Map([
        [0, 'participant1'],
        [1, 'participant3'],
      ]);

      mockRoom.participants = mockParticipants;
      const mockParticipantsArray = Array.from(mockParticipants.values());

      const { result, rerender } = renderHook(() => useRemoteParticipants(mockRoom));
      expect(result.current).toEqual(mockParticipantsArray);

      mockUseDominantSpeaker.mockImplementation(() => 'participant2');
      rerender();

      expect(result.current).toEqual(['participant1', 'participant3']);
    });

    describe('when presentation mode is not active', () => {
      beforeAll(() => {
        mockUsePresentationParticipant.mockImplementation(() => false);
      });

      it('should not reorder participants when there are less than 10 and the dominant speaker changes', () => {
        const mockParticipants = new Map([
          [0, 'participant1'],
          [1, 'participant2'],
          [2, 'participant3'],
          [3, 'participant4'],
          [4, 'participant5'],
          [5, 'participant6'],
          [6, 'participant7'],
          [7, 'participant8'],
          [8, 'participant9'],
        ]);
        mockRoom.participants = mockParticipants;
        const mockParticipantsArray = Array.from(mockParticipants.values());

        const { result, rerender } = renderHook(() => useRemoteParticipants(mockRoom));
        expect(result.current).toEqual(mockParticipantsArray);

        mockUseDominantSpeaker.mockImplementation(() => 'participant9');
        rerender();

        expect(result.current).toEqual(mockParticipantsArray);
      });

      it('should replace the oldest onscreen dominant speaker with the new dominant speaker if they are offscreen', () => {
        const mockParticipants = new Map([
          [0, 'participant1'],
          [1, 'participant2'],
          [2, 'participant3'],
          [3, 'participant4'],
          [4, 'participant5'],
          [5, 'participant6'],
          [6, 'participant7'],
          [7, 'participant8'],
          [8, 'participant9'],
          [9, 'participant10'],
          [10, 'participant11'],
        ]);
        mockRoom.participants = mockParticipants;
        const mockParticipantsArray = Array.from(mockParticipants.values());

        const { result, rerender } = renderHook(() => useRemoteParticipants(mockRoom));
        expect(result.current).toEqual(mockParticipantsArray);

        // dominant speaker updates:
        mockUseDominantSpeaker.mockImplementation(() => 'participant9');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant8');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant7');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant11');
        rerender();

        expect(result.current).toEqual([
          'participant11',
          'participant2',
          'participant3',
          'participant4',
          'participant5',
          'participant6',
          'participant7',
          'participant8',
          'participant9',
          'participant10',
          'participant1',
        ]);

        // more dominant speaker updates:
        mockUseDominantSpeaker.mockImplementation(() => 'participant1');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant3');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant5');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant10');
        rerender();

        expect(result.current).toEqual([
          'participant11',
          'participant1',
          'participant3',
          'participant10',
          'participant5',
          'participant6',
          'participant7',
          'participant8',
          'participant9',
          'participant2',
          'participant4',
        ]);
      });
    });

    describe('when presentation mode is active', () => {
      beforeAll(() => {
        mockUsePresentationParticipant.mockImplementation(() => true);
      });

      it('should not reorder participants when there are less than SIDEBAR_PARTICIPANTS - 1 (4) and the dominant speaker changes', () => {
        const mockParticipants = new Map([
          [0, 'participant1'],
          [1, 'participant2'],
          [2, 'participant3'],
          [3, 'participant4'],
        ]);
        mockRoom.participants = mockParticipants;
        const mockParticipantsArray = Array.from(mockParticipants.values());

        const { result, rerender } = renderHook(() => useRemoteParticipants(mockRoom));
        expect(result.current).toEqual(mockParticipantsArray);

        mockUseDominantSpeaker.mockImplementation(() => 'participant4');
        rerender();

        expect(result.current).toEqual(mockParticipantsArray);
      });

      it('should replace the oldest onscreen dominant speaker with the new dominant speaker if they are offscreen', () => {
        const mockParticipants = new Map([
          [0, 'participant1'],
          [1, 'participant2'],
          [2, 'participant3'],
          [3, 'participant4'],
          [4, 'participant5'],
          [5, 'participant6'],
          [6, 'participant7'],
        ]);
        mockRoom.participants = mockParticipants;
        const mockParticipantsArray = Array.from(mockParticipants.values());

        const { result, rerender } = renderHook(() => useRemoteParticipants(mockRoom));
        expect(result.current).toEqual(mockParticipantsArray);

        // dominant speaker updates:
        mockUseDominantSpeaker.mockImplementation(() => 'participant7');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant2');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant6');
        rerender();

        expect(result.current).toEqual([
          'participant7',
          'participant2',
          'participant6',
          'participant4',
          'participant5',
          'participant1',
          'participant3',
        ]);

        // more dominant speaker updates:
        mockUseDominantSpeaker.mockImplementation(() => 'participant5');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant1');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant3');
        rerender();

        expect(result.current).toEqual([
          'participant1',
          'participant3',
          'participant6',
          'participant5',
          'participant4',
          'participant7',
          'participant2',
        ]);
      });
    });
  });
});
