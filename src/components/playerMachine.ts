import { assign, createMachine } from "xstate";

export const createPlayerMachine = (context: any) => {
  return createMachine(
    {
      id: "Player",
      initial: "loading",
      states: {
        loading: {
          on: {
            LOADED: {
              target: "ready",
              actions: assign<any, any>({
                videoRef: (_context: any, event: any) => event.videoRef,
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
            NEXT: {},
            PREV: {},
            SOUND: {},
            PLAYBACK_RATE: {},
          },
        },
      },
      schema: {
        context: {} as {
          url: string;
          videoRef: HTMLVideoElement | null;
          progress: number;
          muted: boolean;
          speed: number;
          playing: boolean;
        },
        events: {} as
          | { type: "LOADED"; videoRef: HTMLVideoElement }
          | { type: "FAIL" }
          | { type: "RETRY" }
          | { type: "PLAY" }
          | { type: "PAUSE" }
          | { type: "END" }
          | { type: "NEXT" }
          | { type: "PREV" }
          | { type: "FORWARD" }
          | { type: "BACKWARD" }
          | { type: "SOUND" }
          | { type: "PLAYBACK_RATE" },
      },
      context: {
        url: context.url,
        videoRef: null,
        playing: false,
        progress: 0,
        muted: false,
        speed: 0,
      },
      predictableActionArguments: true,
    },
    {
      actions: {
        play: (context) => context.videoRef?.play(),
        pause: (context) => context.videoRef?.pause(),
      },
    }
  );
};
