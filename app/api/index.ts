export type Video = {
  id: string
  url: string
  thumbnail: string
}

export type PlaylistTable = {
  id: string
  title: string
  videos: Video[]
}

const playlistsDb: PlaylistTable[] = [
  {
    id: '2b0d7b3dcb6d',
    title: 'Random short clips from google',
    videos: [
      {
        id: '5d42bf2f-63b5-443b-ac95-2450d56ae4aa',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      },
      {
        id: 'f6147965-a8bc-46ce-917d-243c804ee7ed',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      },
      {
        id: '63a24217-e54b-4388-b603-f5ba41a81498',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
      },
      {
        id: '06a5f1fe-6f9e-4a2d-a33e-665e5a58f6ab',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnail:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
      },
      {
        id: '880ddb7e-c956-4ef4-966a-1a7250932d59',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnail:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
      },
      {
        id: '57fcf5b6-aa14-483e-8e0e-4208d9d554db',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnail:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
      },
      {
        id: 'b0dca8af-7e5d-4170-b3b3-f46091e2a578',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        thumbnail:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
      },
      {
        id: 'dddaf4dc-8423-46c3-a739-537ed533eba9',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.jpg',
        thumbnail:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
      },

      {
        id: '2b4575e1-1db8-47bd-8da9-6ec18ee980a2',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnail:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
      },
      {
        id: '5a19deda-2ea3-422b-9350-5770c37947fb',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
      },
    ],
  },
]

export const fetchPlaylist = (
  listId?: string | null,
): Promise<PlaylistTable | undefined> => {
  if (!listId) return Promise.resolve(playlistsDb[0])
  let optionalPlaylist = playlistsDb.find(p => p.id === listId)
  return new Promise(res => res(optionalPlaylist))
}
