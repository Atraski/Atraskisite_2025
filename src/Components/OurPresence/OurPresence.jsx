import React from "react";
import "./OurPresence.css";
import { assets } from "../../assets/assets";

const OurPresence = () => {
  return (
    <section className="news-section">
      <div className="today">
        <h2>TODAY</h2>
        <p>
          With offices in Delhi, Kolkata, and Mumbai, and a growing team of 70+
          experts across strategy,<br /> creative, production, events, fashion, and
          hospitality — ATRASKI stands as a multidisciplinary <br />creative house,
          where every vertical tells a story, and every story creates lasting
          impact.
        </p>
      </div>
      <div className="ifmt-section">
        <span className="ifmt-image">
          <img src={assets.IFMT} alt="IFMT-image" />
        </span>
        <span className="ifmt-text">
          <a href="#">What's New</a>
          <p><strong>ATRASKI EVENTS </strong> recently executed the IFMT 2025 in Chennai.</p>
        </span>
      </div>
      <div className="card-row">
        {/* Joinus -section */}
        <div className="joinus-card" onClick={() => window.open("https://your-careers-page.com", "_blank")}>
          <h2>JOIN US</h2>
          <p>Explore roles across the ATRASKI verticals.</p>
        </div>
          {/* Baidyanath Partnership */}
        <div className="baidyanath-card" onClick={() => window.location.href = "/news/baidyanath"}>
          <div className="tags">
            <span className="tag">New Business</span>
            <span className="tag">Latest Stories</span>
          </div>
          <div className="headline-section">
            <div className="headline">
              <h3>Baidyanath partners with Atraski to <br /> expand its digital presence</h3>
              <p>The alliance will focus on product marketing, highlighting the brand's diverse product <br /> portfolio while crafting brand narratives to resonate across age groups.</p>
            </div>
            <div className="logo">
              <img src={assets.afaqslogo} alt="Afaqs Logo" className="afaqs-logo" />
            </div>
          </div>
        </div>
      </div>
    

    </section>
               
  );
};

export default OurPresence;
