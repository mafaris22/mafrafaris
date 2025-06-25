import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence for menu

// Navbar component definition
// Accepts isAuthenticated, onLoginClick, onLogoutClick, currentUser
function Navbar({ isAuthenticated, onLoginClick, onLogoutClick, currentUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300";
  const mobileNavLinkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300";

  const buttonClasses = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";
  const logoutButtonClasses = "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50";


  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" }  }
  };


  return (
    <nav className={`w-full text-white p-4 shadow-lg fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out ${
      isScrolled || isMobileMenuOpen ? 'bg-gray-800' : 'bg-transparent'
    }`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-shrink-0">
          <a href="#" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition duration-300">
            YourLogo
          </a>
        </div>

        <div className="flex items-center">
          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className={navLinkClasses}>Home</a>
              <a href="#availposition" className={navLinkClasses}>About</a>
              <a href="#" className={navLinkClasses}>Services</a>
              <a href="#" className={navLinkClasses}>Contact</a>
            </div>

            {isAuthenticated && currentUser && (
              <span className="ml-6 text-sm text-gray-300">
                Hi, {currentUser.name}!
              </span>
            )}

            {isAuthenticated ? (
              <button onClick={onLogoutClick} className={`${logoutButtonClasses} ml-6`}>
                Logout
              </button>
            ) : (
              <button onClick={onLoginClick} className={`${buttonClasses} ml-6`}>
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button (Hamburger Icon) */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden ml-4 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (conditionally rendered based on `isMobileMenuOpen` state) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden overflow-hidden"
            id="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className={mobileNavLinkClasses}>Home</a>
              <a href="#availposition" className={mobileNavLinkClasses}>About</a>
              <a href="#" className={mobileNavLinkClasses}>Services</a>
              <a href="#" className={mobileNavLinkClasses}>Contact</a>

              {isAuthenticated && currentUser && (
                <span className="block px-3 py-2 text-sm text-gray-400">
                  Hi, {currentUser.name}!
                </span>
              )}

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    onLogoutClick();
                    setIsMobileMenuOpen(false); // Close menu on logout
                  }}
                  className={`${logoutButtonClasses} w-full text-left mt-1`}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false); // Close menu on login click
                  }}
                  className={`${buttonClasses} w-full text-left mt-1`}
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
