const computedSize = () => {
  const base = 375;
  const w = document.documentElement.clientWidth / base * 100;
  if(document.documentElement.clientWidth > 640) {
    document.documentElement.style.fontSize = `100px`;
  } else {
    document.documentElement.style.fontSize = `${w}px`;
  }
}
const arr = [];
arr.push(computedSize);
if (window.onload) {
  arr.push(window.onload);
}
arr.forEach(func => {
  func();
})
window.onresize = () => { computedSize() }