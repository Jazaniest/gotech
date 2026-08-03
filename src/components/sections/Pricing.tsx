import './Pricing.css';

const Pricing = () => {
  return (
    <section className="pricing-section">
      <h2 className="pricing-title">Choose Your Arrow</h2>
      <div className="pricing-container">
        <div className="pricing-card">
          <h3>Classic</h3>
          <p className="price">$99</p>
          <p>The perfect arrow for beginners.</p>
          <ul>
            <li>Hand-fletched feathers</li>
            <li>Solid wood shaft</li>
            <li>Includes field points</li>
          </ul>
          <button>Buy Now</button>
        </div>
        <div className="pricing-card">
          <h3>Pro</h3>
          <p className="price">$199</p>
          <p>For the competitive archer.</p>
          <ul>
            <li>All in Classic</li>
            <li>Carbon fiber shaft</li>
            <li>Customizable nocks</li>
          </ul>
          <button>Buy Now</button>
        </div>
        <div className="pricing-card">
          <h3>Gold</h3>
          <p className="price">$299</p>
          <p>The ultimate arrow for performance.</p>
          <ul>
            <li>All in Pro</li>
            <li>Tungsten points</li>
            <li>Lifetime warranty</li>
          </ul>
          <button>Buy Now</button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
