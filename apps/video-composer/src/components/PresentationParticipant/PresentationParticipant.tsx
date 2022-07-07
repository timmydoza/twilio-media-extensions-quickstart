import { RemoteParticipant, RemoteVideoTrack } from 'twilio-video';
import { useTracks } from '@media-extensions/commons';

import MediaTrack from '../MediaTrack/MediaTrack';

export default function PresentationParticipant({ participant }: { participant: RemoteParticipant }) {
  const tracks = useTracks(participant);
  const presentationTrack = tracks.find((track) => track.name === 'video-composer-presentation') as RemoteVideoTrack;

  if (!presentationTrack) return null;

  return (
    <div>
      <MediaTrack track={presentationTrack} />
    </div>
  );
}
