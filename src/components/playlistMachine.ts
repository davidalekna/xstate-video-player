import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { createPlayerMachine } from "./playerMachine";

export const playlistMachine = createMachine({
  id: "Playlist",
  initial: "loading",
  states: {
    loading: {
      entry: assign<any, any>({
        player: (context: any) => spawn(createPlayerMachine(context.videos[0])),
      }),
      always: "ready",
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
      player: ActorRefFrom<ReturnType<typeof createPlayerMachine>> | null;
      loop: boolean;
      shuffle: boolean;
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
    player: null,
    loop: false,
    shuffle: false,
    next: "null",
    prev: "null",
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
});
