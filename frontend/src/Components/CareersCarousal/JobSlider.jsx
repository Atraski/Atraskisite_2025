import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const mockJobs = [
  {
    id: 1,
    title: "Business Development Executive",
    location: "Delhi, Kolkata",
    category: "Marketing",
    description: "Join our marketing team.",
  },
  {
    id: 2,
    title: "MERN Full Stack Developer",
    location: "Delhi",
    category: "Engineering",
    description: "Collaborate to build scalable web apps.",
  },
  {
    id: 3,
    title: "Motion Graphics Designer",
    location: "Mumbai",
    category: "Graphics Design",
    description: "Create stunning motion graphics.",
  },
  {
    id: 4,
    title: "Social Media Manager",
    location: "Remote",
    category: "Marketing",
    description: "Manage our social media presence.",
  },
];

const JobSlider = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-6 shadow-lg w-[320px] min-h-[150px] flex items-center">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        loop={true}
        slidesPerView={1}
      >
        {mockJobs.map((job) => (
          <SwiperSlide key={job.id}>
            <div className="text-left">
              <h3 className="text-lg font-bold text-black mb-2">{job.title}</h3>
              <p className="text-sm text-gray-700 mb-1">📍 {job.location}</p>
              <p className="text-sm text-gray-600 italic">{job.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default JobSlider;
 