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
      console.log("LOADED");
      send({ type: "LOADED", videoRef: videoEl.current });
    }
  }, [videoEl, send]);

  console.log(state.value);

  return (
    <div className="aspect-w-16 w-full aspect-h-9 flex bg-black overflow-hidden">
      {state.context.buffering && (
        <div className="absolute flex items-center justify-center top-0 right-0 bottom-0 left-0 z-10">
          Buffering
        </div>
      )}
      <video
        ref={videoEl}
        className="w-full h-full"
        src={state.context.url}
        muted={state.context.muted}
        onWaiting={() => send({ type: "BUFFERING", state: true })}
        onPlaying={() => send({ type: "BUFFERING", state: false })}
        onTimeUpdate={() => send("TRACK")}
      />
    </div>
  );
};

const Controls = ({ playerRef }: VideoProps) => {
  const [state, send] = useActor(playerRef);

  return (
    <div className="flex items-center absolute left-0 bottom-0 right-0 w-full border h-16 px-6 gap-5">
      <div className="flex flex-none">
        {state.matches("ready.playing") && (
          <button className="text-white" onClick={() => send("PAUSE")}>
            pause
          </button>
        )}
        {state.matches("ready.paused") && (
          <button className="text-white" onClick={() => send("PLAY")}>
            play
          </button>
        )}
      </div>
      <div className="flex flex-auto">
        <input
          type="range"
          min="0"
          max="100"
          className="w-full"
          value={state.context.progress}
          onChange={(evt) =>
            send({ type: "PROGRESS", progress: Number(evt.target.value) })
          }
        />
      </div>
      <div>
        <select
          className="velocity"
          value={state.context.playbackRate}
          onChange={(evt) => {
            send({
              type: "PLAYBACK_RATE",
              playbackRate: Number(evt.target.value),
            });
          }}
        >
          <option value="0.50">0.50x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="2">2x</option>
        </select>
        <button className="text-white" onClick={() => send("MUTE")}>
          {state.context.muted ? "unmute" : "mute"}
        </button>
      </div>
    </div>
  );
};

export const Player = () => {
  const { playlistService } = usePlaylistContext();
  const [state] = useActor(playlistService);

  return (
    <div className="relative w-full h-full">
      <Video playerRef={state.context.playerRef!} />
      <Controls playerRef={state.context.playerRef!} />
    </div>
  );
};
