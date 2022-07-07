import { render } from '@testing-library/react';
import MediaTrack from './MediaTrack';

const getMockTrack = (kind: 'audio' | 'video') => ({
  kind,
  attach: jest.fn(),
  detach: jest.fn(),
});

describe('the MediaTrack component', () => {
  it('should render a video element when kind is "video"', () => {
    const mockTrack = getMockTrack('video');
    const { container } = render(<MediaTrack track={mockTrack as any} />);
    const element = container.querySelector('video')!;
    expect(element.muted).toBe(true);
    expect(element.tagName).toBe('VIDEO');
    expect(mockTrack.attach).toHaveBeenCalledTimes(1);
  });

  it('should render an audio element when kind is "audio"', () => {
    const mockTrack = getMockTrack('audio');
    const { container } = render(<MediaTrack track={mockTrack as any} />);
    const element = container.querySelector('audio')!;
    expect(element.muted).toBe(false);
    expect(element.tagName).toBe('AUDIO');
    expect(mockTrack.attach).toHaveBeenCalledTimes(1);
  });

  it('should call track.detach on unmount', () => {
    const mockTrack = getMockTrack('video');
    const { unmount } = render(<MediaTrack track={mockTrack as any} />);
    expect(mockTrack.detach).toHaveBeenCalledTimes(0);
    unmount();
    expect(mockTrack.detach).toHaveBeenCalledTimes(1);
  });
});
