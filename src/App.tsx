import {videos} from './api'
import {PlaylistProvider} from './components/context'
import {Player} from './components/player'
import {Playlist} from './components/playlist'

function App() {
  return (
    <PlaylistProvider videos={videos}>
      <main>
        <nav className="w-full h-16 px-5 flex flex-none justify-between items-center">
          toolbar
        </nav>
        <div className="flex w-full justify-center bg-gray-900">
          <div className="flex w-full max-w-[1600px] p-10">
            <Player />
            <Playlist />
          </div>
        </div>
      </main>
    </PlaylistProvider>
  )
}

export default App
