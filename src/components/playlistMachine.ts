import {ActorRefFrom, assign, createMachine, spawn} from 'xstate'
import {createPlayerMachine} from './playerMachine'

type PlayerMachineEvents =
  | {type: 'LOADED'}
  | {type: 'PLAY'; video: any}
  | {type: 'AUTOPLAY'}
  | {type: 'LOOP'}
  | {type: 'SHUFFLE'}
  | {type: 'NEXT'}
  | {type: 'PREV'}

export type PlaylistMachineContext = {
  autoplay: boolean
  videos: any[]
  playerRef: ActorRefFrom<ReturnType<typeof createPlayerMachine>> | null
  loop: boolean
  playing: string
  shuffle: boolean
  next: string
  prev: string
}

export const playlistMachine = createMachine({
  id: 'Playlist',
  initial: 'loading',
  schema: {
    context: {} as PlaylistMachineContext,
    events: {} as PlayerMachineEvents,
  },
  context: {
    autoplay: false,
    videos: [],
    playing: 'id-1',
    playerRef: null,
    loop: false,
    shuffle: false,
    next: 'null',
    prev: 'null',
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
  states: {
    loading: {
      entry: assign<PlaylistMachineContext>(context => {
        const [video] = context.videos
        return {
          ...context,
          playerRef: spawn(createPlayerMachine(video), 'player'),
        }
      }),
      always: 'ready',
    },
    ready: {
      on: {
        PLAY: {
          actions: assign<PlaylistMachineContext, any>((context, event) => {
            context.playerRef?.send({
              type: 'SELECT',
              url: event.video.url,
            })

            return {
              ...context,
              playing: 'id-2',
            }
          }),
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
})
