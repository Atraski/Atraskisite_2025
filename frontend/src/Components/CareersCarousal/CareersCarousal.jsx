import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import JobSlider from "./JobSlider";

// Images
import img1 from "../../assets/Careers_Img/Slideimage1.png";
import img2 from "../../assets/Careers_Img/slide3.png";
import img3 from "../../assets/Careers_Img/Slideimage4.png";
import img4 from "../../assets/Careers_Img/slide4.png";

const imageSlides = [img1, img2, img3, img4];

const NAV_HEIGHT_PX = 64; // approx navbar height; change if needed

const CareersCarousal = () => {
  return (
    // ✅ Push content below fixed navbar on mobile; desktop unaffected
    <section
      className="relative z-0 flex flex-col md:flex-row w-full h-auto md:h-screen bg-[#facc15] pt-16 md:pt-0"
      style={{ paddingTop: `calc(env(safe-area-inset-top) + ${NAV_HEIGHT_PX}px)` }} // iOS safe-area friendly
    >
      {/* Carousel first on mobile, right on desktop */}
      <div className="order-1 md:order-2 w-full md:w-1/2 flex items-center justify-center py-6 px-2 md:pr-8">
        <div className="w-[92%] max-w-[520px] h-64 sm:h-80 md:h-[500px] overflow-hidden shadow-md rounded-xl bg-black/5">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            pagination={{ clickable: true }}
            className="w-full h-full"
          >
            {imageSlides.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`Career slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Content */}
      <div className="order-2 md:order-1 w-full md:w-1/2 flex items-center justify-center h-full py-8 md:py-0">
        <div className="flex flex-col items-center text-center px-6 md:px-16 max-w-md">
          <div className="self-start text-left">
            <h1 className="w-full max-w-md self-start text-left text-[44px] md:text-[64px] font-extrabold text-black leading-none mb-4">
              <span className="block">BUILD</span>
              <span className="block">SOMETHING.</span>
            </h1>

            <p className="w-full max-w-md self-start text-left text-lg md:text-xl text-gray-600 mb-8">
              Join the mission to revolutionize the world of digital marketing. Explore open positions at ATRASKI.
            </p>


          </div>
          <JobSlider />
          <a href="#all-jobs">
          <button className="mt-6 bg-white text-black font-semibold py-2 px-6 rounded-full hover:bg-black hover:text-white transition-all duration-200">
            View all jobs
          </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CareersCarousal;
