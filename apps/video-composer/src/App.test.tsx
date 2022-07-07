import App from './App';
import { shallow } from 'enzyme';
import usePresentationParticipant from './hooks/usePresentationParticipant/usePresentationParticipant';

const mockParticipants = [
  { identity: 'test-participant-1' },
  { identity: 'test-participant-2' },
  { identity: 'test-participant-3' },
];

jest.mock('@media-extensions/commons', () => ({
  ...jest.requireActual('@media-extensions/commons'),
  useRoom: jest.fn(),
}));
jest.mock('./constants', () => ({ SIDEBAR_PARTICIPANTS: 2, ASPECT_RATIO: 9 / 16 }));
jest.mock('./hooks/useRemoteParticipants/useRemoteParticipants', () => () => mockParticipants);
jest.mock('./hooks/useDominantSpeaker/useDominantSpeaker', () => () => mockParticipants[0]);
jest.mock('./hooks/usePresentationParticipant/usePresentationParticipant');
jest.mock('./hooks/useGridLayout/useGridLayout', () => () => ({
  participantVideoWidth: 720,
  containerRef: 'mockRef',
}));

const mockUsePresentationParticipant = usePresentationParticipant as jest.Mock<any>;

describe('App component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<App />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when presentation mode is active', () => {
    mockUsePresentationParticipant.mockImplementationOnce(() => mockParticipants[1]);
    const wrapper = shallow(<App />);
    expect(wrapper).toMatchSnapshot();
  });
});
