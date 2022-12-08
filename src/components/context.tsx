import { useActor, useMachine } from "@xstate/react";
import { createContext, PropsWithChildren, useContext } from "react";
import { ActorRefFrom } from "xstate";
import { playlistMachine } from "./playlistMachine";

type PlaylistProviderState = {
  service: ActorRefFrom<typeof playlistMachine>;
};
const PlaylistContext = createContext<PlaylistProviderState>({
  service: {} as any,
});

type PlaylistProviderProps = PropsWithChildren<{
  videos: any;
}>;
export const PlaylistProvider = ({
  children,
  videos,
}: PlaylistProviderProps) => {
  const [, , service] = useMachine(playlistMachine, { context: { videos } });

  return (
    <PlaylistContext.Provider value={{ service }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = () => {
  const { service } = useContext(PlaylistContext);
  return useActor(service);
};
