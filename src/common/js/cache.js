import storage from "good-storage";

const SEARCH_KEY = "__search__";

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
