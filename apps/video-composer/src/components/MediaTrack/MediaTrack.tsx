import { RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';
import { useEffect, useRef } from 'react';

export default function MediaTrack({ track }: { track: RemoteAudioTrack | RemoteVideoTrack }) {
  const ref = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const el = ref.current;

    if (track.kind === 'video') {
      // Mute video tracks to avoid autoplay policy issues when using this app in a local browser
      el.muted = true;
    } else {
      el.muted = false;
    }

    track.attach(el);
    return () => {
      track.detach(el);
    };
  }, [track]);

  return <track.kind ref={ref} />;
}
