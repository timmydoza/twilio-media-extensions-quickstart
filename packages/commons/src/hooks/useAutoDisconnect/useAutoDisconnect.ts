import { useEffect, useRef } from 'react';
import { Participant, Room } from 'twilio-video';

export const AUTO_DISCONNECT_DELAY = 1000 * 60 * 5; // Five minutes

// This hook will automatically disconnect the MediaComposer from a room
// when there are no other participants in the room for five minutes.
// This allows the room to automatically close itself, which can then trigger
// a status callback which can be used to stop the Live Streaming resources.
export const useAutoDisconnect = (room: Room | undefined, participants: Participant[]) => {
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (room && participants.length === 0) {
      timeoutRef.current = window.setTimeout(() => {
        console.log('automatically disconnected from empty room');
        room.disconnect();
      }, AUTO_DISCONNECT_DELAY);

      return () => {
        window.clearTimeout(timeoutRef.current);
      };
    }
  }, [participants, room]);

  return null;
}
