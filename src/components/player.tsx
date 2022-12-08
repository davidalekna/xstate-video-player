import { useActor } from "@xstate/react";
import { usePlaylistContext } from "./context";

export const Player = ({ element }: { element: any }) => {
  const [{ context }] = usePlaylistContext();
  const [state, send] = useActor(context.player!);

  return (
    <div className="relative w-full h-full">
      <div className="aspect-w-16 w-full aspect-h-9 flex bg-black overflow-hidden">
        <video
          className="w-full h-full"
          src={state.context.url}
          ref={element}
          onTimeUpdate={() => {
            // TODO: send action to child machine
          }}
        />
      </div>
      <div className="flex items-center absolute left-0 bottom-0 right-0 w-full border h-16">
        <div className="flex flex-none">
          <button
            className="text-white"
            onClick={() => {
              // toggle play
              send("PLAY");
            }}
          >
            {state.context.playing ? "pause" : "play"}
          </button>
        </div>
        <div className="flex flex-auto">
          <input
            type="range"
            min="0"
            max="100"
            className="w-full"
            value={state.context.progress}
            onChange={(e) => {
              // handleVideoProgress(e)
            }}
          />
        </div>
        <div className="">
          <select
            className="velocity"
            value={state.context.speed}
            onChange={(e) => {
              // handleVideoSpeed(e)
            }}
          >
            <option value="0.50">0.50x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="2">2x</option>
          </select>
          <button
            className="text-white"
            onClick={() => {
              // send('MUTE')
            }}
          >
            {state.context.muted ? "unmute" : "mute"}
          </button>
        </div>
      </div>
    </div>
  );
};
