import React from 'react';
import Founder from '../../assets/Careers_Img/Timeline2022.jpg';
import { FaQuoteLeft } from 'react-icons/fa';

const Voices = () => {
  return (
    <section className="w-full bg-[#FFFBEA] py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        
        {/* Left - Founder Image */}
        <div className="w-full md:w-2/5 flex justify-center">
          <img
            src={Founder}
            alt="Founder"
            className="rounded-xl shadow-lg w-[300px] h-auto object-cover"
          />
        </div>

        {/* Right - Quote */}
        <div className="w-full md:w-3/5">
          <div className="text-yellow-600 text-4xl mb-4">
            <FaQuoteLeft />
          </div>
          <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-6">
            “At Atraski, we don’t just build campaigns — we build futures.  
            Our people are our strength, and we’re committed to nurturing every spark of creativity.”
          </p>
          <h3 className="text-xl font-bold text-gray-900">Anish Dhar</h3>
          <p className="text-sm text-gray-600">Founder & CEO, Atraski</p>
        </div>

      </div>
    </section>
  );
};

export default Voices;
