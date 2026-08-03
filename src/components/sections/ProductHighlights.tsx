import './ProductHighlights.css';
import ScrollDownButton from '../ScrollDownButton';

const ProductHighlights = () => {
  return (
    <section className="product-highlights">
      <h2>Tungsten Point</h2>
      <p>Precision-machined tungsten alloy concentrates mass at the very tip, driving deeper penetration and a flatter, more predictable flight path with every shot.</p>
      <ScrollDownButton target=".specs" label="Lihat Spin Wing Vanes" />
    </section>
  )
}
export default ProductHighlights;