import {PlaylistProvider} from '~/components/context'
import {Player} from '~/components/player'
import {Playlist} from '~/components/playlist'
import {useLoaderData} from 'react-router'
import type {LoaderArgs, SerializeFrom} from '@remix-run/node'
import {json} from '@remix-run/node'
import {fetchVideos} from '~/api'

export const loader = async (args: LoaderArgs) => {
  let videos = await fetchVideos()
  return json(videos)
}

export default function Index() {
  let videos = useLoaderData() as SerializeFrom<typeof loader>

  return (
    <main>
      <nav className="w-full h-14 px-5 flex flex-none justify-between items-center">
        toolbar
      </nav>
      <div className="flex w-full justify-center bg-gray-900">
        <div className="flex w-full max-w-[1920px] p-5">
          <PlaylistProvider videos={videos}>
            <Player />
            <Playlist />
          </PlaylistProvider>
        </div>
      </div>
    </main>
  )
}
