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
      <div className="highlight-grid">
        {highlights.map((item) => (
          <div className="highlight-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
export default ProductHighlights;