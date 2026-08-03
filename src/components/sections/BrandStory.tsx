import './BrandStory.css';
import ScrollDownButton from '../ScrollDownButton';

const BrandStory = () => {
  return (
    <section className="brand-story">
      <h2>The Carbon Core.</h2>
      <p>Our proprietary carbon fiber weave provides the ultimate in stiffness, consistency, and durability. It's the backbone of every perfect shot.</p>
      <ScrollDownButton target=".product-highlights" label="Lihat Tungsten Point" />
    </section>
  )
}
export default BrandStory;