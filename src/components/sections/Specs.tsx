import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import './Specs.css';
import ScrollDownButton from '../ScrollDownButton';

const specs = [
  { label: 'Jumlah Vane', value: 3, unit: '' },
  { label: 'Material', value: 'Plastik', unit: '' },
  { label: 'Profil', value: 'Standar', unit: '' },
  { label: 'Stabilitas', value: 'Optimal', unit: '' },
];

const Specs = () => {
  useLayoutEffect(() => {
    gsap.utils.toArray<HTMLElement>('.spec-value').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      });
    });
  }, []);

  return (
    <section className="specs">
      <h2>Plastic Vanes</h2>

      <p>
        Vane plastik biasa yang ringan dan tahan lama membantu menjaga
        kestabilan anak panah selama penerbangan. Desainnya memberikan
        kontrol arah yang konsisten dan performa yang dapat diandalkan
        pada setiap bidikan.
      </p>

      <ul>
        {specs.map((spec) => (
          <li key={spec.label}>
            <span className="spec-label">{spec.label}</span>
            <span className="spec-value">
              {spec.value}{spec.unit}
            </span>
          </li>
        ))}
      </ul>

      <ScrollDownButton
        target=".nock"
        label="Lihat The Perfect Nock"
      />
    </section>
  );
};

export default Specs;