import React from 'react';
import Navbar from '../Components/Navbar';
import AboutUsHero from '../Components/AboutUsHero/AboutUsHero';
import OurBelief from '../Components/OurBelief/OurBelief';
import Timeline2022 from '../Components/Timeline2022/Timeline2022';
import Timeline2023 from '../Components/Timeline2023/Timeline2023';
import Timeline2024 from '../Components/Timeline2024/Timeline2024';
import Timeline2025 from '../Components/Timeline2025/Timeline2025';
import OurPresence from '../Components/OurPresence/OurPresence';
import Footer from '../Components/Footer/Footer';



const Aboutus = () => {
  return(
    <>
          <Navbar />
          <AboutUsHero />
          <OurBelief />
          <Timeline2022 />
          <Timeline2023 />
          <Timeline2024 />
          <Timeline2025 />
          <OurPresence />
          <Footer />
      
          
    </>
  ) } 

export default Aboutus;
