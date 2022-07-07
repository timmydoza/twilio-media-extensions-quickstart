import { useEffect, useState } from 'react';
import { RemoteParticipant, Room } from 'twilio-video';

/*
  Returns the participant that is presenting video content to the main view. This hook assumes that only one participant
  can present at a time.
*/

export default function usePresentationParticipant(room: Room | undefined) {
  const [presentationParticipant, setPresentationParticipant] = useState<RemoteParticipant>();

  useEffect(() => {
    if (room) {
      const updatePresentationParticipant = () => {
        setPresentationParticipant((prevPresentationParticipant) => {
          const participants = Array.from(room.participants.values());

          const presentationParticipants: (RemoteParticipant | undefined)[] = participants.filter((participant) => {
            const participantTrackPublications = Array.from(participant.tracks.values());
            return participantTrackPublications.some(
              (trackPublication) =>
                trackPublication.trackName.includes('video-composer-presentation') && trackPublication.kind === 'video'
            );
          });

          // If the active presentationParticipant (the 'prevPresentationParticipant') is not in the list of current presentationParticipants,
          // then replace them with the first presentationParticipant in the list (which could be undefined).

          // This prevents a new presentationParticipant from being the active presentationParticipant when there
          // is already an active presentationParticipant.
          if (!presentationParticipants.includes(prevPresentationParticipant)) {
            return presentationParticipants[0];
          } else {
            return prevPresentationParticipant;
          }
        });
      };

      updatePresentationParticipant();

      room.on('trackPublished', updatePresentationParticipant);
      room.on('trackUnpublished', updatePresentationParticipant);
      room.on('participantConnected', updatePresentationParticipant);
      room.on('participantDisconnected', updatePresentationParticipant);

      return () => {
        room.off('trackPublished', updatePresentationParticipant);
        room.off('trackUnpublished', updatePresentationParticipant);
        room.off('participantConnected', updatePresentationParticipant);
        room.off('participantDisconnected', updatePresentationParticipant);
      };
    }
  }, [room]);

  return presentationParticipant;
}
