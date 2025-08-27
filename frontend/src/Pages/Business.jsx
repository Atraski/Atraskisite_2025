import React from 'react'
import Navbar from '../Components/Navbar'
import BusinessHero from '../Components/BusinessHero/BusinessHero'    
import BusinessVerticalsGrid from '../Components/BusinessVerticalsGrid/BusinessVerticalsGrid'
import Footer from '../Components/Footer/Footer'

const Business = () => {
  return (
    <>
      
      <Navbar />
      <BusinessHero />
      <BusinessVerticalsGrid />
      <Footer />
    </>
  )
}

export default Business