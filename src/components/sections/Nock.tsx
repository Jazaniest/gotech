import './Nock.css';
import ScrollDownButton from '@/components/ScrollDownButton';

const Nock = () => {
  return (
    <section className="nock">
      <h2>Nock Sempurna</h2>
      <p>Koneksi tanpa cacat antara pemanah dan anak panah. Desain nock kami memastikan pelepasan yang konsisten dan bersih untuk setiap bidikan.</p>
      <ScrollDownButton target=".gallery" duration={5.0} label="Lihat galeri produk" />
    </section>
  )
}
export default Nock;
