import {useSearchParams} from '@remix-run/react'
import {useInterpret} from '@xstate/react'
import {createContext, PropsWithChildren, useContext} from 'react'
import {InterpreterFrom} from 'xstate'
import type {Video} from '../api'
import {playlistMachine} from './playlistMachine'

type PlaylistProviderState = {
  playlistService: InterpreterFrom<typeof playlistMachine>
}
const PlaylistContext = createContext<PlaylistProviderState>({
  playlistService: {} as InterpreterFrom<typeof playlistMachine>,
})

type PlaylistProviderProps = PropsWithChildren<{
  title?: string
  videos: Video[]
  playing?: Video
}>
export const PlaylistProvider = ({
  children,
  title,
  videos,
  playing,
}: PlaylistProviderProps) => {
  let [searchParams, setSearchParams] = useSearchParams()
  let playlistService = useInterpret(playlistMachine, {
    context: {videos, playing, title},
    actions: {
      syncSearchParams: context => {
        let prev = Object.fromEntries(searchParams.entries())
        setSearchParams({...prev, v: context.playing?.id!})
      },
    },
  })

  return (
    <PlaylistContext.Provider value={{playlistService}}>
      {children}
    </PlaylistContext.Provider>
  )
}

export const usePlaylistContext = () => {
  return useContext(PlaylistContext)
}
