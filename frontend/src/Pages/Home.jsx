import React from 'react'
import Carousal from '../Components/Carousal'
import News from '../Components/News';
import AgencyBanner from "../Components/AgencyBanner";
import Careers from "../Components/CareersSection";
import Collage from '../Components/Collage';
import Footer from '../Components/Footer/Footer';
import Navbar from '../Components/Navbar';


const Home=()=>{
    return(
        <>
         
            <Navbar />
            <Carousal />
            <News />
            <AgencyBanner />
            <Careers />
            <Collage />
            <Footer />
          
        </>
    )
}

export default Home;