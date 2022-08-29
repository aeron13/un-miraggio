var firstScroll = 0

document.addEventListener('scroll', function(e) {
  var topScrolled = window.scrollY
   document.querySelector('.scroll-container').style.left = -1 * topScrolled + 'px';
  // first scroll
  if(firstScroll === 0 && imageLoaded == imageNumber) {
    firstScroll = 1;
     document.querySelector('.image-container').style.opacity = '1'
     document.querySelector('.arrow-indicator').style.opacity = '0'
  }
})
