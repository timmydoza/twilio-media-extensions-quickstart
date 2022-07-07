import { getAllStats, getRemoteAudioTrackData } from './statsUtils';

describe('the getAllStats function', () => {
  it('should return a empty stats object when it receives an empty array', () => {
    const result = {
      localAudioTrackStats: [],
      localVideoTrackStats: [],
      peerConnectionId: '',
      remoteAudioTrackStats: [],
      remoteVideoTrackStats: [],
    };

    expect(getAllStats([])).toEqual(result);
  });

  it('should return an object with stats arrays from local and remote audio and video tracks', () => {
    const data = [
      {
        localAudioTrackStats: ['mockLocalAudioTrack1', 'mockLocalAudioTrack2'],
        localVideoTrackStats: ['mockLocalVideoTrack1', 'mockLocalVideoTrack2'],
        remoteAudioTrackStats: ['mockRemoteAudioTrack1', 'mockRemoteAudioTrack2'],
        remoteVideoTrackStats: ['mockLocalVideoTrack1', 'mockLocalVideoTrack2'],
      },
      {
        localAudioTrackStats: ['mockLocalAudioTrack3', 'mockLocalAudioTrack4'],
        localVideoTrackStats: ['mockLocalVideoTrack3', 'mockLocalVideoTrack4'],
        remoteAudioTrackStats: ['mockRemoteAudioTrack3', 'mockRemoteAudioTrack4'],
        remoteVideoTrackStats: ['mockLocalVideoTrack3', 'mockLocalVideoTrack4'],
      },
    ];
    const result = {
      localAudioTrackStats: [
        'mockLocalAudioTrack1',
        'mockLocalAudioTrack2',
        'mockLocalAudioTrack3',
        'mockLocalAudioTrack4',
      ],
      localVideoTrackStats: [
        'mockLocalVideoTrack1',
        'mockLocalVideoTrack2',
        'mockLocalVideoTrack3',
        'mockLocalVideoTrack4',
      ],
      peerConnectionId: '',
      remoteAudioTrackStats: [
        'mockRemoteAudioTrack1',
        'mockRemoteAudioTrack2',
        'mockRemoteAudioTrack3',
        'mockRemoteAudioTrack4',
      ],
      remoteVideoTrackStats: [
        'mockLocalVideoTrack1',
        'mockLocalVideoTrack2',
        'mockLocalVideoTrack3',
        'mockLocalVideoTrack4',
      ],
    };
    expect(getAllStats(data as any)).toEqual(result);
  });
});

describe('the getRemoteAudioTrackData function', () => {
  it('should return the remoteAudioTrackStat object associated with a sid', () => {
    const result = getRemoteAudioTrackData('2', [
      {
        localAudioTrackStats: [],
        localVideoTrackStats: [],
        peerConnectionId: '',
        remoteAudioTrackStats: [{ trackSid: '1' }, { trackSid: '2' }],
        remoteVideoTrackStats: [],
      },
    ] as any);
    expect(result).toEqual({ trackSid: '2' });
  });
});
