import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const CareerSection = () => {
  return (
    <section className="careers bg-[#F1F1F1] py-12 px-4 w-full" id="careers">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
        {/* Left Column */}
        <div className="flex flex-col space-y-6">
          {/* Offices Section */}
          <article className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={assets.offices}
              alt="ATRASKI Offices"
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <h3 className="text-blue-700 font-semibold text-lg">📍 Offices</h3>
              <p className="text-sm text-gray-800 mt-2">
                ATRASKI operates from Delhi, Kolkata, and Mumbai — three cities, one unified vision.
              </p>
              <p className="text-sm text-gray-800 mt-4">
                Our offices are more than workspaces; they're culture labs.
                Designed to inspire creativity, collaboration, and bold thinking,
                each space brings together a team of 60+ strategists, designers,
                marketers, planners, and creators from across India.
              </p>
              <p className="text-sm text-gray-800 mt-4">
                From pitch to production — wherever you join us, you'll feel the energy.
              </p>
            </div>
          </article>

          {/* PA Section */}
          <article className="bg-white p-4 shadow-md rounded-lg flex flex-col justify-center h-[29vh]">
            <h2 className="text-blue-700 font-semibold text-lg">⚠️ PA</h2>
            <div className="pt-3">
              <p className="text-sm text-gray-800 border-l-4 border-gray-400 pl-4">
                Beware of job scams. We do not charge/accept any amount or security deposit from job seekers.
              </p>
            </div>
          </article>
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-6 md:col-span-2">
          {/* Join Us Banner */}
          <div className="relative rounded-lg h-80 shadow-md overflow-hidden">
            <img
              src={assets.people}
              alt="Join Us Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center">
              <div className="text-white space-y-2">
                <h2 className="text-3xl font-bold tracking-wide">JOIN US</h2>
                <p className="text-sm">Explore roles across the ATRASKI verticals.</p>
              </div>
            </div>
          </div>

          {/* Currently Hiring */}
          <div className="bg-white shadow-md rounded-lg px-8 py-10">
            <h2 className="text-blue-700 text-2xl font-semibold mb-6">
              Currently Hiring
            </h2>

            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Roles */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Marketing & Strategy */}
                <div>
                  <h3 className="text-gray-900 font-semibold mb-2">
                    Marketing & Strategy
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Social Media Manager</li>
                    <li>• Brand Strategist</li>
                    <li>• Influencer Marketing Executive</li>
                    <li>• Performance Marketing Associate</li>
                  </ul>
                </div>

                {/* Events & Operations */}
                <div>
                  <h3 className="text-gray-900 font-semibold mb-2">
                    Events & Operations
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Event Producer</li>
                    <li>• Client Servicing Lead</li>
                    <li>• Ground Activation Manager</li>
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex items-center justify-center md:justify-end">
                <Link to="/careers#all-jobs">
                <button className="border border-black rounded-full px-6 py-2 text-sm bg-white text-black hover:bg-black hover:text-white transition">
                  VIEW OPEN POSITIONS
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerSection;
