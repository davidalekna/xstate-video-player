import * as React from 'react'
import {fetchVideos, Video} from './api'
import {PlaylistProvider} from './components/context'
import {Player} from './components/player'
import {Playlist} from './components/playlist'

function App() {
  const [loading, setLoading] = React.useState(true)
  const [videos, setVideos] = React.useState<Video[]>([])

  React.useEffect(() => {
    fetchVideos().then(videos => {
      setVideos(videos)
      setLoading(false)
    })
  }, [])

  return (
    <main>
      <nav className="w-full h-16 px-5 flex flex-none justify-between items-center">
        toolbar
      </nav>
      <div className="flex w-full justify-center bg-gray-900">
        <div className="flex w-full max-w-[1600px] p-10">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <PlaylistProvider videos={videos}>
              <Player />
              <Playlist />
            </PlaylistProvider>
          )}
        </div>
      </div>
    </main>
  )
}

export default App
