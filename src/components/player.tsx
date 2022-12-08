import React, { useEffect } from "react";
import { useActor } from "@xstate/react";
import { usePlaylistContext } from "./context";
import { createPlayerMachine } from "./playerMachine";
import { ActorRefFrom } from "xstate";

type VideoProps = {
  playerRef: ActorRefFrom<ReturnType<typeof createPlayerMachine>>;
};
export const Video = ({ playerRef }: VideoProps) => {
  const videoEl = React.useRef<HTMLVideoElement>(null);
  const [state, send] = useActor(playerRef);

  useEffect(() => {
    if (videoEl.current) {
      send({ type: "LOADED", videoRef: videoEl.current });
    }
  }, [videoEl, send]);

  console.log(state.value);

  return (
    <div className="relative w-full h-full">
      <div className="aspect-w-16 w-full aspect-h-9 flex bg-black overflow-hidden">
        <video
          className="w-full h-full"
          src={state.context.url}
          ref={videoEl}
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

export const Player = () => {
  const { playlistService } = usePlaylistContext();
  const [state] = useActor(playlistService);

  if (state.matches("loading")) return <div>Loading...</div>;

  return <Video playerRef={state.context.player!} />;
};
