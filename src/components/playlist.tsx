import {useSelector} from '@xstate/react'
import {usePlaylistContext} from './context'

export const Playlist = () => {
  const {playlistService} = usePlaylistContext()
  const videos = useSelector(playlistService, ({context}) => context.videos)

  return (
    <div className="flex flex-none basis-1/4">
      <div className="aspect-w-8 aspect-h-9 w-full bg-gray-800">
        <div className=" flex flex-col w-full overflow-y-auto">
          <div className="flex sticky top-0 w-full p-5 bg-gray-600 h-20">
            header
          </div>
          <div className="flex flex-col gap-3 p-3">
            {videos.map((item, index) => (
              <button
                key={index}
                className="flex items-center p-2 gap-2 w-full h-18 bg-gray-700"
                onClick={() =>
                  playlistService.send({type: 'SELECT', video: item})
                }
              >
                <div className="h-14">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  {item.thumbnail.split('/').at(-1)?.replace('.jpg', '')}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
