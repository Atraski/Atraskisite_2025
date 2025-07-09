import React from 'react'
import './Timeline2025.css'
import {assets} from '../../assets/assets'

const Timeline2025 = () => {
  return (
     <section className='Timeline2025'>
              <img  className="background-image" src={assets.Timeline2025} alt="" />
              <div className='left-box'>
                <h1>2025</h1>
              </div>
              <div className='right-box'>
                <h3>The Immersion: AT STAY is Envisioned</h3>
                <p>
                  After mastering how brands are built and culture is shaped, we asked a deeper question: <br /><br />
                  What if we could shape how people experience the world, too?
                  AT STAY was envisioned — not just as a hospitality vertical, but as a movement to rediscover India’s hidden jewels. <br /><br />
                  Our curated boutique homestays are designed where nature meets humanity — where every space tells a story of culture, community, and belonging. <br /><br />
                  Here, stays are not just bookings — they are invitations to live closer to the earth, to people, and to timeless stories. <br /> <br />
                  Currently in its final stages of development, AT STAY is set to launch soon — opening a new chapter for ATRASKI in creating spaces that inspire, connect, and leave a lasting imprint on the soul. <br />
                </p>
               </div>
            </section>
  )
}

export default Timeline2025