import { shallow } from 'enzyme';
import { useTracks } from '@media-extensions/commons';
import MutedIcon from './MutedIcon';
import Participant from './Participant';

jest.mock('@media-extensions/commons', () => ({
  ...jest.requireActual('@media-extensions/commons'),
  useTracks: jest.fn(),
}));

const mockUseTracks = useTracks as jest.Mock<any>;

describe('the Participant component', () => {
  beforeEach(() => {
    mockUseTracks.mockImplementation(() => [
      { trackName: 'camera-123456', kind: 'video', trackSid: 'testVideoSid', isEnabled: true },
      { trackName: 'microphone-123456', kind: 'audio', trackSid: 'testAudioSid', isEnabled: true },
    ]);

    window.context = {
      ENV_hideParticipantIdentities: false,
    };
  });

  it('should render correctly when the participant is not the dominant speaker', () => {
    const wrapper = shallow(
      <Participant
        participant={{ identity: 'mockIdentity1' } as any}
        width="200px"
        height="100px"
        isDominantSpeaker={false}
        fontSize="56px"
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when the participant is the dominant speaker', () => {
    const wrapper = shallow(
      <Participant
        participant={{ identity: 'mockIdentity1' } as any}
        width="300px"
        height="200px"
        isDominantSpeaker={true}
        fontSize="32px"
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when the participant has disabled their video', () => {
    mockUseTracks.mockImplementationOnce(() => [
      { trackName: 'camera-123456', kind: 'video', trackSid: 'testVideoSid', isEnabled: false },
      { trackName: 'microphone-123456', kind: 'audio', trackSid: 'testAudioSid', isEnabled: true },
    ]);

    const wrapper = shallow(
      <Participant
        participant={{ identity: 'mockIdentity1' } as any}
        width="300px"
        height="200px"
        isDominantSpeaker={true}
        fontSize="32px"
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when the participant has switched off their video', () => {
    mockUseTracks.mockImplementationOnce(() => [
      { trackName: 'camera-123456', kind: 'video', trackSid: 'testVideoSid', isEnabled: true, isSwitchedOff: true },
      { trackName: 'microphone-123456', kind: 'audio', trackSid: 'testAudioSid', isEnabled: true },
    ]);

    const wrapper = shallow(
      <Participant
        participant={{ identity: 'mockIdentity1' } as any}
        width="400px"
        height="600px"
        isDominantSpeaker={false}
        fontSize="56px"
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when the participant has unpublished their video', () => {
    mockUseTracks.mockImplementationOnce(() => [
      { trackName: 'microphone-123456', kind: 'audio', trackSid: 'testAudioSid', isEnabled: true },
    ]);

    const wrapper = shallow(
      <Participant
        participant={{ identity: 'mockIdentity1' } as any}
        width="400px"
        height="600px"
        isDominantSpeaker={false}
        fontSize="56px"
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should display the muted icon when participant has disabled their audio', () => {
    mockUseTracks.mockImplementationOnce(() => [
      { trackName: 'camera-123456', kind: 'video', trackSid: 'testVideoSid', isEnabled: true },
      { trackName: 'microphone-123456', kind: 'audio', trackSid: 'testAudioSid', isEnabled: false },
    ]);
    const wrapper = shallow(
      <Participant
        participant={{ identity: 'mockIdentity1' } as any}
        width="300px"
        height="200px"
        isDominantSpeaker={true}
        fontSize="32px"
      />
    );

    expect(wrapper.find(MutedIcon).exists()).toBe(true);
  });

  it('should display the muted icon when participant has unpublished their audio', () => {
    mockUseTracks.mockImplementationOnce(() => [
      { trackName: 'camera-123456', kind: 'video', trackSid: 'testVideoSid', isEnabled: true },
    ]);
    const wrapper = shallow(
      <Participant
        participant={{ identity: 'mockIdentity1' } as any}
        width="400px"
        height="600px"
        isDominantSpeaker={true}
        fontSize="32px"
      />
    );

    expect(wrapper.find(MutedIcon).exists()).toBe(true);
  });

  describe('when ENV_hideParticipantIdentities is true', () => {
    beforeEach(() => {
      window.context = {
        ENV_hideParticipantIdentities: true,
      };
    });

    it('should not display the participants identity', () => {
      const wrapper = shallow(
        <Participant
          participant={{ identity: 'mockIdentity1' } as any}
          width="200px"
          height="100px"
          isDominantSpeaker={false}
          fontSize="56px"
        />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('should not display the participants identity when their video is disabled', () => {
      mockUseTracks.mockImplementationOnce(() => [
        { trackName: 'camera-123456', kind: 'video', trackSid: 'testVideoSid', isEnabled: false },
        { trackName: 'microphone-123456', kind: 'audio', trackSid: 'testAudioSid', isEnabled: true },
      ]);

      const wrapper = shallow(
        <Participant
          participant={{ identity: 'mockIdentity1' } as any}
          width="300px"
          height="200px"
          isDominantSpeaker={true}
          fontSize="32px"
        />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
