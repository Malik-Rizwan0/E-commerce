import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import Logo from '../../../assets/logoWhite.png'; // Adjust the path as necessary

function Footer() {
  return (
    <footer className="bg-[#4C4C4C]  text-gray-200 pt-10 pb-6">
      <div className="max-w-screen-xl mx-auto px-6 grid gap-8 md:grid-cols-3">

        {/* ─── Column 1: Brand / About ─────────────────────────── */}
        <div>
          <Link to="/">
            <img src={Logo} alt="Logo" className="h-20 w-auto" />
          </Link>
          <p className="text-sm leading-relaxed mt-2">
            Next-Gen Ecommerce made for seamless shopping
            experiences and lightning-fast delivery 🚀
          </p>

          {/* Social icons */}
          <div className="flex gap-4 mt-4">
            <a href="https://www.facebook.com/malik.muhammad.rizwan.315745" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF className="hover:text-gray-200 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <FaTwitter className="hover:text-gray-200 transition" />
            </a>
            <a href="https://www.instagram.com/ykim_notloyal0/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram className="hover:text-gray-200 transition" />
            </a>
            <a href="https://github.com/Malik-Rizwan0/" target="_blank" rel="noreferrer" aria-label="GitHub">
              <FaGithub className="hover:text-gray-200 transition" />
            </a>
          </div>
        </div>

        {/* ─── Column 2: Quick Links ──────────────────────────── */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/"        className="hover:text-gray-200">Home</Link></li>
            <li><Link to="/products" className="hover:text-gray-200">Products</Link></li>
            <li><Link to="/about"    className="hover:text-gray-200">About</Link></li>
            <li><Link to="/contact"  className="hover:text-gray-200">Contact</Link></li>
          </ul>
        </div>

        {/* ─── Column 3: Contact ──────────────────────────────── */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
          <p className="text-sm">Lahore, Pakistan</p>
          <p className="text-sm">malikrizwan1076@gmail.com</p>
          <p className="text-sm">+92 324 9422392</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-8 border-t border-white pt-4 text-center text-xs">
        &copy; {new Date().getFullYear()} Rizi Ecommerce — All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
