import {PlaylistProvider} from '~/components/context'
import {Player} from '~/components/player'
import {Playlist} from '~/components/playlist'
import {useLoaderData} from 'react-router'
import type {LoaderArgs, SerializeFrom} from '@remix-run/node'
import {json} from '@remix-run/node'
import {fetchPlaylist} from '~/api'

export const loader = async (args: LoaderArgs) => {
  let url = new URL(args.request.url)
  let listId = url.searchParams.get('list')
  let videoId = url.searchParams.get('v')
  let playlist = await fetchPlaylist(listId)
  let playing = playlist?.videos.find(video => video.id === videoId)
  return json({...playlist, playing})
}

export default function Index() {
  let playlist = useLoaderData() as SerializeFrom<typeof loader>

  if (!playlist) return <div>Oops! No playlist with this id!</div>

  return (
    <main>
      <nav className="w-full h-14 px-5 flex flex-none justify-between items-center bg-zinc-800">
        <p className="text-zinc-100 font-semibold text-lg">Brand</p>
      </nav>
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-[1920px] p-5">
          <PlaylistProvider
            title={playlist.title}
            videos={playlist?.videos ?? []}
            playing={playlist.playing}
          >
            <Player />
            <Playlist />
          </PlaylistProvider>
        </div>
      </div>
    </main>
  )
}
