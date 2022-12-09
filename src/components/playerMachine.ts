import { assign, createMachine } from "xstate";
import { PlaylistMachineContext } from "./playlistMachine";

type PlayerMachineEvents =
  | { type: "LOADED"; videoRef: HTMLVideoElement }
  | { type: "SELECT"; url: string }
  | { type: "RETRY" }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "END" }
  | { type: "PROGRESS"; progress: number }
  | { type: "TRACK" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "BUFFERING"; state: boolean }
  | { type: "FORWARD" }
  | { type: "BACKWARD" }
  | { type: "SOUND" }
  | { type: "MUTE" }
  | { type: "PLAYBACK_RATE"; playbackRate: number };

type PlayerMachineContext = {
  url: string;
  videoRef: HTMLVideoElement | null;
  progress: number;
  buffering: boolean;
  muted: boolean;
  playbackRate: number;
};

export const createPlayerMachine = (
  video: PlaylistMachineContext["videos"][0]
) => {
  return createMachine(
    {
      id: "player",
      initial: "loading",
      schema: {
        context: {} as PlayerMachineContext,
        events: {} as PlayerMachineEvents,
      },
      context: {
        url: video.url,
        videoRef: null,
        buffering: false,
        progress: 0,
        muted: false,
        playbackRate: 0,
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
      states: {
        loading: {
          entry: [() => console.log("HELLO WORLD")],
          on: {
            LOADED: {
              target: "ready",
              actions: assign<PlayerMachineContext, any>({
                videoRef: (_context, event) => event.videoRef,
              }),
            },
          },
        },
        ready: {
          initial: "paused",
          states: {
            paused: {
              entry: ["pause"],
              on: {
                PLAY: {
                  target: "playing",
                },
              },
            },
            playing: {
              entry: ["play"],
              on: {
                PAUSE: {
                  target: "paused",
                },
                END: {
                  target: "ended",
                },
                TRACK: {
                  actions: assign<PlayerMachineContext, any>({
                    progress: (context, event) => {
                      if (!context.videoRef) return 0;
                      const progress =
                        (context.videoRef.currentTime /
                          context.videoRef.duration) *
                        100;
                      return progress;
                    },
                  }),
                },
                PROGRESS: {
                  actions: assign<PlayerMachineContext, any>({
                    progress: (context, event) => {
                      const manualChange = event.progress;
                      if (context.videoRef) {
                        context.videoRef.currentTime =
                          (context.videoRef.duration / 100) * manualChange;
                      }
                      return manualChange;
                    },
                  }),
                },
                BUFFERING: {
                  actions: assign<PlayerMachineContext, any>({
                    buffering: (context, event) => event.state,
                  }),
                },
                FORWARD: {},
                BACKWARD: {},
              },
            },
            ended: {},
          },
          on: {
            SELECT: {
              target: "loading",
              actions: assign<PlayerMachineContext, any>({
                url: (context, event) => {
                  console.log("CALLED");
                  return event.url;
                },
              }),
            },
            MUTE: {
              actions: assign<PlayerMachineContext, any>({
                muted: (context) => !context.muted,
              }),
            },
            SOUND: {},
            PLAYBACK_RATE: {
              actions: assign<PlayerMachineContext, any>({
                playbackRate: (context, event) => {
                  if (context.videoRef) {
                    context.videoRef.playbackRate = event.playbackRate;
                  }
                  return event.playbackRate;
                },
              }),
            },
          },
        },
      },
      on: {
        PREV: {},
        NEXT: {},
      },
    },
    {
      actions: {
        play: (context) => context.videoRef?.play(),
        pause: (context) => context.videoRef?.pause(),
      },
    }
  );
};
