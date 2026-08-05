import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import './Specs.css';
import ScrollDownButton from '../ScrollDownButton';

const specs = [
  { label: 'Vane Count', value: 3, unit: '' },
  { label: 'Helical Angle', value: 3, unit: '°' },
  { label: 'Spin Rate', value: 450, unit: ' rpm' },
  { label: 'Drag Reduction', value: 22, unit: '%' },
];

const Specs = () => {
  useLayoutEffect(() => {
    gsap.utils.toArray<HTMLElement>('.spec-value').forEach((el) => {
      gsap.from(el, {
        textContent: 0,
        duration: 2,
        ease: 'power1.inOut',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      });
    });
  }, []);

  return (
    <section className="specs">
      <h2>Spin Wing Vanes</h2>
      <p>Our unique helical vane design self-stabilizes the arrow mid-flight, drastically reducing drag and maximizing down-range velocity and accuracy.</p>
      <ul>
        {specs.map((spec) => (
          <li key={spec.label}>
            <span>{spec.label}</span>
            <span><span className="spec-value">{spec.value}</span>{spec.unit}</span>
          </li>
        ))}
      </ul>
      <ScrollDownButton target=".nock" label="Lihat The Perfect Nock" />
    </section>
  )
}
export default Specs;