import './BusinessVerticalsGrid.css';
import { assets } from '../../assets/assets';

const BusinessVerticalsGrid = () => {
  return (
    <section className='businessverticals-section'>
      <div className='main-div'>

        {/* Left Side – 4 Business Cards */}
        <div className='cards'>
          <div className='businessverticals-card' onClick={() => window.location.href = 'https://atbuzz.in'}>
            <h3>360° Marketing Solutions</h3>
            <img src={assets.AtBuzzlogo} alt="AT BUZZ" />
            <a href="https://atbuzz.in" target="_blank" rel="noopener noreferrer">Explore →</a>
          </div>

          <div className='businessverticals-card' onClick={() => window.location.href = 'https://atraskievents.in'}>
            <h3>Experiential Events</h3>
            <img src={assets.AtraskiEventsLogo} alt="Atraski Events" />
            <a href="https://atraskievents.in" target="_blank" rel="noopener noreferrer">Explore →</a>
          </div>

          <div className='businessverticals-card' onClick={() => window.location.href = 'https://atraskifashion.in'}>
            <h3>Fashion Production & Talent</h3>
            <img src={assets.AtraskiFashionLogo} alt="Atraski Fashion" />
            <a href="https://atraskifashion.in" target="_blank" rel="noopener noreferrer">Explore →</a>
          </div>

          <div className='businessverticals-card' onClick={() => window.location.href = 'https://atstay.in'}>
            <h3>Boutique Hospitality</h3>
            <img src={assets.AtStayLogo} alt="AT Stay" />
            <a href="https://atstay.in" target="_blank" rel="noopener noreferrer">Explore →</a>
          </div>
        </div>

        {/* Right Side – News Card */}
        <div className="card-news">
          <a href="#" className="tag">#InTheKnow</a>
          <img src={assets.bonnAd} alt="Bonn Ad" />
          <h4>CURRENT NEWS</h4>
          <p>BONN GROUP has hired AT BUZZ to execute their social media content.</p>
        </div>

      </div>
    </section>
  );
};

export default BusinessVerticalsGrid;
