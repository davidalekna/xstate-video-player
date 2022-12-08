import { createMachine } from "xstate";

export const playlistMachine = createMachine({
  id: "Playlist",
  initial: "loading",
  states: {
    loading: {
      on: {
        LOADED: {
          target: "ready",
        },
      },
    },
    ready: {
      on: {
        PLAY: {},
        AUTOPLAY: {},
        LOOP: {},
        SHUFFLE: {},
        NEXT: {},
        PREV: {},
      },
    },
  },
  schema: {
    context: {} as {
      autoplay: boolean;
      videos: any[];
      loop: boolean;
      shuffle: boolean;
      playing: string;
      next: string;
      prev: string;
    },
    events: {} as
      | { type: "LOADED" }
      | { type: "PLAY" }
      | { type: "AUTOPLAY" }
      | { type: "LOOP" }
      | { type: "SHUFFLE" }
      | { type: "NEXT" }
      | { type: "PREV" },
  },
  context: {
    autoplay: false,
    videos: [],
    loop: false,
    shuffle: false,
    playing: "null",
    next: "null",
    prev: "null",
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
});
