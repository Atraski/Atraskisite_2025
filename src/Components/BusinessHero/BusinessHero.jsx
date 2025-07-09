import React from 'react'
import './BusinessHero.css' 
import {assets} from '../../assets/assets'

const BusinessHero = () => {
  return (
  <section className="businesshero-section">
        <img src={assets.BusinessHerobanner} alt="BusinessHero" className="businesshero-image" />
        <div className="businesshero-content">
          <h2>ONE HOUSE, MANY FRONTIERS</h2>
          <p>ATRASKI is not just an agency — it's a multidisciplinary creative house built for brands, creators, and experiences. <br />
          Through our verticals — marketing, events, fashion, and hospitality — we craft solutions that move business, shape culture, <br />
          and create lasting connections.</p>
        </div>
      </section>
  )
}

export default BusinessHero