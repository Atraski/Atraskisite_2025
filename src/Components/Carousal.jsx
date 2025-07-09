import { Swiper, SwiperSlide } from "swiper/react";
import  React,{useState} from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";




// Desktop Images
import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";
import slide4 from "../assets/slide4.jpg";

// Mobile Images
import slide1Mobile from "../assets/slide1Mobile.jpg";
import slide2Mobile from "../assets/slide2Mobile.jpg";
import slide3Mobile from "../assets/slide3Mobile.jpg";
import slide4Mobile from "../assets/slide4Mobile.jpg";

const slides = [
  {
    image: slide1,
    mobileImage: slide1Mobile,
    description: "Kick start your marketing goals",
    subtext: "With a strategy that drives results and stays top of mind.",
  },
  {
    image: slide2,
    mobileImage: slide2Mobile,
    description: "Book Your stay at AT STAY",
    subtext: "From the buzz of the city to the calm of the hills- find your perfect escape",
  },
  {
    image: slide3,
    mobileImage: slide3Mobile,
    description: "Elevate your fashion brand with ATRASKI FASHION",
    subtext: "From styling and shoots to complete brand management.",
  },
  {
    image: slide4,
    mobileImage: slide4Mobile,
    description: "Build events that leave a mark with ATRASKI EVENTS",
    subtext: "From sketches to 3D Design to final fabrication — we handle it all",
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
                      <hr className="border-white border-2 w-16 sm:w-20 mb-2" />
                      <p className="text-xs sm:text-sm md:text-lg">{slide.subtext}</p>
                    </div>

                    {/* Vertical Menu (only visible on md+) */}
                    <div className="hidden md:flex flex-col absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2">
                      <ul className="space-y-1">
                        {[
                          { label: "Lead Stories", anchor: "#lead-stories" },
                          { label: "Social Media", anchor: "#social-media" },
                          { label: "Heritage", anchor: "#heritage" },
                          { label: "Careers", anchor: "#careers" },
                          { label: "Our Brands", anchor: "#ourbrands" },
                        ].map((item, index) => (
                          <li key={index}>
                            <a
                              href={item.anchor}
                              onClick={() => setMenu(item.label)}
                              className={`group flex items-center justify-start bg-black/50 hover:bg-black/80 px-2 py-2 text-sm font-medium w-48 transition-all duration-300 relative`}
                            >
                              {/* Yellow line */}
                              <span
                                className={`h-6 w-[2px] bg-yellow-400 transition-all duration-300 ${
                                  menu === item.label ? "scale-y-100" : "scale-y-50"
                                }`}
                              ></span>

                              {/* Label text */}
                              <span
                                className={`
                                  ml-4 text-white transition-all duration-300
                                  opacity-0 group-hover:opacity-100
                                  translate-x-[-10px] group-hover:translate-x-0
                                  pointer-events-none
                                  ${
                                    menu === item.label
                                      ? "opacity-100 translate-x-0 pointer-events-auto"
                                      : ""
                                  }
                                `}
                              >
                                {item.label}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
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
