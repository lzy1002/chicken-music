export const singer = (state) => state.singer;

export const playing = (state) => state.playing;

export const playMode = (state) => state.playMode;

export const playList = (state) => state.playList;

export const sequenceList = (state) => state.sequenceList;

export const currentIndex = (state) => state.currentIndex;

export const fullScreen = (state) => state.fullScreen;

export const currentSong = (state) => state.playList[state.currentIndex] || {};

export const disc = (state) => state.disc;

export const rank = (state) => state.rank;

export const searchHistory = (state) => state.searchHistory;
