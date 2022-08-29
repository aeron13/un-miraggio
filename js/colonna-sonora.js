// pulsante play
const audioSwitcher = document.querySelector('#play-button')
const allAudio = document.querySelectorAll('audio')
var timer = 0;
var primoClick = false;
// parametro che controlla la durata di ogni pezzo
const timeConst = 30;
// all'inizio tutti gli audio sono mute
var isMute = true;


// 1. on click sul pulsante PLAY:
// - in ogni caso:
// -- l'audio toggle il muted
// - Al primo click:
// -- parte la funzione per l'audio e il timer
// - Ai click successivi:
// -- fa andare la funzione playStop
audioSwitcher.addEventListener('click', function() {
  // in ogni caso toggle il muted
  allAudio.forEach( function(audio) {
    audio.muted = !audio.muted;
  })
  isMute = !isMute;
  // se è il primo click fa partire la funzione che controlla la riproduzione
  if(!primoClick) {
    checkTheTime();
    primoClick = true;
    audioSwitcher.innerText = 'Playing...';
    // se non è il primo click, ferma o fa ripartire la musica
  } else {
    playStop()
  }
})

// funzione che aggiorna il timer contando i secondi
function updateTimer() {
  timer++;
}

// 2. -- Controlla la riproduzione degli audio

// per ogni audio definire 3 array
// var startPoints =  [0, 3,   4, 6.5, 7,   9,    10.5, 11.4, 13.2, 14,    15.6, 19.2, 22.5, 24.5];
// var endingPoints = [3, 3.7, 6, 7,   8.5, 10.5, 11.3, 12.5, 13.9, 15.25, 18.5, 22, 24.3, 26];
// - 1. la durata di ogni pezzo
var durata =          [3.7, 0.7, 3, 0.5, 1.5, 1.5, 0.8, 1.1, 0.8, 1.25, 2.9,  2.8, 1.8, 1.5 ];
// - 2. dopo quanto rispetto al pezzo precedente deve partire quello corrente
var ritardo =         [0, 0,   0.3, 0.5, 0,   0.5, 0,   0.1, 0.7, 0.1,  0.35, 0.7, 0.5, 0.2 ];
// - 3. quando deve partire
var startPoints = [];
for(i = 0; i < durata.length; i++) {
  // per ogni i:
  // somma tutte le durate prima di quella i
  // -- 1. taglia l'array durata fino a i escluso
  var thisDurate = durata.slice(0, i);
  var sommaDurate = thisDurate.reduce(function(a, b){ return a + b; }, 0);
  // somma tutti i ritardi fino a quella i
  var thisRitardi = ritardo.slice(0, i+1);
  var sommaRitardi = thisRitardi.reduce(function(a, b){ return a + b; }, 0);
  // inserisce il valore nell'array
  var startPoint = sommaDurate + sommaRitardi;
  startPoints.push(startPoint);
}
// - 2. quando deve finire
// per ogni elemento, prende il relativo startpoint e ci aggiunge la durata
var endingPoints = [];
for(i = 0; i < durata.length; i++) {
  var endingPoint = startPoints[i] + durata[i];
  endingPoints.push(endingPoint)
}


 // di default gli audio non sono ancora partiti
  var isPlaying = false;

// ad ogni secondo, controlla in quale momento si è
// si può essere:
// A. prima di un pezzo: il pezzo si deve fermare
// B. durante un pezzo: il pezzo deve partire
// C. dopo un pezzo: il pezzo si deve fermare
// quando trova quella valida, lancia la funzione giusta
function checkTheTime() {
    if(!isMute) {
      updateTimer();
      setTimeout(checkTheTime, 1000);
      // per ogni audio che c'è
      for(i = 0; i < startPoints.length; i++) {
            // se è prima dell'inizio ferma
          	// se è dopo la fine ferma
            if(timer < timeConst * startPoints[i]
              || timer > timeConst * endingPoints[i] ) {
              pauseAudio('pausa ' + i, i)
            }
            // se è tra l'inizio e la fine parti
            else if( timeConst * startPoints[i] < timer && timer < timeConst * endingPoints[i] )
            {
           		 playAudio(i);
            }
      }
    }
 	 }



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
                 setTimeout( function() {q.pause();}, 250);
                 //alert('clearInterval fAudio'+ InT.toFixed(1));
             	 };
          },50);
       };
   };

   // funzione che ferma o fa partire la musica quando si clicca sul pulsante play
   function playStop() {

       // trova la musica che stava andando in quel momento
       for(i = 0; i < startPoints.length; i++) {
         if( timeConst * startPoints[i] < timer && timer < timeConst * endingPoints[i] )
         {
           // se è stato premuto stop
           if(isMute) {
             audioSwitcher.innerText = 'Resume';
             pauseAudio('pausa ' + i, i);
           } else {
             audioSwitcher.innerText = 'Playing...';
             playAudio(i);
             setTimeout(checkTheTime, 1000);
           }
         }
       } // endfor
   }


// funzione che crea il bottone per andare avanti con la musica
// al click sul bottone, solo se non è Mute manda avanti di 1 minuto
function skipButton() {
  const skipButton = document.createElement('button');
  skipButton.style.position = 'absolute'
  skipButton.style.top = '0'
  skipButton.style.right = '0'
  skipButton.style.margin = '0.5em'
  skipButton.style.fontSize = '0.8em'
  skipButton.innerText = '>>>'
  document.body.appendChild(skipButton)
  skipAmount = 60
  amountSkipped = 0
  skipButton.addEventListener('click', function() {
    if(!isMute) {
      timer = timer + skipAmount;
      amountSkipped = amountSkipped + skipAmount;
      skipButton.innerText = '+ ' + amountSkipped / 60 + 'min';
      checkTheTime();setTimeout( function() {
        skipButton.innerText = '>>>'
      }, 300)
    }
  })
}
skipButton();
