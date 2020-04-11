function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffle(arr) {
  let _arr = [...arr];
  for(let i = 0; i< _arr.length; i++) {
    let r = getRandomInt(0, i);
    let c = _arr[i];
    _arr[i] = _arr[r];
    _arr[r] = c;
  }
  return _arr;
}

export function debounce(fn, delay) {
  let timeId;

  return function (...args) {
    window.clearTimeout(timeId);
    timeId = window.setTimeout(_ => {
      fn && fn.apply(null, args);
    }, delay);
  }

}
