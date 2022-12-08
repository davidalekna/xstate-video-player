import { usePlaylistContext } from "./context";

export const Playlist = () => {
  const [state] = usePlaylistContext();

  return (
    <div className="flex flex-none w-[400px]">
      <div className="flex flex-col flex-shrink-0 bg-gray-800 w-full overflow-hidden">
        <div className="flex sticky top-0 w-full p-5 bg-gray-600 h-20">
          header
        </div>
        <div className="flex flex-col gap-5 p-5 overflow-y-auto">
          {state.context.videos.map((item) => (
            <div className="flex items-center p-5 w-full h-18 bg-gray-700">
              {item.thumbnail.split("/").at(-1)?.replace(".jpg", "")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
