const audioSwitcher = document.querySelector('#audio-switcher')

var myAudios = document.querySelectorAll('audio');

// per ogni audio definire 2 array
// - 1. quando deve partire
// ogni numero indica dopo quante immagini scrollate deve partire / finire
 var startPoints =  [0, 3,   4, 6.5, 7,   9,    10.5, 11.4,   13.2, 14, 15.6, 19.2, 22.5, 24.5];
// - 2. quando deve finire
 var endingPoints = [2.9, 3.8, 6, 7,   8.5, 10.5, 11.3, 12.5, 13.9, 15.25, 18.5, 22, 24.3, 26];

 // di default gli audio non sono ancora partiti
 var primoClick = false;
 var isPlaying = false;

audioSwitcher.addEventListener('click', function() {
  if(!primoClick) {
        audioSwitcher.classList.add('clicked')

        // --- RIPRODUZIONE AUDIO

        // create an audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();

        // Create a MediaElementAudioSourceNode
        var sources = [];
        var gainNodes = [];

        // forEach audio
        myAudios.forEach((audio, i) => {

          // Feed the HTMLMediaElement into it
           sources[i] = audioCtx.createMediaElementSource(audio);

          // Create a gain node
          gainNodes[i] = audioCtx.createGain();

          // connect the AudioBufferSourceNode to the gainNode
          // and the gainNode to the destination, so we can play the
          // music and adjust the volume
          sources[i].connect(gainNodes[i]);
          gainNodes[i].connect(audioCtx.destination);
          // setta il volume a 1
        //  gainNodes[i].gain.value = 1;

        });

        // 3. -- Controlla la riproduzione degli audio

        // trova la larghezza dell'immagine
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
          for(i = 0; i < myAudios.length; i++) {
                // se è prima dell'inizio ferma
                // se è dopo la fine ferma
                if(window.pageYOffset < window.innerWidth/3 + startPadding + thisImageWidth * startPoints[i]
                  || window.pageYOffset > window.innerWidth/3 + startPadding + thisImageWidth * endingPoints[i] ) {
                  pauseAudio(i)
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
             myAudios[i].play();
             console.log('play')
             audioVolumeIn(i)
             isPlaying = i+1;
           }
         }


          function pauseAudio(i) {
              if( isPlaying == i+1 ) {
                console.log('stop')
                audioVolumeOut(i);
                isPlaying = false;
              }
          }



        // fading audio out
         function audioVolumeOut(i){
          // gainNodes[i].gain.linearRampToValueAtTime(0, audioCtx.currentTime + 4);
                  var InT = 0.5;
                  var setVolume = 0;  // Target volume level for old song
                  var speed = 0.005;  // Rate of volume decrease
                  gainNodes[i].gain.value = InT;
                  var fAudio = setInterval(function(){
                      InT -= speed;
                      gainNodes[i].gain.value = InT.toFixed(1);
                      if(InT.toFixed(1) <= setVolume){
                         clearInterval(fAudio);
                          setTimeout( function() {myAudios[i].pause();}, 1000);
                         //alert('clearInterval fAudio'+ InT.toFixed(1));
                       };
                  }, 25);
           };

           // fading audio in
           function audioVolumeIn(i){
          //   gainNodes[i].gain.linearRampToValueAtTime(1, audioCtx.currentTime + 2);
                 var InT = 0;
                 var setVolume = 0.5; // Target volume level for new song
                 var speed = 0.05; // Rate of increase
                 gainNodes[i].gain.value = InT;
                 var eAudio = setInterval(function(){
                     InT += speed;
                     gainNodes[i].gain.value = InT.toFixed(1);
                     if(InT.toFixed(1) >= setVolume){
                        clearInterval(eAudio);
                        //alert('clearInterval eAudio'+ InT.toFixed(1));
                     };
                 },50);
          };

        primoClick = true;

        //removes fixed position of body
        document.body.style.position = 'unset';
  }

  myAudios.forEach((audio, i) => {
    audio.muted = !audio.muted;
    if(audio.muted) {
      audioSwitcher.innerText = 'Sound off';
    } else {
      audioSwitcher.innerText = 'Sound on';
    }
  });

 } )
