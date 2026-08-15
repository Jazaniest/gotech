import './BrandStory.css';
import ScrollDownButton from '../ScrollDownButton';

const BrandStory = () => {
  return (
    <section className="brand-story">
      <h2>Inti Karbon.</h2>
      <p>Kain tenun serat karbon eksklusif kami memberikan kekakuan, konsistensi, dan daya tahan terbaik. Ini adalah tulang punggung dari setiap bidikan yang sempurna.</p>
      <ScrollDownButton target=".product-highlights" label="Lihat Tungsten Point" />
    </section>
  )
}
export default BrandStory;