import React from 'react'
import './Timeline2023.css'
import {assets} from '../../assets/assets'

const Timeline2023 = () => {
  return (
    <section className='Timeline2023'>
          <img  className="bg-img" src={assets.Timeline2023} alt="" />
          <div className='left-text'>
            <h1>2023</h1>
          </div>
          <div className='right-text'>
              <h3>The Expansion: ATRASKI Events is Launched</h3>
              <p>Brands no longer wanted just digital touchpoints — they sought real-world experiences that could be felt, remembered, and shared. <br /><br />ATRASKI Events was born to meet that demand — crafting brand activations, corporate expos, cultural events, and immersive brand showcases across industries. <br /><br />Every experience was designed end-to-end:<br />From initial brainstorming sessions on paper, to 3D conceptualization, to full-stage fabrication and on-ground execution — ensuring that every touchpoint was built with creative precision and experiential impact.<br /><br />This year also marked our expansion to Kolkata, where we blended digital storytelling with on-ground narratives to create truly cohesive brand journeys.
              </p>
           </div>
        </section>
  )
}

export default Timeline2023