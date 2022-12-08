import * as React from "react";
import { videos } from "./api";
import { PlaylistProvider } from "./components/context";
import { Player } from "./components/player";
import { Playlist } from "./components/playlist";

function App() {
  const element = React.useRef<HTMLVideoElement>(null);

  return (
    <PlaylistProvider videos={videos}>
      <div className="flex w-full justify-center bg-gray-900">
        <div className="flex w-full max-w-[1600px] max-h-[700px] p-10 gap-5">
          <Player element={element} />
          <Playlist />
        </div>
      </div>
    </PlaylistProvider>
  );
}

export default App;
