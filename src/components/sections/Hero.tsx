import './Hero.css';
import ScrollDownButton from '@/components/ScrollDownButton';

  const Hero = () => {
    return (
      <section className="hero">
        <h1>GOTECH</h1>
        <p>Presisi dalam Gerakan.</p>
        <ScrollDownButton target=".brand-story" duration={5.0} label="Lihat The Carbon Core" />
      </section>
    )
  }
  export default Hero;