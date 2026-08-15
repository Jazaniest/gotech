import './ProductHighlights.css';
import ScrollDownButton from '../ScrollDownButton';

const ProductHighlights = () => {
  return (
    <section className="product-highlights">
      <h2>Stainless Point</h2>
      <p>
        Ujung berbahan stainless steel yang diproses dengan presisi memberikan
        keseimbangan bobot, ketahanan, dan konsistensi yang optimal untuk
        menghasilkan lintasan yang stabil dan akurat di setiap bidikan.
      </p>
      <ScrollDownButton target=".specs" duration={5.0} label="Lihat Spin Wing Vanes" />
    </section>
  )
}

export default ProductHighlights;