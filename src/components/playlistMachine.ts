import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { createPlayerMachine } from "./playerMachine";

type PlayerMachineEvents =
  | { type: "LOADED" }
  | { type: "PLAY" }
  | { type: "AUTOPLAY" }
  | { type: "LOOP" }
  | { type: "SHUFFLE" }
  | { type: "NEXT" }
  | { type: "PREV" };

export type PlaylistMachineContext = {
  autoplay: boolean;
  videos: any[];
  playerRef: ActorRefFrom<ReturnType<typeof createPlayerMachine>> | null;
  loop: boolean;
  shuffle: boolean;
  next: string;
  prev: string;
};

export const playlistMachine = createMachine({
  id: "Playlist",
  initial: "loading",
  states: {
    loading: {
      entry: assign<PlaylistMachineContext>({
        playerRef: (context) =>
          spawn(createPlayerMachine(context.videos[0]), "player"),
      }),
      always: "ready",
    },
    ready: {
      on: {
        PLAY: {},
        AUTOPLAY: {},
        LOOP: {
          actions: assign<any, any>({
            loop: true,
          }),
        },
        SHUFFLE: {},
        NEXT: {},
        PREV: {},
      },
    },
  },
  schema: {
    context: {} as PlaylistMachineContext,
    events: {} as PlayerMachineEvents,
  },
  context: {
    autoplay: false,
    videos: [],
    playerRef: null,
    loop: false,
    shuffle: false,
    next: "null",
    prev: "null",
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
});
