import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";
import slide4 from "../assets/slide4.png";

const slides = [
  {
    image: slide1,
    description: "Kick start your marketing goals",
    subtext: "With a strategy that drives results and stays top of mind.",
  },
  {
    image: slide2,
    description: "Book Your stay at AT STAY",
    subtext:
      "From the buzz of the city to the calm of the hills- find your perfect escape",
  },
  {
    image: slide3,
    description: "Elevate your fashion brand with ATRASKI FASHION",
    subtext: "From styling and shoots to complete brand management.",
  },
  {
    image: slide4,
    description: "Build events that leave a mark with ATRASKI EVENTS",
    subtext:
      "From sketches to 3D Design to final fabrication- we handle it all",
  },
];

function Herosection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop={true}
        className="h-screen w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full h-screen bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              {/* <div className="absolute inset-0 bg-black bg-opacity-40 z-10" /> */}

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-start z-20">
                <div className="ml-20 md:ml-36 max-w-xl text-white space-y-4 px-6">
                  <h2 className="text-2xl md:text-3xl font-light">
                    {slide.description}
                  </h2>
                  <hr className="border-white border-2 w-20" />
                  <p className="text-lg md:text-xl">{slide.subtext}</p>
                </div>
              </div>
              {/* Vertical Menu */}
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Herosection;
