import { assign, createMachine } from "xstate";
import { PlaylistMachineContext } from "./playlistMachine";

type PlayerMachineEvents =
  | { type: "LOADED"; videoRef: HTMLVideoElement }
  | { type: "FAIL" }
  | { type: "RETRY" }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "END" }
  | { type: "NEXT"; url: string }
  | { type: "PREV" }
  | { type: "FORWARD" }
  | { type: "BACKWARD" }
  | { type: "SOUND" }
  | { type: "PLAYBACK_RATE" };

type PlayerMachineContext = {
  url: string;
  videoRef: HTMLVideoElement | null;
  progress: number;
  muted: boolean;
  speed: number;
};

export const createPlayerMachine = (
  video: PlaylistMachineContext["videos"][0]
) => {
  return createMachine(
    {
      id: "Player",
      initial: "loading",
      states: {
        loading: {
          on: {
            LOADED: {
              target: "ready",
              actions: assign<PlayerMachineContext, any>({
                videoRef: (_context, event) => {
                  console.log("LOADED");
                  return event.videoRef;
                },
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
                FORWARD: {},
                BACKWARD: {},
              },
            },
            ended: {},
          },
          on: {
            NEXT: {
              target: "loading",
              actions: assign<PlayerMachineContext, any>({
                url: (_context, event) => {
                  console.log("NEXT FROM PARENT");
                  return event.url;
                },
              }),
            },
            PREV: {},
            SOUND: {},
            PLAYBACK_RATE: {},
          },
        },
      },
      schema: {
        context: {} as PlayerMachineContext,
        events: {} as PlayerMachineEvents,
      },
      context: {
        url: video.url,
        videoRef: null,
        progress: 0,
        muted: false,
        speed: 0,
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
    },
    {
      actions: {
        play: (context) => context.videoRef?.play(),
        pause: (context) => context.videoRef?.pause(),
      },
    }
  );
};
