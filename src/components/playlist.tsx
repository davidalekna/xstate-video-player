import { useSelector } from "@xstate/react";
import { usePlaylistContext } from "./context";

export const Playlist = () => {
  const { playlistService } = usePlaylistContext();
  const videos = useSelector(playlistService, ({ context }) => context.videos);

  return (
    <div className="flex flex-none w-[400px]">
      <div className="flex flex-col flex-shrink-0 bg-gray-800 w-full overflow-hidden">
        <div className="flex sticky top-0 w-full p-5 bg-gray-600 h-20">
          header
        </div>
        <div className="flex flex-col gap-5 p-5 overflow-y-auto">
          {videos.map((item, index) => (
            <button
              key={index}
              className="flex items-center p-3 gap-3 w-full h-18 bg-gray-700"
              onClick={() => playlistService.send("PLAY")}
            >
              <div className="h-14">
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div>{item.thumbnail.split("/").at(-1)?.replace(".jpg", "")}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
