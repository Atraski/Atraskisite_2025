import { Swiper, SwiperSlide } from "swiper/react";
import { React } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css"; // Core Swiper styles
import "swiper/css/pagination"; // Optional modules
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
    description: "Elevate you fashion brand with ATRASKI FASHION",
    subtext: "From styling and shoots to complete brand management.",
  },
  {
    image: slide4,
    description: "Build events that leave a mark  with ATRASKI EVENTS",
    subtext:
      "From sketches to 3D Design to final fabrication- we handle it all",
  },
];

const NavigationMenu = () => {
  return (
    <section
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url(https://www.tata.com/content/dam/tata/images/homepage/hero-banner.jpg)",
      }}
    >
      {/* Main Content */}
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        // navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop={true}
      // scrollbar={{ draggable: true }}zwzaq
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        className="mySwiper h-screen w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full h-screen bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* overlay */}
              {/* <div className="relative inset-0 bg-black bg-opacity-40 z-10" /> */}
              {/* Content */}
              <div className="absolute inset-0 flex items-center z-200">
                    <div className="  container mx-auto md:px-12 ml-25 p-38 max-w-2xl text-white m-7">
                    <h2 className="text-2xl md:text-2xl font-light mb-4 bg-clip-text text-white">
                        {slide.description}
                    </h2>
                    <hr class="border-white-300 dark:border-white border-2 "></hr>
                    <p className="text-lg md:text-xl ">{slide.subtext}</p>
                    </div>
                    {/* Vertical Menu */}
                    <div className=" absolute right-4 top-1/2 transform -translate-y-1/2 space-y-4 ">
                    <div className="bg-black/70 opacity-70 px-4 py-2 text-white flex items-center justify-between ">
                        <span>Lead Stories</span>
                        {/* <div className="h-px w-6 bg-yellow-500 ml-2"></div> */}
                    </div>
                    <div className="bg-black/70 opacity-70 px-4 py-2 text-white flex items-center justify-between">
                        <span>Social Media</span>
                        {/* <div className="h-px w-6 bg-yellow-500 ml-2"></div> */}
                    </div>
                    <div className="bg-black/70 opacity-70 px-4 py-2 text-white flex items-center justify-between">
                        <span>Heritage</span>
                        {/* <div className="h-px w-6 bg-yellow-500 ml-2"></div> */}
                    </div>
                    <div className="bg-black/70 opacity-70 px-4 py-2 text-white flex items-center justify-between">
                        <span>Careers</span>
                        {/* <div className="h-px w-6 bg-yellow-500 ml-2"></div> */}
                    </div>
                    <div className="bg-black/70 opacity-70 px-4 py-2 text-white flex items-center justify-between">
                        <span>Our Brands</span>
                        {/* <div className="h-px w-6 bg-yellow-500 ml-2"></div> */}
                    </div>
                    </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center max-w-lg">
          <h1 className="text-4xl font-bold mb-4">Let The Games Begin</h1>
          <p className="text-lg mb-6">
            Tata group’s legacy in the promotion of sports endures to this day.
            A photo feature.
          </p>
          <a
            href="#"
            className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-md hover:bg-yellow-600 transition"
          >
            View Photos →
          </a>
        </div>
      </div> */}
    </section>
  );
};

export default NavigationMenu;
