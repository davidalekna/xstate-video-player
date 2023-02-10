import {LoaderArgs, redirect} from '@remix-run/node'
import {fetchPlaylist} from '~/api'

export const loader = async (args: LoaderArgs) => {
  let defaultPlaylist = await fetchPlaylist()
  return redirect(`/watch?list=${defaultPlaylist?.id}`)
}
