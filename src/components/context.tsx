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
  videos: Video[]
}>
export const PlaylistProvider = ({children, videos}: PlaylistProviderProps) => {
  const playlistService = useInterpret(playlistMachine, {
    context: {videos},
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
