import './App.scss';
import 'normalize.css';

import { ASPECT_RATIO, SIDEBAR_PARTICIPANTS } from './constants';
import clsx from 'clsx';
import { useAutoDisconnect, useRoom } from '@media-extensions/commons';
import Participant from './components/Participant/Participant';
import usePresentationParticipant from './hooks/usePresentationParticipant/usePresentationParticipant';
import PresentationParticipant from './components/PresentationParticipant/PresentationParticipant';
import useParticipants from './hooks/useRemoteParticipants/useRemoteParticipants';
import useDominantSpeaker from './hooks/useDominantSpeaker/useDominantSpeaker';
import useTimedMetadata from './hooks/useTimedMetadata/useTimedMetadata';
import useGridLayout from './hooks/useGridLayout/useGridLayout';

export default function App() {
  const room = useRoom({ isVideo: true });
  const participants = useParticipants(room);
  useAutoDisconnect(room, participants);
  useTimedMetadata(room, participants);
  const dominantSpeaker = useDominantSpeaker(room);
  const presentationParticipant = usePresentationParticipant(room);
  const isPresentationModeActive = Boolean(presentationParticipant);

  const MAX_PARTICIPANTS = isPresentationModeActive ? SIDEBAR_PARTICIPANTS : 9;

  const { participantVideoWidth, containerRef } = useGridLayout(
    Math.min(participants.length, MAX_PARTICIPANTS),
    isPresentationModeActive
  );

  const participantsArray = isPresentationModeActive
    ? [presentationParticipant, ...participants.filter((p) => p !== presentationParticipant)] // Put presentation participant at the front of the list
    : participants;

  const participantWidth = `${participantVideoWidth}px`;
  const participantHeight = `${Math.floor(participantVideoWidth * ASPECT_RATIO)}px`;

  return (
    <div
      className={clsx('app', {
        isPresentationModeActive,
      })}
    >
      <div className="mainContainer">
        {isPresentationModeActive && (
          <div className="presentationContainer">
            <div className="presentationBanner">
              <p data-cy-presentation-banner>{presentationParticipant!.identity} is presenting.</p>
            </div>
            <div className="presentationVideoContainer" data-cy-presentation-container>
              <PresentationParticipant participant={presentationParticipant!} />
            </div>
          </div>
        )}
        <div ref={containerRef} className="participantContainer">
          {participantsArray.map((participant) => (
            <Participant
              key={participant!.identity}
              participant={participant!}
              width={participantWidth}
              height={participantHeight}
              isDominantSpeaker={dominantSpeaker === participant}
              fontSize={participantVideoWidth / 18 + 'px'}
            />
          ))}
          {participants.length > SIDEBAR_PARTICIPANTS && isPresentationModeActive && (
            <div className="participantCountContainer">
              <p>+ {participants.length - SIDEBAR_PARTICIPANTS} more</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
