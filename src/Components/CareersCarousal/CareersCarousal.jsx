import { Swiper, SwiperSlide } from "swiper/react";
import  React,{useState} from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";




// Desktop Images
import fakeimg1 from "../../assets/fakeimg1.jpg";
import fakeimg2 from "../../assets/fakeimg2.jpg";
import fakeimg3 from "../../assets/fakeimg3.jpg";
import fakeimg4 from "../../assets/fakeimg4.jpg";


const slides = [
  {
    image: fakeimg1,
    description: "Emerge as a Leader",
    subtext: "Register now with Atraski for Summer Internship Program",
  },
  {
    image: fakeimg2,
    description: "Join Us",
    subtext: "More than 100+ positions available across various domains",
  },
  {
    image: fakeimg3,
    description: "Work at one of the most Creative Place",
    subtext: "Design your Life, Career and our future.",
  },
  {
    image: fakeimg4,
    description: "We are hiring!",
    subtext: "START YOUR CAREER WITH US.",
  },
];

const NavigationMenu = () => {
  const[menu,setMenu]=useState("menu")
  return (
    <section className="relative w-full h-screen">
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
            <div className="relative w-full h-screen">
              {/* Responsive Background Image */}
              <picture>
                <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
                <img
                  src={slide.image}
                  alt={slide.description}
                  className="w-full h-screen object-cover md:object-cover"
                  loading="lazy"
                />
              </picture>

             {/* Overlay content */}
                  <div className="absolute inset-0 flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-24 py-10 z-10">
                    <div className="text-white max-w-xl mt-auto mb-8 md:mt-0 md:mb-0">
                      <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-2">
                        {slide.description}
                      </h2>
                      {/* <hr className="border-white border-1 w-16 sm:w-20 mb-2" /> */}
                      <p className="text-xs sm:text-sm md:text-lg">{slide.subtext}</p>
                    </div>

                  </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default NavigationMenu;
