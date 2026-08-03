import './Gallery.css';
import ScrollDownButton from '../ScrollDownButton';

const Gallery = () => {
  return (
    <section className="gallery">
      <h2>The Perfect Nock</h2>
      <p>A flawless connection between archer and arrow. Our nock design ensures a consistent, clean release for every single shot.</p>
      <ScrollDownButton target=".pricing-section" label="Lihat pilihan harga" />
    </section>
  )
}
export default Gallery;