import './Hero.css';
import ScrollDownButton from '../ScrollDownButton';

  const Hero = () => {
    return (
      <section className="hero">
        <h1>GOTECH</h1>
        <p>Precision in Motion.</p>
        <ScrollDownButton target=".brand-story" label="Lihat The Carbon Core" />
      </section>
    )
  }
  export default Hero;