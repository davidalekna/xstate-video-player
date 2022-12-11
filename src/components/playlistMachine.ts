import {ActorRefFrom, assign, createMachine, spawn} from 'xstate'
import {Video} from '../api'
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
  muted: boolean
  playing: Video | null
  shuffle: boolean
  playbackRate: number
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
    playing: null,
    muted: false,
    playerRef: null,
    loop: false,
    shuffle: false,
    playbackRate: 1,
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
          playing: video,
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
