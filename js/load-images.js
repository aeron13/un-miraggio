const imageNumber = 26
// define images width. original: 4961
const originalImageWidth = 4961
var imageWidth = originalImageWidth;
// define images height. original: 1890
const originalImageHeight = 1890
var imageHeight = originalImageHeight;
// define max image width in px
const maxHeightDESKTOP = 750;
const maxHeightMOBILE = 500;
var maxHeight = maxHeightDESKTOP;


// 0. --- FIND IMAGES PROPORTIONS

// Sets the right maxHeight,
// checking if is mobile or not
function setHeight() {
  if(window.innerWidth <= 500)
  {
    maxHeight = maxHeightMOBILE;
  }
  else {
    maxHeight = maxHeightDESKTOP;
  }
}

//-> finds the right proportions
function findProportions() {
  //sets the right maxHeight
  setHeight();
  // on big screens make them small
  if(window.innerHeight > maxHeight) {
   	// imageWidth : maxheight = originalimagewidth : originalimageheight
  	imageWidth = maxHeight * originalImageWidth / originalImageHeight;
   imageHeight = maxHeight;
    // on small screens make them original size
  } else {
    imageWidth = window.innerHeight * originalImageWidth / originalImageHeight;
    imageHeight = window.innerHeight;
  }
}


findProportions();

// image container
const imgContainer = document.querySelector('.image-container')

// 1. --- CREATE IMAGES and ADD THEM  to the container --------------------
// ------------------------------------------------------------------------

function createImages() {
  for( i=1; i<=imageNumber; i++) {
    // creates div that contains the single image
    div = document.createElement('div')
    div.classList.add('image')
    div.id = 'image-' + i;
    imgContainer.appendChild(div)
    // find url of image
    src = './img/el.' + i +'.jpg'
    // create img tag with that url as src attribute
    img = document.createElement('img')
    img.src = src;
    // rel="preload"
    img.rel = 'preload'
    // append img element to its container div
    div.appendChild(img)
    //div.style.backgroundImage = 'url('+src+')';
  }
}

createImages();

function findVhWidth(selector) {
  //document.querySelector('.ending-container')
    var thisPixelWidth = document.querySelector(selector).offsetWidth
  // thisPixelWidth : imgContainer.innerHeight = x : 100vh
  return thisPixelWidth * 100 / imgContainer.offsetHeight
}

//2. --- set the DIMENTION OF THE CONTAINERS & the body according to the number of images
// --------------------------------------------------------------------------------------

function setWidths() {
  // 2.1 find width for the div that contains only images
    /* 4961 : 1890 = x : 100 */
    /* x = 262.48vh */
  	/* imageWidth * imageNumber : containerWidth = window.innerHeight : 100 */
  var containerWidth = imageWidth * imageNumber * 100 / window.innerHeight;
  // 2.2 find ending container width in %
  // set the width for the containers and for the body
  document.querySelector('.scroll-container').style.width = containerWidth + findVhWidth('.ending-container') + 'vh';
  document.querySelector('.image-super-container').style.width = containerWidth + 'vh';
  document.body.style.height = containerWidth + findVhWidth('.ending-container') + 'vh';
  document.querySelector('.ending-container').style.left = containerWidth + 'vh';
}

setWidths();
// the proportions are redefined on resize
window.addEventListener('resize', findProportions )
window.addEventListener('resize', setWidths )

// 3. --- LOADING ANIMATION -----------------------------------------------
// ------------------------------------------------------------------------

var imageLoaded = 0
// loading text = 0%
// get all images
// for each image
// when is loaded, imageLoaded ++
// -- display the current percentage of loading
// imageLoaded : imageNumber = x : 100
// x = imageLoaded * 100 / imageNumber
// loading text = currentLoading
// -- if imageLoaded == imageNumber
// all images appear
// loading text disappears
const loadingText = document.querySelector('.loading-text')
loadingText.innerText = imageLoaded + ' %'

document.querySelectorAll('.image img').forEach( function(image) {
  image.addEventListener('load', function() {
    imageLoaded = imageLoaded + 1
    var currentLoading = imageLoaded * 100 / imageNumber;
    loadingText.innerText = parseInt( currentLoading ) + ' %'
    if(imageLoaded == imageNumber) {
      setTimeout(function() { loadingText.style.display = 'none'}, 200 )
      setTimeout(function() {
        // music player fades in
        document.querySelector('#audio-switcher').style.opacity = '1'
      }, 450)
    }
  })
})


// l'indicazione per lo scroll compare dopo che si è attivata la musica
document.querySelector('#audio-switcher').addEventListener('click', function(event) {
  // solo la prima volta che l'audio switcher viene cliccato:
  if( !event.target.classList.contains("clicked"))
  {
    setTimeout(function() {
      // scroll indicator appears
      document.querySelector('.arrow-indicator p').style.opacity = '1'
      // scrollbar appears
      document.querySelector('#progressBarContainer').style.opacity = '1'
    }, 1300)
  }
})
