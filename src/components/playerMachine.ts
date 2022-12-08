import { createMachine } from "xstate";

export const createPlayerMachine = (context: any) => {
  return createMachine({
    id: "Player",
    initial: "loading",
    states: {
      loading: {
        on: {
          LOADED: {
            target: "ready",
          },
          FAIL: {
            target: "failure",
          },
        },
      },
      ready: {
        initial: "paused",
        states: {
          paused: {
            on: {
              PLAY: {
                target: "playing",
              },
            },
          },
          playing: {
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
      failure: {
        on: {
          RETRY: {
            target: "loading",
          },
        },
      },
    },
    schema: {
      context: {} as {
        url: string;
        progress: number;
        muted: boolean;
        speed: number;
        playing: boolean;
      },
      events: {} as
        | { type: "LOADED" }
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
      url: "url",
      playing: false,
      progress: 0,
      muted: false,
      speed: 0,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  });
};
