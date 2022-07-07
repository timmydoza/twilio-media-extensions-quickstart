import { render } from '@testing-library/react';
import EventEmitter from 'events';
import PresentationParticipant from './PresentationParticipant';

describe('the PresentationParticipant component', () => {
  it('should render a video element when there is a presentation track', () => {
    const mockParticipant = new EventEmitter() as any;
    mockParticipant.tracks = new Map([
      [0, { track: { name: 'video-composer-presentation', kind: 'video', attach: () => {}, detach: () => {} } }],
    ]);

    const { container } = render(<PresentationParticipant participant={mockParticipant as any} />);
    expect(container.querySelector('video')).toBeTruthy();
  });

  it('should not render a video element when there is not a presentation track', () => {
    const mockParticipant = new EventEmitter() as any;
    mockParticipant.tracks = new Map();

    const { container } = render(<PresentationParticipant participant={mockParticipant as any} />);
    expect(container.querySelector('video')).toBe(null);
  });
});
