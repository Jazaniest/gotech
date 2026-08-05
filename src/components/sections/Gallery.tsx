import './Gallery.css';
import { ImageIcon } from 'lucide-react';
import ScrollDownButton from '../ScrollDownButton';

interface GalleryItem {
  id: string;
  caption: string;
}

// PENTING: ini masih placeholder. Ganti tiap item di bawah dengan foto
// produk asli (foto studio, proses produksi, atau uji lapangan) sebelum
// karya ini dikumpulkan — guidebook mensyaratkan section "Dokumentasi"
// berisi gambar nyata, bukan placeholder. Cara ganti: import file gambar
// dari src/assets, lalu render <img src={...} alt="..." /> di dalam
// .gallery__placeholder menggantikan ikon <ImageIcon />.
const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'studio-01', caption: 'Studio Shot — Carbon Core' },
  { id: 'studio-02', caption: 'Studio Shot — Tungsten Point' },
  { id: 'process-01', caption: 'Proses Produksi — Vane Assembly' },
  { id: 'process-02', caption: 'Quality Control — Spin Test' },
  { id: 'field-01', caption: 'Field Test — Precision Shot' },
  { id: 'field-02', caption: 'Field Test — Distance Trial' },
];

const Gallery = () => {
  return (
    <section className="gallery">
      <h2>Dokumentasi</h2>
      <p>Sekilas proses di balik layar — dari studio, lini produksi, hingga uji lapangan setiap panah GOTECH.</p>

      <div className="gallery__grid">
        {GALLERY_ITEMS.map((item) => (
          <figure key={item.id} className="gallery__item">
            <div className="gallery__placeholder" aria-hidden="true">
              <ImageIcon size={28} strokeWidth={1.5} />
            </div>
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>

      <ScrollDownButton target=".pricing-section" label="Lihat pilihan harga" />
    </section>
  )
}
export default Gallery;
