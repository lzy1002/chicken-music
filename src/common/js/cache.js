import storage from "good-storage";

const SEARCH_KEY = "__search__";
const FAVORITE_KEY = "__favorite__";
const LATELY_KEY = "__lately__";

function insertBefore(list, fn, current) {
  let index = list.findIndex(fn);

  if(index !== -1) {
    list.splice(index, 1);
  }

  list.unshift(current);
}

function removeItem(list, fn) {
  let index = list.findIndex(fn);
  list.splice(index, 1);
}

export function addHistory(history) {
  let searchList = storage.get(SEARCH_KEY, []);
  insertBefore(searchList, item => item === history, history);
  storage.set(SEARCH_KEY, searchList);
  return searchList;
}

export function clearHistory() {
  storage.remove(SEARCH_KEY);
  return storage.get(SEARCH_KEY, []);
}

export function removeHistory(history) {
  let searchList = storage.get(SEARCH_KEY, []);
  removeItem(searchList, item => item === history);
  storage.set(SEARCH_KEY, searchList);
  return searchList;
}

export function loadSearchHistory() {
  return storage.get(SEARCH_KEY, []);
}

export function addFavorite(song) {
  let favoriteList = storage.get(FAVORITE_KEY, []);
  insertBefore(favoriteList, item => item.songid === song.songid, song);
  storage.set(FAVORITE_KEY, favoriteList);
  return favoriteList;
}

export function removeFavorite(song) {
  let favoriteList = storage.get(FAVORITE_KEY, []);
  removeItem(favoriteList, item => item.songid === song.songid);
  storage.set(FAVORITE_KEY, favoriteList);
  return favoriteList;
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, []);
}

export function addLately(song) {
  let latelyList = storage.get(LATELY_KEY, []);
  insertBefore(latelyList, item => item.songid === song.songid, song);
  storage.set(LATELY_KEY, latelyList);
  return latelyList;
}

export function loadLately() {
  return storage.get(LATELY_KEY, []);
}
