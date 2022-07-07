import { RemoteAudioTrack, RemoteParticipant, RemoteVideoTrack } from 'twilio-video';
import { useIsTrackEnabled, useTracks, useIsTrackSwitchedOff } from '@media-extensions/commons';
import { MARGIN } from '../../constants';
import MediaTrack from '../MediaTrack/MediaTrack';
import MutedIcon from './MutedIcon';

const borderWidth = 3;

export default function Participant({
  participant,
  width,
  height,
  isDominantSpeaker,
  fontSize,
}: {
  participant: RemoteParticipant;
  width: string;
  height: string;
  isDominantSpeaker: boolean;
  fontSize: string;
}) {
  const tracks = useTracks(participant);

  const audioTrack = tracks.find((track) => track.kind === 'audio') as RemoteAudioTrack;
  const isAudioEnabled = useIsTrackEnabled(audioTrack);

  const videoTrack = tracks.find(
    (track) => track.kind === 'video' && track.name !== 'video-composer-presentation'
  ) as RemoteVideoTrack;
  const isVideoEnabled = useIsTrackEnabled(videoTrack);
  const isVideoTrackSwitchedOff = useIsTrackSwitchedOff(videoTrack);

  return (
    <div
      className="participant"
      style={{
        width,
        height,
        margin: isDominantSpeaker ? MARGIN - borderWidth : MARGIN,
        border: isDominantSpeaker ? `solid ${borderWidth}px #7BEAA5` : 'none',
      }}
      data-cy-participant={participant.identity}
    >
      {!isAudioEnabled && <MutedIcon />}
      {audioTrack && <MediaTrack track={audioTrack} />}

      {(!isVideoEnabled || isVideoTrackSwitchedOff) && (
        <div style={{ fontSize }} className="noVideo">
          {!window.context?.ENV_hideParticipantIdentities && participant.identity}
        </div>
      )}

      {videoTrack && <MediaTrack track={videoTrack} />}

      {!window.context?.ENV_hideParticipantIdentities && <p>{participant.identity}</p>}
    </div>
  );
}
