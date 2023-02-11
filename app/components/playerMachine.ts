import {assign, createMachine, sendParent} from 'xstate'
import {Video} from '../api'
import {PlaylistMachineContext} from './playlistMachine'
import * as O from 'fp-ts/Option'
import * as F from 'fp-ts/function'

type PlayerMachineEvents =
  | {type: 'LOADED'; videoRef: HTMLVideoElement}
  | {type: 'CHANGE'; video: Video}
  | {type: 'PLAY'}
  | {type: 'PAUSE'}
  | {type: 'RESUME'}
  | {type: 'NEXT'}
  | {type: 'PREV'}
  | {type: 'END'}
  | {type: 'RETRY'}
  | {type: 'TIME.UPDATE'; inlineSize: number; position: number}
  | {type: 'TRACK'}
  | {type: 'BUFFERING'}
  | {type: 'FORWARD'}
  | {type: 'BACKWARD'}
  | {type: 'ERROR'}
  | {type: 'SOUND'}
  | {type: 'MUTE'}
  | {type: 'PLAYBACK_RATE'; playbackRate: number}

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
                  progress: context => {
                    return F.pipe(
                      O.fromNullable(context.videoRef),
                      O.map(x => (x.currentTime / x.duration) * 100),
                      O.fold(
                        () => 0,
                        x => x,
                      ),
                    )
                  },
                }),
              },
              BUFFERING: 'buffering',
              FORWARD: {},
              BACKWARD: {},
            },
          },
          buffering: {
            on: {
              RESUME: 'playing',
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
          'TIME.UPDATE': {
            actions: assign({
              progress: (context, event) => {
                return F.pipe(
                  O.fromNullable(context.videoRef),
                  O.map(
                    ref => (ref.duration / event.inlineSize) * event.position,
                  ),
                  O.map(time => {
                    // mutate videoRef current time
                    context.videoRef.currentTime = time
                    return time
                  }),
                  O.map(time => (time / context.videoRef.duration) * 100),
                  O.fold(
                    () => 0,
                    progress => progress,
                  ),
                )
              },
            }),
          },
          PLAYBACK_RATE: {
            actions: assign({
              playbackRate: ({videoRef}, event) => {
                videoRef.playbackRate = event.playbackRate
                return event.playbackRate
              },
            }),
          },
          PREV: {
            actions: sendParent('PREV'),
          },
          NEXT: {
            actions: sendParent('NEXT'),
          },
          ERROR: 'error',
        },
      },
      error: {},
    },
    on: {
      CHANGE: {
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
