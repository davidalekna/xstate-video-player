import {ActorRefFrom, assign, createMachine, spawn} from 'xstate'
import {Video} from '../api'
import {createPlayerMachine} from './playerMachine'

type PlayerMachineEvents =
  | {type: 'LOADED'}
  | {type: 'SELECT'; video: Video}
  | {type: 'AUTOPLAY'}
  | {type: 'LOOP'}
  | {type: 'SHUFFLE'}
  | {type: 'NEXT'}
  | {type: 'PREV'}

export type PlaylistMachineContext = {
  autoplay: boolean
  videos: Video[]
  playerRef: ActorRefFrom<ReturnType<typeof createPlayerMachine>> | null
  loop: boolean
  muted: boolean
  playing: Video | null
  shuffle: boolean
  playbackRate: number
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
    playing: null,
    muted: false,
    playerRef: null,
    loop: false,
    shuffle: false,
    playbackRate: 1,
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
  states: {
    loading: {
      entry: assign<PlaylistMachineContext>(context => {
        const [video] = context.videos
        return {
          ...context,
          playing: video,
          playerRef: spawn(createPlayerMachine(video), 'player'),
        }
      }),
      always: 'ready',
    },
    ready: {
      on: {
        SELECT: {
          actions: assign<PlaylistMachineContext, any>((context, event) => {
            context.playerRef?.send({
              type: 'SELECT',
              video: event.video,
            })

            return {
              ...context,
              playing: event.video,
            }
          }),
        },
        AUTOPLAY: {},
        LOOP: {
          actions: assign<PlaylistMachineContext, any>({
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
