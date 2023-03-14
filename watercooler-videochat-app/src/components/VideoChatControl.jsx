import { useContext, useState } from 'react';
import { ReactSVG } from 'react-svg';
import UserContext from '../UserContext';

export default function VideoChatControl({
  initiateCall,
  declineCallHandler: declineCall,
  dropCallHandler,
}) {
  const [offVideo, setOffVideo] = useState(false);
  const { callOngoing, setMuted, muted } = useContext(UserContext);

  function handleMuteClick() {
    setMuted((state) => !state);
  }

  function handleCallClick() {
    initiateCall();
  }

  function handleCallEnd() {
    // declineCall();
    dropCallHandler();
  }

  function handleVideoClick() {
    setOffVideo((state) => !state);
  }

  return (
    <div className="video-chat-control-container">
      <div className="hstack gap-2 call-buttons-container">
        {muted ? (
          <button
            className="call-control small-button"
            onClick={(e) => handleMuteClick()}
          >
            <ReactSVG
              className="call-control-svg"
              src="/icons/unmuted-button.svg"
            />
          </button>
        ) : (
          <button
            className="call-control small-button"
            onClick={(e) => handleMuteClick()}
          >
            <ReactSVG
              className="call-control-svg"
              src="/icons/muted-button.svg"
            />
          </button>
        )}

        {callOngoing ? (
          <button
            className="call-control large-end-button"
            onClick={(e) => handleCallEnd()}
          >
            <ReactSVG
              className="call-control-large-svg"
              src="/icons/end-call-button.svg"
            />
          </button>
        ) : (
          <button
            className="call-control large-calling-button"
            onClick={(e) => handleCallClick()}
          >
            <ReactSVG
              className="call-control-large-svg"
              src="/icons/calling-button.svg"
            />
          </button>
        )}

        {offVideo ? (
          <button
            className="call-control small-button"
            onClick={(e) => handleVideoClick()}
          >
            <ReactSVG
              className="call-control-svg"
              src="/icons/camera-off-button.svg"
            />
          </button>
        ) : (
          <button
            className="call-control small-button"
            onClick={(e) => handleVideoClick()}
          >
            <ReactSVG
              className="call-control-svg"
              src="/icons/camera-on-button.svg"
            />
          </button>
        )}
      </div>
    </div>
  );
}
