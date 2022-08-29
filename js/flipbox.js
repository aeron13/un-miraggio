		// set up hover panels
		// although this can be done without JavaScript, we've attached these events
		// because it causes the hover to be triggered when the element is tapped on a touch device
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.hover').forEach( function (element) {

    element.addEventListener("mouseenter", function() {
      element.classList.add('flip')
    })
    
     element.addEventListener("mouseleave", function() {
      element.classList.remove('flip')
    })
  })

  document.querySelector('.flipbox-container').addEventListener('click', function () {
    if(e.target !== e.currentTarget) return;
      document.querySelectorAll('.hover').forEach( function (element) {
        element.classList.remove('flip')
      })
    })
  
})

// flipboxes vanno alla fine 
function flipboxes (width) {
  var endleft = width * imageNumber + width
  const endingcontainer = document.querySelector('.ending-container')
//  const flipcontainer = document.querySelector('.flipbox-container')
  endingcontainer.style.left = endleft + 'px'
  endingcontainer.style.display = 'flex'
}
