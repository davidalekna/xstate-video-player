import React, {useEffect, useRef, useState} from 'react'
import {useActor, useSelector} from '@xstate/react'
import {usePlaylistContext} from './context'
import {createPlayerMachine} from './playerMachine'
import {ActorRefFrom} from 'xstate'
import {Icon} from './icon'
import {fromEvent, map} from 'rxjs'
import {fromResizeEvent} from '../utils'
import {useSearchParams} from '@remix-run/react'

type VideoProps = {
  playerRef: ActorRefFrom<ReturnType<typeof createPlayerMachine>>
}
export const Video = ({playerRef}: VideoProps) => {
  const videoEl = React.useRef<HTMLVideoElement>(null)
  const [state, send] = useActor(playerRef)

  useEffect(() => {
    if (!videoEl.current) return
    send({type: 'LOADED', videoRef: videoEl.current})
  }, [videoEl, send])

  return (
    <div className="aspect-w-16 w-full aspect-h-9 flex bg-black overflow-hidden">
      {state.matches('ready.buffering') && (
        <div className="absolute flex items-center justify-center top-0 right-0 bottom-0 left-0 z-10">
          Buffering
        </div>
      )}
      <video
        ref={videoEl}
        className="w-full h-full"
        src={state.context.video?.url}
        muted={state.context.muted}
        poster={state.context.video?.thumbnail}
        onWaiting={() => {
          send({type: 'BUFFERING'})
        }}
        onError={() => send('ERROR')}
        onLoadStart={() => console.log('onLoadStart')}
        onCanPlay={() => {
          console.log('onCanPlay')
          send('RESUME')
        }}
        onTimeUpdate={() => send('TRACK')}
      />
    </div>
  )
}

const ControlsProgress = ({playerRef}: VideoProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [state, send] = useActor(playerRef)
  const [position, setPosition] = useState(0)
  const [size, setSize] = useState<ResizeObserverSize>({
    blockSize: 0,
    inlineSize: 0,
  })

  useEffect(() => {
    if (!ref.current) return
    let sub = fromResizeEvent(ref.current).subscribe(setSize)
    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    if (!ref.current) return
    let sub = fromEvent<MouseEvent>(ref.current, 'mousemove')
      .pipe(map(event => event.clientX - size.blockSize))
      .subscribe(setPosition)
    return () => sub.unsubscribe()
  }, [size.blockSize])

  return (
    <div
      ref={ref}
      className="flex items-center relative w-full cursor-pointer h-6"
      onMouseOut={() => setPosition(0)}
      onClick={() => {
        send({type: 'TIME.UPDATE', inlineSize: size.inlineSize, position})
      }}
    >
      <div className="relative w-full h-1 bg-gray-400">
        <div className="bg-gray-500 h-1" style={{width: `${position}px`}} />
        <div
          className="h-1 bg-blue-500 absolute top-0 left-0"
          style={{width: `${state.context.progress ?? 0}%`}}
        />
      </div>
      <div
        style={{left: `${state.context.progress ?? 0}%`}}
        className="absolute w-[16px] h-[16px]"
      >
        <div className="absolute w-full h-full -left-[8px] rounded-full bg-blue-700" />
      </div>
    </div>
  )
}

const Controls = ({playerRef}: VideoProps) => {
  const [state, send] = useActor(playerRef)

  return (
    <div className="flex flex-col items-center absolute left-0 bottom-0 right-0 w-full z-20">
      <ControlsProgress playerRef={playerRef} />
      <div className="flex items-center justify-between w-full pb-3 px-4">
        <div className="flex items-center flex-none gap-4 text-white">
          <button type="button" onClick={() => send('PREV')}>
            <Icon id="skip_previous" />
          </button>
          {['ready.playing', 'ready.buffering'].some(state.matches) ? (
            <button type="button" onClick={() => send('PAUSE')}>
              <Icon id="pause" />
            </button>
          ) : (
            <button type="button" onClick={() => send('PLAY')}>
              <Icon id="play_arrow" />
            </button>
          )}
          <button type="button" onClick={() => send('NEXT')}>
            <Icon id="skip_next" />
          </button>
          <button type="button" onClick={() => send('MUTE')}>
            <Icon id={state.context.muted ? 'volume_off' : 'volume_up'} />
          </button>
        </div>
        <div className="flex">
          <select
            value={state.context.playbackRate}
            onChange={evt => {
              send({
                type: 'PLAYBACK_RATE',
                playbackRate: Number(evt.target.value),
              })
            }}
          >
            <option value="0.50">0.50x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export const Player = () => {
  const {playlistService} = usePlaylistContext()
  const playerRef = useSelector(
    playlistService,
    state => state.context.playerRef,
  )
  const [state] = useActor(playerRef!)

  if (state.matches('error')) {
    return (
      <div className="border bg-black text-white w-full h-full flex items-center justify-center">
        Broken URL!
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <Video key={state.context.video?.url} playerRef={playerRef!} />
      <Controls playerRef={playerRef!} />
    </div>
  )
}
