import './Pricing.css';

const WHATSAPP_NUMBER = '6281268007639';

const handleOrderClick = (variantName: string) => {
  const message = `Halo, saya ingin bertanya tentang varian ${variantName}.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

const Pricing = () => {
  return (
    <section className="pricing-section">
      <h2 className="pricing-title">Pilih Panah Anda</h2>
      <div className="pricing-container">
        <div className="pricing-card">
          <h3>Pure Carbon</h3>
          <p>Panah yang sempurna untuk pemula.</p>
          <ul>
            <li>Tingkat kelurusan ±0.003"</li>
          </ul>
          <button onClick={() => handleOrderClick('Pure Carbon')}>Beli Sekarang</button>
        </div>
        <div className="pricing-card">
          <h3>Classic</h3>
          <p>Untuk pemanah kompetitif.</p>
          <ul>
            <li>Tingkat kelurusan ±0.001"</li>
          </ul>
          <button onClick={() => handleOrderClick('Classic')}>Beli Sekarang</button>
        </div>
        <div className="pricing-card">
          <h3>Premium</h3>
          <p>Panah terbaik untuk performa.</p>
          <ul>
            <li>Tingkat kelurusan ±0.0001"</li>
          </ul>
          <button onClick={() => handleOrderClick('Premium')}>Beli Sekarang</button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;