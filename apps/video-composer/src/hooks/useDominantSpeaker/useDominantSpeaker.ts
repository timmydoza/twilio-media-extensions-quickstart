import { useEffect, useState } from 'react';
import { RemoteParticipant, Room } from 'twilio-video';

export default function useDominantSpeaker(room: Room | undefined) {
  const [dominantSpeaker, setDominantSpeaker] = useState(room?.dominantSpeaker ?? null);

  useEffect(() => {
    if (room) {
      const handleDominantSpeakerChanged = (newDominantSpeaker: RemoteParticipant) => {
        setDominantSpeaker(newDominantSpeaker);
      };

      room.on('dominantSpeakerChanged', handleDominantSpeakerChanged);
      return () => {
        room.off('dominantSpeakerChanged', handleDominantSpeakerChanged);
      };
    }
  }, [room, dominantSpeaker]);

  return dominantSpeaker;
}
