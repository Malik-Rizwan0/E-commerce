import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaSearch,
  FaRegUserCircle,
} from "react-icons/fa";
import Logo from "../../../assets/logo.png";
import UserOptions from "./UserOptions"; // adjust path if needed
import { useSelector } from "react-redux";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSearchPopup = () => setShowSearchPopup(!showSearchPopup);

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    toggleSearchPopup();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate(`/products`);
    }
  };

  return (
    <header
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } sticky top-0 z-50`}
    >
      <div className="flex items-center justify-between px-3 md:px-10 py-4 max-w-screen-xl mx-auto">
        {/* Left: Logo */}
        <Link to="/">
          <img className="h-10 w-auto md:h-20" src={Logo} alt="Rizi" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-xl hover:font-semibold">
            Home
          </Link>
          <Link to="/products" className="text-xl hover:font-semibold">
            Products
          </Link>
          <Link to="/about" className="text-xl hover:font-semibold">
            About
          </Link>
          <Link to="/contact" className="text-xl hover:font-semibold">
            Contact
          </Link>

          <button onClick={toggleSearchPopup}>
            <FaSearch className="text-xl hover:text-gray-500" />
          </button>

          <div className="left5">
            {user ? (
              <UserOptions user={user} />
            ) : (
              <Link to="/login">
                <FaRegUserCircle className="text-2xl hover:text-gray-500" />
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Right: User + Menu */}
        <div className="flex items-center gap-4 md:hidden">
          {user ? (
            <UserOptions user={user} />
          ) : (
            <Link to="/login">
              <FaRegUserCircle className="text-2xl hover:text-gray-500" />
            </Link>
          )}
          <button className="text-2xl" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div
          className={`md:hidden px-6 pb-4 flex flex-col z-50 gap-4 ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
        >
          <Link to="/" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/products" onClick={toggleMenu}>
            Products
          </Link>
          <Link to="/about" onClick={toggleMenu}>
            About
          </Link>
          <Link to="/about" onClick={toggleSearchPopup}>
            Search
          </Link>
          <Link to="/contact" onClick={toggleMenu}>
            Contact
          </Link>
          
          <button onClick={toggleDarkMode} className="flex items-center gap-2">
            {darkMode ? <FaSun /> : <FaMoon />}{" "}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}

      {/* Search Popup */}
      {showSearchPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center animate-fadeIn">
          <form
            onSubmit={searchSubmitHandler}
            className={`relative rounded-xl shadow-2xl w-11/12 max-w-lg p-6 animate-slideUp ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            <button
              type="button"
              onClick={toggleSearchPopup}
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-red-500 transition"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Search Products
            </h2>
            <input
              type="text"
              placeholder="Type to search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tomato text-black"
            />
            <button
              type="submit"
              className="mt-4 w-full bg-[tomato] text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

export default Header;
