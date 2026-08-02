import * as THREE from 'three';

export function createVaneBrandTexture(text: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // dasar putih, sesuai warna vane ke-3
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // teks brand, disusun memanjang mengikuti arah vane
    ctx.fillStyle = '#111214';
    ctx.font = 'bold 88px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 2); // teks dibaca dari tip depan ke belakang
    ctx.fillText(text, 0, 0);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}