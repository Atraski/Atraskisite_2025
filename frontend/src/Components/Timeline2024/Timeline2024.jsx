import React from 'react'
import './Timeline2024.css'
import {assets} from '../../assets/assets'

const Timeline2024 = () => {
  return (
    <section className='Timeline2024'>
          <img  className="background-img" src={assets.Timeline2024} alt="" />
          <div className='left-para'>
            <h1>2024</h1>
          </div>
          <div className='right-para'>
            <h3>The Expression: ATRASKI FASHIONS Takes Flight</h3>
            <p>As we moved deeper into cultural storytelling, fashion became a natural next frontier. <br /><br />
            Through our growing experience working with fashion and apparel brands across marketing and event platforms, we identified an intrinsic need: brands didn’t just need campaigns — they needed access to models, event precision, and full-scale show management under one roof. <br /><br />
            ATRASKI FASHIONS was launched to meet that demand — specializing in model management, fashion show production, campaign styling, and backstage coordination. <br /><br />
            We merged aesthetic storytelling with operational excellence, delivering fashion experiences that moved beyond the runway to shape brand perception and cultural relevance. <br />
            </p>
           </div>
        </section>
  )
}

export default Timeline2024