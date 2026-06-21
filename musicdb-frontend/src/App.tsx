import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import Layout from '@/components/Layout';

// Import pages
import Home from '@/pages/page';
import LandingPage from '@/pages/welcome/page';
import SongsPage from '@/pages/songs/page';
import SongPage from '@/pages/song/SongPage';
import SearchPage from '@/pages/search/page';
import ReviewsPage from '@/pages/reviews/page';
import RegisterPage from '@/pages/register/page';
import ProfilePage from '@/pages/profile/page';
import LoginPage from '@/pages/login/page';
import FavoritesPage from '@/pages/favorites/page';
import CommunityPage from '@/pages/community/page';
import ChartsPage from '@/pages/charts/page';
import ArtistsPage from '@/pages/artists/page';
import AdminDashboard from '@/pages/admin/page';
import ArtistPage from '@/pages/artist/ArtistPage';
import GenrePage from '@/pages/genre/GenrePage';
import GenresOverviewPage from '@/pages/genres/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Authenticated Routes wrapped in Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/songs" element={<SongsPage />} />
            <Route path="/song/:id" element={<SongPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/charts" element={<ChartsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/genre/:genreName" element={<GenrePage />} />
            <Route path="/genres" element={<GenresOverviewPage />} />
          </Route>
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
