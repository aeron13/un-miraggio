// 1. load dell'audio
// quante clip audio ci sono
const audioNumber = 14

// crea gli elementi audio
// muted di default
// li appende al body
/*for(i = 1; i <= audioNumber; i++) {
  var audio = document.createElement("AUDIO");
	audio.setAttribute("src","progettospeciale-bounce-provvisorio-"+ i +".mp3");
  audio.setAttribute('preload', 'true');
  audio.setAttribute('id', 'audio'+i);
  audio.muted = true;
	document.body.appendChild(audio)
}
*/

// 2. on click su un pulsante l'audio toggle il muted
const audioSwitcher = document.querySelector('#audio-switcher')
const allAudio = document.querySelectorAll('audio')

audioSwitcher.addEventListener('click', function() {
 	allAudio.forEach( function(audio) {
		audio.muted = !audio.muted;
    if(audio.muted) {
      audioSwitcher.innerText = 'Sound off';
    } else {
      audioSwitcher.innerText = 'Sound on';
    }
    audioSwitcher.classList.add('clicked')
  })
})

 /* var allMediaSources = [];

allAudio.forEach((item, i) => {
  var source = audioCtx.createMediaElementSource(item);
  allMediaSources.push(source)
});
*/


// 3. -- Controlla la riproduzione degli audio

// per ogni audio definire 2 array
// - 1. quando deve partire
// ogni numero indica dopo quante immagini scrollate deve partire / finire
 var startPoints =  [0, 3,   4, 6.5, 7,   9,    10.5, 11.4,   13.2, 14, 15.6, 19.2, 22.5, 24.5];
// - 2. quando deve finire
 var endingPoints = [3, 3.7, 6, 7,   8.5, 10.5, 11.3, 12.5, 13.9, 15.25, 18.5, 22, 24.3, 26];
// - 3. la velocità a cui deve avvenire il fade di entrata
// - 4. la velocità a cui deve avvenire il fade in uscita

 // di default gli audio non sono ancora partiti
  var isPlaying = false;
  const image = document.querySelector('.image');
  var startPadding = 0;
  if(window.innerWidth < 500 ) {
    startPadding = 500;
  }

// ad ogni scroll, controlla in quale posizione si è
// a seconda della posizione scrollata, si può essere:
// A. prima di un pezzo: il pezzo si deve fermare
// B. durante un pezzo: il pezzo deve partire
// C. dopo un pezzo: il pezzo si deve fermare
// quando trova quella valida, lancia la funzione giusta
  window.addEventListener('scroll', function() {
    var thisImageWidth = image.clientWidth;
    // per ogni audio che c'è
    for(i = 0; i < audioNumber; i++) {
          // se è prima dell'inizio ferma
        	// se è dopo la fine ferma
          if(window.pageYOffset < window.innerWidth/3 + startPadding + thisImageWidth * startPoints[i]
            || window.pageYOffset > window.innerWidth/3 + startPadding + thisImageWidth * endingPoints[i] ) {
            pauseAudio('pausa ' + i, i)
          }
          // se è tra l'inizio e la fine parti
          else if( window.innerWidth/3 + startPadding + thisImageWidth * startPoints[i] < window.pageYOffset
                  && window.pageYOffset < window.innerWidth/3 + startPadding + thisImageWidth * endingPoints[i])
          {
         		 playAudio(i);
          }
    }
 	 })

		function playAudio(i) {
      if( !isPlaying ) {
        console.log('durante ' + i);
        isPlaying = i+1;
        console.log(isPlaying);
        allAudio[i].play();
        allAudio[i].volume = 0.1;
        audioVolumeIn(allAudio[i])
      }
    }

	function pauseAudio(cosaDire, i) {
      if( isPlaying == i+1 ) {
        console.log(cosaDire);
        isPlaying = false;
        audioVolumeOut(allAudio[i]);
      }
  }



// Fading audio
// fading audio in
    function audioVolumeIn(q){
       if(q.volume){
          var InT = 0;
          var setVolume = 0.5; // Target volume level for new song
          var speed = 0.05; // Rate of increase
          q.volume = InT;
          var eAudio = setInterval(function(){
              InT += speed;
              q.volume = InT.toFixed(1);
              if(InT.toFixed(1) >= setVolume){
                 clearInterval(eAudio);
                 //alert('clearInterval eAudio'+ InT.toFixed(1));
              };
          },50);
       };
   };

// fading audio out
 function audioVolumeOut(q){
       if(q.volume){
          var InT = 0.5;
          var setVolume = 0;  // Target volume level for old song
          var speed = 0.01;  // Rate of volume decrease
          q.volume = InT;
          var fAudio = setInterval(function(){
              InT -= speed;
              q.volume = InT.toFixed(1);
              if(InT.toFixed(1) <= setVolume){
                 clearInterval(fAudio);
                  setTimeout( function() {q.pause();}, 100);
                 //alert('clearInterval fAudio'+ InT.toFixed(1));
             	 };
          },50);
       };
   };
