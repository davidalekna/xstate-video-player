import { usePlaylistContext } from "./context";

export const Player = ({ element }: { element: any }) => {
  const [state] = usePlaylistContext();

  const handleOnTimeUpdate = () => {};
  const togglePlay = () => {};
  const handleVideoProgress = (e: any) => {};
  const handleVideoSpeed = (e: any) => {};
  const toggleMute = () => {};

  const playerState = {
    isPlaying: false,
    isMuted: false,
    progress: 0,
    speed: 1,
  };

  return (
    <div className="relative w-full h-full">
      <div className="aspect-w-16 w-full aspect-h-9 flex bg-black overflow-hidden">
        <video
          className="w-full h-full"
          src={state.context.videos[0].url}
          ref={element}
          onTimeUpdate={handleOnTimeUpdate}
        />
      </div>
      <div className="flex items-center absolute left-0 bottom-0 right-0 w-full border h-16">
        <div className="actions">
          <button onClick={togglePlay}>
            {!playerState.isPlaying ? (
              <i className="bx bx-play">play</i>
            ) : (
              <i className="bx bx-pause">pause</i>
            )}
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={playerState.progress}
          onChange={(e) => handleVideoProgress(e)}
        />
        <select
          className="velocity"
          value={playerState.speed}
          onChange={(e) => handleVideoSpeed(e)}
        >
          <option value="0.50">0.50x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="2">2x</option>
        </select>
        <button className="mute-btn" onClick={toggleMute}>
          {!playerState.isMuted ? (
            <i className="bx bxs-volume-full"></i>
          ) : (
            <i className="bx bxs-volume-mute"></i>
          )}
        </button>
      </div>
    </div>
  );
};
