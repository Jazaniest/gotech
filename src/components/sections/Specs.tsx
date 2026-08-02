import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import './Specs.css';

const Specs = () => {
  useLayoutEffect(() => {
    gsap.utils.toArray('.spec-value').forEach((el: any) => {
      gsap.from(el, {
        textContent: 0,
        duration: 2,
        ease: "power1.inOut",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        }
      });
    });
  }, []);

  return (
    <section className="specs">
      <h2>Spin Wing Vanes</h2>
      <p>Our unique helical vane design self-stabilizes the arrow mid-flight, drastically reducing drag and maximizing down-range velocity and accuracy.</p>
    </section>
  )
}
export default Specs;