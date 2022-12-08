import { createMachine } from "xstate";

export const playerMachine = createMachine({
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
      video: string;
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
  context: { video: "url" },
  predictableActionArguments: true,
  preserveActionOrder: true,
});
