import clsx from 'clsx'
import {useSelector} from '@xstate/react'
import {usePlaylistContext} from './context'
import {Link, useSearchParams} from '@remix-run/react'
import {useEffect} from 'react'

export const Playlist = () => {
  let [searchParams] = useSearchParams()
  let {playlistService} = usePlaylistContext()
  let context = useSelector(playlistService, ({context}) => context)
  let activeListId = searchParams.get('list')
  let activeVideoId = searchParams.get('v')

  // update active video on browser history navigation
  useEffect(() => {
    let optionalVideo = context.videos.find(video => video.id === activeVideoId)
    if (!optionalVideo) return
    if (optionalVideo.id === context.playing?.id) return
    playlistService.send({type: 'SELECT', video: optionalVideo})
  }, [activeVideoId])

  return (
    <div className="hidden lg:flex flex-none basis-2/6 xl:basis-1/4">
      <div className="aspect-w-8 aspect-h-9 w-full bg-gray-800">
        <div className=" flex flex-col w-full overflow-y-auto">
          <div className="flex sticky top-0 w-full p-5 bg-gray-600 h-20 z-10">
            header
          </div>
          <div className="flex flex-col">
            {context.videos.map((item, index) => {
              let isActive = item.id === context.playing?.id
              let title = item.thumbnail
                .split('/')
                .at(-1)
                ?.replace('.jpg', '')
                .split(/(?=[A-Z])/)
                .join(' ')

              return (
                <Link
                  key={index}
                  className={clsx(
                    'hover:bg-gray-700',
                    isActive ? 'bg-gray-900' : '',
                  )}
                  to={`?list=${activeListId}&v=${item.id}`}
                >
                  <div className="flex p-2 gap-2 w-full h-18 overflow-hidden">
                    <div className="flex flex-none basis-1/3">
                      <div className="aspect-w-16 aspect-h-9 w-full">
                        <img
                          src={item.thumbnail}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col basis-2/3 text-white">
                      <p className="text-left">{title}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
