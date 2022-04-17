(function() {
    var width = 320;
    var height = 0;

    var streaming = false;

    var video = null;
    var canvas = null;
    var startbutton = null;


    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        startbutton = document.getElementById('startbutton');
    
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function(stream) {
          video.srcObject = stream;
          video.play();
        })
        .catch(function(err) {
          console.log("An error occurred: " + err);
        });
    
        video.addEventListener('canplay', function(ev){
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth/width);
          
            if (isNaN(height)) {
              height = width / (4/3);
            }
          
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
          }
        }, false);
    
        startbutton.addEventListener('click', async function(ev){
            var context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');

            let response = await fetch('/take_image', {
                method: "POST",
                body: data
            });
            
            let response_json = await response.json()
            console.log(response_json)

            ev.preventDefault();
        }, false);
      }

    window.addEventListener('load', startup);
})();