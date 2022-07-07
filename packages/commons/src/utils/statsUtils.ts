import { StatsReport } from 'twilio-video';

export const getAllStats = (statsReports: StatsReport[]) => {
  const initialValue = {
    localAudioTrackStats: [],
    localVideoTrackStats: [],
    remoteAudioTrackStats: [],
    remoteVideoTrackStats: [],
    peerConnectionId: '',
  };

  return statsReports.reduce((p, c) => {
    return {
      localAudioTrackStats: [...p.localAudioTrackStats, ...c.localAudioTrackStats],
      localVideoTrackStats: [...p.localVideoTrackStats, ...c.localVideoTrackStats],
      remoteAudioTrackStats: [...p.remoteAudioTrackStats, ...c.remoteAudioTrackStats],
      remoteVideoTrackStats: [...p.remoteVideoTrackStats, ...c.remoteVideoTrackStats],
      peerConnectionId: '',
    };
  }, initialValue);
}

export const getRemoteAudioTrackData = (trackSid: string, statsReports: StatsReport[]) => {
  const statsReport = getAllStats(statsReports);
  return statsReport.remoteAudioTrackStats.find((t) => t.trackSid === trackSid);
}
