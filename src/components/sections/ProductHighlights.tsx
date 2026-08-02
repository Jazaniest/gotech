import './ProductHighlights.css';

const ProductHighlights = () => {
  // In a real implementation, this would come from a CMS or config
  const highlights = [
    { title: 'Carbon Core', description: 'Unmatched straightness and durability.' },
    { title: 'Aero-Fletch', description: 'Minimized drag for maximum velocity.' },
    { title: 'Tungsten Point', description: 'Superior penetration and accuracy.' },
  ];

  return (
    <section className="product-highlights">
      <div className="highlight-card">
        <h3>Precision Point</h3>
        <p>The aerodynamic tungsten point ensures a stable flight path and unmatched accuracy, hitting the mark every time.</p>
      </div>
    </section>
  )
}
export default ProductHighlights;