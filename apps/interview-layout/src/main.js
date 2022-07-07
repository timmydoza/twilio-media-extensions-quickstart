import Video from 'twilio-video';

if (process.env.NODE_ENV !== 'production') {
  // These variables will be provided by a MediaProcessor and be accessible within the window.context object.
  // In local development we need to fake them in order to "simulate" the MediaProcessor.
  window.context = {
    TWILIO_ACCESS_TOKEN: process.env.TWILIO_ACCESS_TOKEN,
    ENV_INTERVIEW_TITLE: 'Interview with John Doe',
  };
}

const token = window.context?.TWILIO_ACCESS_TOKEN;
const title = window.context?.ENV_INTERVIEW_TITLE || 'You might need to change this!';

// Update header base on context variables
document.querySelector('.title').innerText = title;

const options = {
  audio: false,
  video: false,
  tracks: [],
  // Whether to enable the Dominant Speaker API or not. This only takes effect in Group Rooms.
  dominantSpeaker: true,
};

const createParticipantElement = (participant) => {
  const div = document.createElement('div');
  div.id = participant.sid;
  div.className = 'participant';
  div.innerHTML = `
      <span class="no-video">${participant.identity}</span>
      <p class="participant-name">${participant.identity}</p>
    `;
  document.querySelector('.participants').appendChild(div);
};

const handleParticipantConnected = (participant) => {
  console.log(`Participant ${participant.identity} connected`);

  const showMuteParticipantIcon = () => {
    const participantContainer = document.getElementById(participant.sid);
    const span = document.createElement('span');
    const muteIconUrl = new URL('./assets/muteIcon.svg', import.meta.url);
    span.className = 'muted-icon';
    span.innerHTML = `<img src=${muteIconUrl} alt="Mute Icon" />`;
    participantContainer.appendChild(span);
  };

  const removeMuteParticipantIcon = () => {
    const participantContainer = document.getElementById(participant.sid);
    const muteIcon = participantContainer.querySelector('.muted-icon');
    muteIcon.remove();
  };

  const handleTrackAttachment = (track) => {
    const participantContainer = document.getElementById(participant.sid);
    if (track.kind === 'video') {
      participantContainer.classList.add('has-video');
    }

    if (track.kind === 'audio') {
      if (!track.isEnabled) {
        showMuteParticipantIcon();
      }
    }

    participantContainer.appendChild(track.attach());

    track.on('enabled', removeMuteParticipantIcon);
    track.on('disabled', showMuteParticipantIcon);
  };

  const handleTrackPublished = (publication) => {
    if (publication.track) {
      handleTrackAttachment(publication.track);
    }
    publication.on('subscribed', handleTrackAttachment);
    publication.on('unsubscribed', handleTrackUnpublished);
  };

  const handleTrackUnpublished = (track) => {
    const participantDiv = document.getElementById(participant.sid);
    if (track.kind === 'video') {
      participantDiv.classList.remove('has-video');
    }

    track.detach().forEach((element) => element.remove());
  };

  // Create a Participant Container
  createParticipantElement(participant);

  participant.tracks.forEach(handleTrackPublished);

  participant.on('trackPublished', handleTrackPublished);
};

const handleDominantSpeakerChanged = (participant) => {
  const participants = document.querySelectorAll('.participant');
  participants.forEach((participant) => {
    participant.classList.remove('dominant-speaker');
  });
  const participantDiv = document.getElementById(participant.sid);
  participantDiv.classList.add('dominant-speaker');
};

const handleParticipantDisconnected = (participant) => {
  const participantDiv = document.getElementById(participant.sid);
  participantDiv.remove();
};

Video.connect(token, options)
  .then((room) => {
    room.on('participantConnected', handleParticipantConnected);
    room.on('participantDisconnected', handleParticipantDisconnected);
    room.on('dominantSpeakerChanged', handleDominantSpeakerChanged);
    room.participants.forEach(handleParticipantConnected);
  })
  .catch((error) => {
    console.error('Something went wrong:', error);
  });
