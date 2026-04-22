import { create } from 'zustand';

interface UIState {
    selectedSong: any | null;
    setSelectedSong: (song: any | null) => void;
    selectedArtist: any | null;
    setSelectedArtist: (artist: any | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    selectedSong: null,
    setSelectedSong: (song) => set({ selectedSong: song }),
    selectedArtist: null,
    setSelectedArtist: (artist) => set({ selectedArtist: artist }),
}));
