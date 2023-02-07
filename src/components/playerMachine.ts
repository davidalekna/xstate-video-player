import {assign, createMachine} from 'xstate'
import {Video} from '../api'
import {PlaylistMachineContext} from './playlistMachine'

type PlayerMachineEvents =
  | {type: 'LOADED'; videoRef: HTMLVideoElement}
  | {type: 'SELECT'; video: Video}
  | {type: 'RETRY'}
  | {type: 'PLAY'}
  | {type: 'PAUSE'}
  | {type: 'END'}
  | {type: 'PROGRESS'; progress: number}
  | {type: 'TRACK'}
  | {type: 'BUFFERING'}
  | {type: 'FORWARD'}
  | {type: 'BACKWARD'}
  | {type: 'ERROR'}
  | {type: 'SOUND'}
  | {type: 'MUTE'}
  | {type: 'PLAYBACK_RATE'; playbackRate: number}
  | {type: 'RESUME'}

type PlayerMachineContext = {
  video: Video
  videoRef: HTMLVideoElement
  progress: number
  muted: boolean
  playbackRate: number
}

const initialContext: Omit<
  PlayerMachineContext,
  'muted' | 'video' | 'playbackRate'
> = {
  videoRef: {} as HTMLVideoElement,
  progress: 0,
}

export const createPlayerMachine = (
  video: PlaylistMachineContext['videos'][0],
) => {
  return createMachine<PlayerMachineContext, PlayerMachineEvents>({
    id: 'player',
    initial: 'loading',
    context: {
      ...initialContext,
      muted: false,
      playbackRate: 1,
      video,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    states: {
      loading: {
        on: {
          LOADED: {
            target: 'ready',
            actions: assign({
              videoRef: (_context, event) => event.videoRef,
            }),
          },
        },
      },
      buffering: {
        id: 'buffering',
        on: {
          RESUME: 'ready.playing',
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
                actions: assign({
                  progress: (context, event) => {
                    const progress =
                      (context.videoRef.currentTime /
                        context.videoRef.duration) *
                      100
                    return progress
                  },
                }),
              },
              PROGRESS: {
                actions: assign({
                  progress: ({videoRef}, event) => {
                    let manualChange = event.progress
                    let update = (videoRef.duration / 100) * manualChange
                    videoRef.currentTime = update
                    return manualChange
                  },
                }),
              },
              BUFFERING: '#buffering',
              FORWARD: {},
              BACKWARD: {},
            },
          },
          ended: {},
        },
        on: {
          MUTE: {
            actions: assign({
              muted: context => !context.muted,
            }),
          },
          SOUND: {},
          ERROR: 'error',
          PLAYBACK_RATE: {
            actions: assign({
              playbackRate: ({videoRef}, event) => {
                videoRef.playbackRate = event.playbackRate
                return event.playbackRate
              },
            }),
          },
        },
      },
      error: {},
    },
    on: {
      SELECT: {
        target: 'loading',
        actions: assign((context, event) => {
          return {
            ...initialContext,
            video: event.video,
          }
        }),
      },
    },
  })
}
