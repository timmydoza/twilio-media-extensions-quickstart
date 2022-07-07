import App from '../App';

export default {
  title: 'App',
  component: App,
  layout: 'fullscreen',
  argTypes: {
    participants: {
      control: { type: 'range', min: 0, max: 15, step: 1 },
    },
    dominantSpeaker: {
      control: { type: 'text' },
    },
    presentationParticipant: {
      control: { type: 'text' },
    },
    disableAllAudio: {
      control: { type: 'boolean' },
    },
    disableAllVideo: {
      control: { type: 'boolean' },
    },
    unpublishAllAudio: {
      control: { type: 'boolean' },
    },
    unpublishAllVideo: {
      control: { type: 'boolean' },
    },
    switchOffAllVideo: {
      control: { type: 'boolean' },
    },
  },
};

const Template = (args) => <App {...args} />;

export const Prod = Template.bind({});
Prod.args = {
  participants: 1,
  dominantSpeaker: null,
  presentationParticipant: null,
  disableAllAudio: false,
  disableAllVideo: false,
  unpublishAllAudio: false,
  unpublishAllVideo: false,
  switchOffAllVideo: false,
};
Prod.loaders = [
  () =>
    (window.context = {
      TWILIO_ACCESS_TOKEN: 'test-twilio-token',
    }),
];

export const HiddenIdentities = Template.bind({});
HiddenIdentities.args = {
  participants: 1,
  dominantSpeaker: null,
  presentationParticipant: null,
  disableAllAudio: false,
  disableAllVideo: false,
  unpublishAllAudio: false,
  unpublishAllVideo: false,
  switchOffAllVideo: false,
};
HiddenIdentities.loaders = [
  () =>
    (window.context = {
      TWILIO_ACCESS_TOKEN: 'test-twilio-token',
      ENV_hideParticipantIdentities: true,
    }),
];
