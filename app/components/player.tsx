import React, {useEffect, useRef, useState} from 'react'
import {useActor, useSelector} from '@xstate/react'
import {usePlaylistContext} from './context'
import {createPlayerMachine} from './playerMachine'
import {ActorRefFrom} from 'xstate'
import {Icon} from './icon'
import {fromEvent, map, tap} from 'rxjs'
import {fromResizeEvent} from '../utils'

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

  if (state.matches('error')) {
    return (
      <div className="border text-white w-full h-full flex items-center justify-center">
        Broken URL!
      </div>
    )
  }

  return (
    <>
      {state.matches('buffering') && (
        <div className="absolute flex items-center justify-center top-0 right-0 bottom-0 left-0 z-10">
          Buffering
        </div>
      )}
      <video
        ref={videoEl}
        className="w-full h-full"
        src={state.context.video.url}
        muted={state.context.muted}
        poster={state.context.video.thumbnail}
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
    </>
  )
}

const ControlsProgress = ({playerRef}: VideoProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [state, send] = useActor(playerRef)
  const [position, setPosition] = useState(0)
  const [rect, setRect] = useState<ResizeObserverSize>({
    blockSize: 0,
    inlineSize: 0,
  })

  useEffect(() => {
    if (!ref.current) return
    let sub = fromResizeEvent(ref.current).subscribe(setRect)
    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    if (!ref.current) return
    let sub = fromEvent<MouseEvent>(ref.current, 'mousemove')
      .pipe(map(event => event.clientX - rect.blockSize))
      .subscribe(setPosition)
    return () => sub.unsubscribe()
  }, [rect.blockSize])

  return (
    <div
      ref={ref}
      className="flex items-center relative w-full cursor-pointer h-6"
      onMouseOut={() => setPosition(0)}
    >
      <div
        className="relative w-full h-1.5 bg-gray-400"
        onClick={() => {
          send({type: 'TIME.UPDATE', playerW: rect.inlineSize, position})
        }}
      >
        <div className="bg-gray-500 h-1.5" style={{width: `${position}px`}} />
        <div
          className="h-1.5 bg-blue-500 absolute top-0 left-0"
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
    <div className="flex flex-col items-center absolute left-0 bottom-0 right-0 w-full">
      <div className="flex flex-none w-full">
        <ControlsProgress playerRef={playerRef} />
      </div>
      <div className="flex items-center justify-between w-full py-2 px-4">
        <div className="flex items-center flex-none gap-4 ">
          <button className="text-white">
            <Icon id="skip_previous" />
          </button>
          {state.matches('ready.playing') ? (
            <button className="text-white" onClick={() => send('PAUSE')}>
              <Icon id="pause" />
            </button>
          ) : (
            <button className="text-white" onClick={() => send('PLAY')}>
              <Icon id="play_arrow" />
            </button>
          )}
          <button className="text-white">
            <Icon id="skip_next" />
          </button>
          <button className="text-white" onClick={() => send('MUTE')}>
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

  return (
    <div className="relative w-full">
      <div className="aspect-w-16 w-full aspect-h-9 flex bg-black overflow-hidden">
        <Video key={state.context.video?.url} playerRef={playerRef!} />
      </div>
      {!state.matches('error') && <Controls playerRef={playerRef!} />}
    </div>
  )
}
