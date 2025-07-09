import React ,{useState} from 'react'
import Navbar from '../Components/Navbar'
import CareersCarousal from '../Components/CareersCarousal/CareersCarousal'
import CareerList from '../Components/CareerList/CareerList'
import Filters from "../Components/Filters/Filters"

const Careers = () => {


  return (
    <>
      <Navbar />
      <CareersCarousal />
      
        <header>
          <h1>Careers at ATRASKI</h1>
          <p>Join us in our mission to revolutionize the world of digital marketing and social media management.</p>
          <p>Explore our current job openings and become a part of our dynamic team.</p>
        </header>
        <Filters />
        <CareerList />
      
    </>
  )
}

export default Careers