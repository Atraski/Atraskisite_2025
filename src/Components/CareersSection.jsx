import React from "react";
import { assets } from "../assets/assets";

const CareerSection = () => {
  return (
    <section className="careers bg-[#F1F1F1] py-8 px-4 w-full " id="careers">
      <br />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
        {/* Left Column */}
        <div className="flex flex-col space-y-6">
          {/* Offices Section */}
          <article className="bg-white  shadow rounded-lg">
            <img
              src={assets.offices}
              alt="ATRASKI Offices"
              className="w-full h-52 object-cover rounded "
            />

            <h3 className="text-blue-700 font-semibold mt-2 p-2">Offices</h3>
            <br />
            <p className="text-sm text-black pl-3  ">
              ATRASKI operates from Delhi, Kolkata, and Mumbai — three cities,
              one unified vision.
            </p>

            <p className="text-sm text-black pl-3 mt-4">
              Our offices are more than workspaces; they're culture labs.
              Designed to inspire creativity, collaboration, and bold thinking,
              each space brings together a team of 60+ strategists, designers,
              marketers, planners, and creators from across India.
            </p>

            <p className="text-sm text-black pl-3 mt-4 mb-4">
              From pitch to production — wherever you join us, you'll feel the
              energy.
            </p>
          </article>
          {/* PA Section */}
          {/* <br /> */}
          <article className="bg-white p-4 shadow h-[29vh] flex flex-col ">
            <h2 className="text-blue-700 font-medium text-lg pl-0">PA</h2>
            <div className="flex  border-gray-00  pt-3 pl-4">
              <p className="text-sm text-black border-l-2 h-22 pt-5 border-gray-500 pl-4">
                Beware of job scams. We do not charge/accept any amount or
                security deposit from job seekers.
              </p>
            </div>
          </article>
        </div>
        {/* Right Column */}
        <div className="flex flex-col space-y-6 md:col-span-2 gap-21">
          {/* Join Us Banner */}
          <div className="relative rounded-lg h-80 shadow">
            <img
              src={assets.people}
              alt="Join Us Banner"
              className="w-220 h-122 object-cover"
            />
            {/* OPACITY OVERLAYT */}
            <div className="absolute inset-0 bg-black opacity-60 flex items-center justify-center ml-28 mt-28 mr-28">
              <div className="w-[20vw] h-[20vh] flex flex-col items-center justify-center text-center gap-4">
                <h2 className="text-white font-semibold text-3xl mb-2">
                  JOIN US
                </h2>
                <p className="text-white text-sm">
                  Explore roles across the ATRASKI verticals.
                </p>
              </div>
            </div>
          </div>

          {/* Currently Hiring */}
          <div className="bg-white shadow px-8 py-22">
            <h2 className="text-blue-700 text-xl font-normal mb-4">
              Currently Hiring
            </h2>

            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Roles Section */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Marketing & Strategy */}
                <div>
                  <h3 className="text-black font-semibold mb-1">
                    Marketing & Strategy
                  </h3>
                  <ul className="space-y-2 text-sm text-black">
                    <li>• Social Media Manager</li>
                    <li>• Brand Strategist</li>
                    <li>• Influencer Marketing Executive</li>
                    <li>• Performance Marketing Associate</li>
                  </ul>
                </div>

                {/* Events & Operations */}
                <div>
                  <h3 className="text-black font-semibold mb-1">
                    Events & Operations
                  </h3>
                  <ul className="space-y-2 text-sm text-black">
                    <li>• Event Producer</li>
                    <li>• Client Servicing Lead</li>
                    <li>• Ground Activation Manager</li>
                  </ul>
                </div>
              </div>

              {/* Button */}
              <div className="flex justify-start md:items-start md:justify-center">
                <button className="mt-4 md:mt-0 border border-black rounded-full px-6 py-2 text-sm bg-white text-black hover:bg-black hover:text-white transition-colors">
                  VIEW OPEN POSITIONS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </section>
  );
};

export default CareerSection;
