import React from "react";
import { assets } from "../assets/assets";

const Collage = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden" id="ourbrands">
      {/* Desktop/Tablet Background */}
      <img
        src={assets.atbuzzcollage}
        alt="Collage Desktop"
        className="hidden sm:block absolute inset-0 w-full h-full object-cover"
      />

      {/* Mobile Background */}
      <img
        src={assets.atbuzz}
        alt="Collage Mobile"
        className="block sm:hidden absolute inset-0 w-full h-full object-cover"
      />

      {/* Centered Logo (Only for Desktop & Tablet) */}
<div className="absolute inset-0 hidden sm:flex items-center justify-center">
  <div className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 px-4">
    <img
      src={assets.AtBuzzlogo}
      alt="AtBuzz Logo"
      className="w-full h-auto object-contain"
    />
  </div>
</div>

    </div>
  );
};

export default Collage;
