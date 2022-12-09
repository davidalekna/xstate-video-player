import { videos } from "./api";
import { PlaylistProvider } from "./components/context";
import { Player } from "./components/player";
import { Playlist } from "./components/playlist";

function App() {
  return (
    <PlaylistProvider videos={videos}>
      <div className="flex w-full justify-center bg-gray-900">
        <div className="flex w-full max-w-[1600px] max-h-[630px] p-10 gap-5">
          <Player />
          <Playlist />
        </div>
      </div>
    </PlaylistProvider>
  );
}

export default App;
