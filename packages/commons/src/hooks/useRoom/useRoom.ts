import { connect, Room } from 'twilio-video';
import { useState, useEffect } from 'react';

const videoOptions = {
  dominantSpeaker: true,
  bandwidthProfile: {
    video: {
      mode: 'grid',
      clientTrackSwitchOffControl: 'manual',
    },
  },
};

export const useRoom = ({ isVideo = false }: { isVideo?: boolean } = {}) => {
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    const token = window.context?.TWILIO_ACCESS_TOKEN;
    const environment = window.context?.TWILIO_ENVIRONMENT ?? 'prod';

    if (token && typeof room === 'undefined') {
      connect(token, {
        audio: false,
        video: false,
        tracks: [],
        ...(isVideo ? videoOptions : {}),
        // @ts-ignore - internal property
        environment,
      }).then((room) => {
        setRoom(room);

        //@ts-ignore
        window.twilioRoom = room;
      });
    }
  }, [room]);

  return room;
};
