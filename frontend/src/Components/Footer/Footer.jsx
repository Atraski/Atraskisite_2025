import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets"; // Assuming logo and icons are in assets
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Logo and About */}
        <div className="footer-column logo-col">
          <Link to="/">
          <img src={assets.logoatraski} alt="Atraski Logo" className="footer-logo" />
          </Link>
          <p className="about-text">
            ATRASKI is an India-based creative agency offering end-to-end solutions across digital marketing,
            event management, fashion marketing, and boutique hospitality. With verticals like AT BUZZ,
            ATRASKI Events, ATRASKI FASHIONS, and AT STAY, we help brands grow through strategic storytelling
            and impactful execution.
          </p>
        </div>

        {/* Contact and Links */}
        <div className="footer-middle">
          <h4>Contact</h4>
           <p><strong>General Email:</strong> <a href="mailto:communications@atraski.com">communications@atraski.com</a></p>
          <p><strong>New Business:</strong> <a href="mailto:business@atraski.com">business@atraski.com</a></p>
          <br />
            <a href="#">Privacy Policy</a> <br />
            <a href="#">Legal Disclaimer</a>
        </div>

        {/* Social & Newsletter */}
        <div className="footer-column social-col">
          <div className="social-icons">
            <a href="https://www.instagram.com/atraskiinspiringindia/?hl=en"><img src={assets.instaicon} alt="Instagram" /></a>
            <a href="https://www.facebook.com/Atraski/"><img src={assets.fbicon} alt="Facebook" /></a>
            <a href="https://www.linkedin.com/company/atraskiofficial/posts/?feedView=all"><img src={assets.linkedInicon} alt="LinkedIn" /></a>
          </div>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your Email ID to book a discovery call" />
            <button type="submit">→</button>
          </form>
        </div>
      </div>
      <p className="copyright">© 2025 Atraski. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
