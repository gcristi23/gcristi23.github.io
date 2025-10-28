var loadedPhotos = 0;
const WIDTH = 1000;
const HEIGHT = WIDTH * 1.48;
const MAX_PHOTO_WIDTH = 1000;
const SPACE = 0.01 * HEIGHT;
const OVERLAY_HEIGHT = HEIGHT * 0.2;
const MAX_PHOTO_HEIGHT = (HEIGHT - OVERLAY_HEIGHT - SPACE * 4)/2;



const photo1Input = document.getElementById('photo1');
const photo2Input = document.getElementById('photo2');
const combineBtn = document.getElementById('combineBtn');
const downloadBtn = document.getElementById('downloadBtn');
const printBtn = document.getElementById('printBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let img1 = null, img2 = null;
let overlay = new Image();
overlay.crossOrigin = "anonymous";
overlay.src = './assets/overlay.png';

// Load both photos
photo1Input.addEventListener('change', e => loadPhoto(e.target.files[0], 1));
photo2Input.addEventListener('change', e => loadPhoto(e.target.files[0], 2));

function resizeImageRatio(img, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    return ratio;
}

function loadPhoto(file, which) {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
        if (which === 1) img1 = img;
        else img2 = img;

        if (loadedPhotos < 2) loadedPhotos++;
        if (loadedPhotos === 2) {
            generateImage();
            loadedPhotos = 0;
        }

    };
    img.src = URL.createObjectURL(file);
}

generateImage = () => {
    if (!img1 || !img2) return alert('Please select both photos first.');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    //set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);



    const img1Ratio = resizeImageRatio(img1, MAX_PHOTO_WIDTH, MAX_PHOTO_HEIGHT);

    const imagewidth = img1.width * img1Ratio;
    const imageheight = img1.height * img1Ratio;

    //calculate horizantal centering
    const horizontalOffset = (WIDTH - imagewidth) / 2;
    const verticalOffset = (HEIGHT - (imageheight * 2 + SPACE *4 + OVERLAY_HEIGHT)) / 2;
    // Draw first photo
    ctx.drawImage(img1, horizontalOffset, verticalOffset+SPACE, imagewidth, imageheight);
    ctx.drawImage(overlay, 0, verticalOffset + SPACE*2 + imageheight, WIDTH, OVERLAY_HEIGHT);

    // Draw second photo
    ctx.drawImage(img2, horizontalOffset, verticalOffset + SPACE * 3 + imageheight + OVERLAY_HEIGHT, imagewidth, imageheight);
};

combineBtn.onclick = generateImage;

printBtn.onclick = () => {
    // if (!currentImage) return alert('No photo to print.');
    const imgData = canvas.toDataURL('image/jpeg');
    const newWin = window.open("");
    newWin.document.write(`<img src="${imgData}" style="width:100%">`);
    newWin.document.close();

    // Wait for the image to load before printing
    newWin.onload = () => {
        newWin.print();
        newWin.onafterprint = () => {
            newWin.close();
        };
    };
};

downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = 'double-photo-frame.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
};
