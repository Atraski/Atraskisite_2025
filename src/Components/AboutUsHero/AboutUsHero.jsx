import React from 'react'
import {assets} from '../../assets/assets'
import './AboutUsHero.css'

const AboutUsHero = () => {
  return (
   <section className="heroabout">
      <img src={assets.buildsomething} alt="ATRASKI Team" className="heroabout-image" />
      <div className="about-box">
        <h2>ABOUT US</h2>
        <p>Founded in 2022, ATRASKI is a full-service creative <br />agency based in India, built to shape culture and <br /> drive business outcomes.</p>
      </div>
    </section>
  )
}

export default AboutUsHero
