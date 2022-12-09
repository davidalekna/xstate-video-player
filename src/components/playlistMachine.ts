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
  states: {
    loading: {
      entry: assign<PlaylistMachineContext>({
        playerRef: (context) => {
          return spawn(createPlayerMachine(context.videos[0]), {
            name: "player",
          });
        },
      }),
      always: "ready",
    },
    ready: {
      on: {
        PLAY: {
          actions: (context) => {
            console.log("PLAY > SELECT", context.playerRef);
            context.playerRef?.send({
              type: "SELECT",
              url: context.videos[5].url,
            });
          },
        },
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
});
