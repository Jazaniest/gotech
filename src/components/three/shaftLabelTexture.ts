import * as THREE from 'three';

export function createShaftLabelTexture(text: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;    // lebar strip (searah keliling, sempit)
    canvas.height = 1024;  // panjang strip (searah shaft/Z, panjang)
    const ctx = canvas.getContext('2d')!;

    // transparan, biar cuma teksnya yang keliatan nempel di shaft
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // corak garis tipis di sepanjang strip
    ctx.strokeStyle = 'rgba(255,212,0,0.35)';
    ctx.lineWidth = 2;
    for (let y = 0; y < canvas.height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // teks dibaca dari atas ke bawah (rotate 90°)
    ctx.fillStyle = '#FFD400';
    ctx.font = 'bold 56px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2); // putar 90° biar teks tegak lurus mengikuti panjang shaft
    ctx.fillText(text, 0, 0);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}