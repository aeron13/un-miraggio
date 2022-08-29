// https://jsfiddle.net/jogesh_pi/2my93ztn/1/

const progressBarContainer = document.querySelector("#progressBarContainer");
const progressBar = document.querySelector("#progressBar");
let totalPageHeight = document.body.scrollHeight - window.innerHeight;
let debounceResize;

window.addEventListener("scroll", () => {
  let newProgressHeight = window.pageYOffset / totalPageHeight;
  progressBar.style.left = 'calc(' + (newProgressHeight) * 100 + '% - 10px)';
  //progressBar.style.opacity = `${newProgressHeight}`;
}, {
  capture: true,
  passive: true
});

window.addEventListener("resize", () => {
  clearTimeout(debounceResize);
  debounceResize = setTimeout(() => {
    totalPageHeight = document.body.scrollHeight - window.innerHeight;
  }, 250);
});

progressBarContainer.addEventListener("click", (e) => {
  var scrollProportion = e.clientX
  let newPageScroll = e.clientX * totalPageHeight / progressBarContainer.offsetWidth;
  // for vertical scrollbar:
    // e.clientX : progressBarContainer.offsetWidth = newPageScroll : totalPageHeight
		//  let newPageScroll = e.clientY / progressBarContainer.offsetHeight * totalPageHeight;
  window.scrollTo({
    top: newPageScroll
  });
});

