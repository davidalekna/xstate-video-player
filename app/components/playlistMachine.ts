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
  title: string
  muted: boolean
  playing: Video | null
  shuffle: boolean
  playbackRate: number
}

export const playlistMachine = createMachine<
  PlaylistMachineContext,
  PlayerMachineEvents
>(
  {
    id: 'Playlist',
    initial: 'loading',
    context: {
      autoplay: false,
      videos: [],
      playing: null,
      muted: false,
      title: '',
      playerRef: null,
      loop: false,
      shuffle: false,
      playbackRate: 1,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    states: {
      loading: {
        entry: [
          assign(context => {
            // allow to load with a specific video or default to first
            let video = context.playing ?? context.videos[0]
            return {
              ...context,
              playing: video,
              playerRef: spawn(createPlayerMachine(video), 'player'),
            }
          }),
          'syncSearchParams',
        ],
        always: 'ready',
      },
      ready: {
        on: {
          SELECT: {
            actions: assign((context, event) => {
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
            actions: assign({
              loop: ctx => true,
            }),
          },
          SHUFFLE: {},
          NEXT: {},
          PREV: {},
        },
      },
    },
  },
  {
    actions: {
      syncSearchParams: () => {},
    },
  },
)
