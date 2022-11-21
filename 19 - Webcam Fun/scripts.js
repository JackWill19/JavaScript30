const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }) //Grabs users video input
    .then(localMediaStream => {
      console.log(localMediaStream);

      video.srcObject = localMediaStream; //setting source of video to localMediaStream
      video.play(); //Play video
    })
    .catch(err => {
      console.error(`OH NO!!!`, err); //Log error if error occurs
    });
}




function paintToCanvas () {
    const width = video.videoWidth; //Setting width to the same as video width
    const height = video.videoHeight; //Same with height
    canvas.width = width; //Matching the canvas to the width and height of video
    canvas.height = height;
    console.log(width, height);

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height); // Making a function which draws the video element onto the canvas every 16 miliseconds.
        let pixels = ctx.getImageData(0, 0, width, height)
        // pixels = redEffect(pixels);
        pixels = rgbSplit(pixels);
        ctx.putImageData(pixels, 0, 0)
    }, 16);
}

function takePhoto() {
  snap.currentTime = 0; //Playing a snap sound
  snap.play();

  // Taking data from canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a'); //create a link
  link.href = data; // set href to the photo link
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome"`;
  link.textContent = 'Download Image';
  strip.insertBefore (link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo(); //Calling function

video.addEventListener('canplay', paintToCanvas);