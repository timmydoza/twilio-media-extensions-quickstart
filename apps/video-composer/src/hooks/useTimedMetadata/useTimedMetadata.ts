import { useEffect, useRef } from 'react';
import { Participant, Room, StatsReport } from 'twilio-video';
import { getRemoteAudioTrackData } from '@media-extensions/commons';

export const TIMED_METADATA_INTERVAL = 500;

interface ParticipantObjectWithVolumes {
  [key: string]: { v: number };
}

interface CondensedParticipantObjectWithVolumes {
  [key: string]: number;
}

function getTimedMetadataString(stats: StatsReport[], participants: Participant[]) {
  const participantObjWithVolumes = participants.reduce((prev, participant) => {
    const audioTrack = Array.from(participant.audioTracks.values())[0];

    let volume: number;

    if (audioTrack) {
      if (audioTrack.isTrackEnabled) {
        const audioLevel = getRemoteAudioTrackData(audioTrack.trackSid, stats)?.audioLevel ?? null;
        volume = audioLevel === null ? -2 : audioLevel;
      } else {
        volume = -1; // Muted
      }
    } else {
      volume = -2; // No track subscribed to
    }

    prev[participant.identity] = { v: volume };

    return prev;
  }, {} as ParticipantObjectWithVolumes | CondensedParticipantObjectWithVolumes);

  return JSON.stringify({ p: participantObjWithVolumes, s: Date.now() });
}

export default function useTimedMetadata(room: Room | undefined, participants: Participant[]) {
  const participantsRef = useRef(participants);
  participantsRef.current = participants;

  useEffect(() => {
    const intervalID = setInterval(() => {
      if (room) {
        room.getStats().then((stats) => {
          const timedMetadataString = getTimedMetadataString(stats, participantsRef.current);

          if (window.putMetadataAsync) {
            window.putMetadataAsync({
              request: timedMetadataString,
              onFailure: (errorCode, errorMessage) =>
                console.log('Failed to send timed metadata: ', errorCode, errorMessage),
            });
          }
        });
      }
    }, TIMED_METADATA_INTERVAL);

    return () => {
      clearInterval(intervalID);
    };
  }, [room]);
}
