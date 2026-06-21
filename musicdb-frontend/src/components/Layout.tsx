import { Outlet } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import SongDetailOverlay from '@/components/SongDetailOverlay';
import ArtistDetailOverlay from '@/components/ArtistDetailOverlay';
import CinematicOverlay from '@/components/CinematicOverlay';

export default function Layout() {
  return (
    <>
      <CinematicOverlay />
      <TopBar />
      <main className="flex-1 overflow-y-auto bg-transparent relative z-10 w-full">
        <Outlet />
      </main>
      <SongDetailOverlay />
      <ArtistDetailOverlay />
    </>
  );
}
