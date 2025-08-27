import React from 'react'
import './Timeline2022.css'
import {assets} from '../../assets/assets'

const Timeline2022 = () => {
  return (
    <section className='Timeline2022'>
      <img  className="bg-img" src={assets.Timeline2022} alt="" />
      <div className='left-content'>
        <h4>A Journey of Vertical Evolution</h4>
        <h1>2022</h1>
      </div>
      <div className='right-content'>
        <p>Before 2022: ATRASKI started as a creative movement with just 10 people — working behind the scenes across branding, marketing, and experiential projects. Driven by the belief that creativity should live across industries — not just in campaigns — ATRASKI’s foundation was built on passion projects, storytelling, and early collaborations. During this phase, the vision for an integrated, multi-vertical creative house started taking shape.</p>
        <h3>The Strategic Move: AT BUZZ is Formed</h3>
        <h6>As brand demands grew and the need for specialization became clear, we decided to formally launch AT BUZZ — a dedicated 360° marketing vertical under ATRASKI. <br />
        <br />AT BUZZ would lead the way in digital storytelling, influencer marketing, content creation, and performance campaigns — while ATRASKI remained the umbrella for broader creative ambitions. <br /><br />This was the first official step toward building an interconnected creative ecosystem.
        </h6>
       </div>
    </section>
  )
}

export default Timeline2022