import './Gallery.css';
import { ImageIcon } from 'lucide-react';
import ScrollDownButton from '../ScrollDownButton';

interface GalleryItem {
  id: string;
  caption: string;
  imageSrc?: string; // Path file di folder public (misal: '/img/gallery/studio-01.jpeg')
  alt?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { 
    id: 'studio-01', 
    caption: 'Inti Karbon',
    imageSrc: '/img/gallery/studio-01.jpeg',
    alt: 'Dokumentasi Inti Karbon GOTECH'
  },
  { 
    id: 'studio-02', 
    caption: 'Ujung Stainless',
    imageSrc: '/img/gallery/studio-02.jpeg',
    alt: 'Dokumentasi Ujung Stainless Steel'
  },
  { 
    id: 'process-01', 
    caption: 'Perakitan Vane',
    imageSrc: '/img/gallery/process-01.jpeg',
    alt: 'Proses Perakitan Vane Panah'
  },
  { 
    id: 'process-02', 
    caption: 'Hasil Lapangan',
    imageSrc: '/img/gallery/process-02.jpeg',
    alt: 'Uji Lapangan Produk'
  },
  { 
    id: 'process-03', 
    caption: 'Hasil Lapangan',
    imageSrc: '/img/gallery/process-03.jpeg',
    alt: 'Uji Akurasi Lapangan'
  },
  { 
    id: 'process-04', 
    caption: 'Hasil Lapangan',
    imageSrc: '/img/gallery/process-04.jpeg',
    alt: 'Hasil Pengujian Target'
  },
];

const Gallery = () => {
  return (
    <section className="gallery">
      <h2>Dokumentasi</h2>
      <p>Sekilas proses di balik layar - dari studio, lini produksi, hingga uji lapangan setiap panah GOTECH.</p>

      <div className="gallery__grid">
        {GALLERY_ITEMS.map((item) => (
          <figure key={item.id} className="gallery__item">
            <div className="gallery__image-wrapper">
              {item.imageSrc ? (
                <img 
                  src={item.imageSrc} 
                  alt={item.alt || item.caption} 
                  className="gallery__image"
                  loading="lazy"
                  onError={(e) => {
                    // Jika file belum ada di public atau gagal dimuat, tampilkan ikon placeholder
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}

              {/* Placeholder fallback */}
              <div 
                className={`gallery__placeholder ${item.imageSrc ? 'hidden' : ''}`} 
                aria-hidden="true"
              >
                <ImageIcon size={28} strokeWidth={1.5} />
              </div>
            </div>
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>

      <ScrollDownButton target=".pricing-section" label="Lihat pilihan harga" />
    </section>
  );
};

export default Gallery;