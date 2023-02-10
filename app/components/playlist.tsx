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
  let activeIndex = context.videos.findIndex(
    video => video.id === activeVideoId,
  )

  // update active video on browser history navigation
  useEffect(() => {
    let optionalVideo = context.videos.find(video => video.id === activeVideoId)
    if (!optionalVideo) return
    if (optionalVideo.id === context.playing?.id) return
    playlistService.send({type: 'SELECT', video: optionalVideo})
  }, [activeVideoId])

  return (
    <div className="hidden lg:flex flex-none basis-2/6 2xl:basis-1/4 border border-zinc-800">
      <div className="aspect-w-8 aspect-h-9 w-full bg-zinc-900">
        <div className=" flex flex-col w-full overflow-y-auto">
          <div className="flex flex-col sticky top-0 w-full p-5 bg-zinc-800 h-20 z-10">
            <p className="text-lg font-semibold text-zinc-100">
              {context.title}
            </p>
            <p className="text-sm text-zinc-200">
              Playing: {activeIndex + 1}/{context.videos.length}
            </p>
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
                    'hover:bg-zinc-700',
                    isActive ? 'bg-zinc-800' : '',
                  )}
                  to={`?list=${activeListId}&v=${item.id}`}
                >
                  <div className="flex p-3 gap-2 w-full h-18 overflow-hidden">
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
