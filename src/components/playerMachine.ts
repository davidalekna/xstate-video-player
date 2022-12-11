import {assign, createMachine} from 'xstate'
import {PlaylistMachineContext} from './playlistMachine'

type PlayerMachineEvents =
  | {type: 'LOADED'; videoRef: HTMLVideoElement}
  | {type: 'SELECT'; url: string}
  | {type: 'RETRY'}
  | {type: 'PLAY'}
  | {type: 'PAUSE'}
  | {type: 'END'}
  | {type: 'PROGRESS'; progress: number}
  | {type: 'TRACK'}
  | {type: 'NEXT'}
  | {type: 'PREV'}
  | {type: 'BUFFERING'; state: boolean}
  | {type: 'FORWARD'}
  | {type: 'BACKWARD'}
  | {type: 'SOUND'}
  | {type: 'MUTE'}
  | {type: 'PLAYBACK_RATE'; playbackRate: number}

type PlayerMachineContext = {
  url: string
  videoRef: HTMLVideoElement | null
  progress: number
  buffering: boolean
  muted: boolean
  playbackRate: number
}

const initialContext: Omit<
  PlayerMachineContext,
  'muted' | 'url' | 'playbackRate'
> = {
  videoRef: null,
  buffering: false,
  progress: 0,
}

export const createPlayerMachine = (
  video: PlaylistMachineContext['videos'][0],
) => {
  return createMachine({
    id: 'player',
    initial: 'loading',
    schema: {
      context: {} as PlayerMachineContext,
      events: {} as PlayerMachineEvents,
    },
    context: {
      ...initialContext,
      muted: false,
      playbackRate: 1,
      url: video.url,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    states: {
      loading: {
        on: {
          LOADED: {
            target: 'ready',
            actions: assign<PlayerMachineContext, any>({
              videoRef: (_context, event) => event.videoRef,
            }),
          },
        },
      },
      ready: {
        initial: 'paused',
        states: {
          paused: {
            entry: [context => context.videoRef?.pause()],
            on: {
              PLAY: {
                target: 'playing',
              },
            },
          },
          playing: {
            entry: [context => context.videoRef?.play()],
            on: {
              PAUSE: {
                target: 'paused',
              },
              END: {
                target: 'ended',
              },
              TRACK: {
                actions: assign<PlayerMachineContext, any>({
                  progress: (context, event) => {
                    if (!context.videoRef) return 0
                    const progress =
                      (context.videoRef.currentTime /
                        context.videoRef.duration) *
                      100
                    return progress
                  },
                }),
              },
              PROGRESS: {
                actions: assign<PlayerMachineContext, any>({
                  progress: (context, event) => {
                    const manualChange = event.progress
                    if (context.videoRef) {
                      context.videoRef.currentTime =
                        (context.videoRef.duration / 100) * manualChange
                    }
                    return manualChange
                  },
                }),
              },
              BUFFERING: {
                actions: assign<PlayerMachineContext, any>({
                  buffering: (context, event) => event.state,
                }),
              },
              FORWARD: {},
              BACKWARD: {},
            },
          },
          ended: {},
        },
        on: {
          SELECT: {
            target: 'loading',
            actions: assign<PlayerMachineContext, any>((context, event) => {
              return {
                ...initialContext,
                url: event.url,
              }
            }),
          },
          MUTE: {
            actions: assign<PlayerMachineContext, any>({
              muted: context => !context.muted,
            }),
          },
          SOUND: {},
          PLAYBACK_RATE: {
            actions: assign<PlayerMachineContext, any>({
              playbackRate: (context, event) => {
                if (context.videoRef) {
                  context.videoRef.playbackRate = event.playbackRate
                }
                return event.playbackRate
              },
            }),
          },
        },
      },
    },
    on: {
      PREV: {},
      NEXT: {},
    },
  })
}
