import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// LoginModal component definition
// Added onLoginSuccess prop
function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch dummy users data on component mount
  useEffect(() => {
    // Reset messages when modal visibility changes (e.g., reopens)
    if (isOpen) {
        setError('');
        setSuccessMessage('');
        // setEmail(''); // Optionally reset fields when modal opens
        // setPassword('');
    }

    fetch('/dummyUsers.json') // Assuming dummyUsers.json is in the public folder
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
      })
      .catch(err => {
        console.error('Failed to fetch dummy users:', err);
        setError('Could not load user data. Please try again later.');
      });
  }, [isOpen]); // Added isOpen to dependencies to reset on reopen

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: "-50vh", // Start from above the screen
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: "0", // Move to its natural position
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
      },
    },
    exit: {
      opacity: 0,
      y: "50vh", // Exit downwards
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!users.length) {
        setError('User data not loaded yet. Please wait or try refreshing.');
        return;
    }

    const user = users.find(u => u.email === email);

    if (user && user.password === password) {
      console.log('Login successful for:', user.name);
      setSuccessMessage(`Welcome, ${user.name}! Login successful.`);
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(user); // Call the callback passed from App.jsx
      }
      setEmail('');
      setPassword('');
      // Modal will be closed by App.jsx after onLoginSuccess updates state
      // Or, can close here after a delay if preferred:
      setTimeout(() => {
         if (isOpen) { // Check if modal is still open before trying to close
            onClose(); // Close the modal
         }
      }, 1500); // Close after 1.5 seconds to allow user to see message
    } else {
      console.log('Login failed: Invalid email or password.');
      setError('Invalid email or password. Please try again.');
    }
  };

  // Function to handle closing the modal via the 'X' button, ensuring messages are cleared
  const handleExplicitClose = () => {
    onClose();
    setError('');
    setSuccessMessage('');
  };


  return (
    // Modal Overlay
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      // onClick={handleClose} // MODIFICATION: Removed onClick from overlay to prevent closing when clicking outside
    >
      {/* Modal Content */}
      <motion.div
        className="bg-gray-800 text-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md"
        variants={modalVariants}
        onClick={e => e.stopPropagation()} // Prevent clicks inside modal from bubbling up (though not strictly needed if overlay doesn't close)
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-400">Login</h2>
          <button
            onClick={handleExplicitClose} // Use the explicit close handler for the 'X' button
            className="text-gray-400 hover:text-gray-200 text-3xl font-light focus:outline-none transition-colors duration-200"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input Group */}
          <div className="mb-5">
            <label htmlFor="email-login" className="block text-gray-300 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email-login"
              name="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 placeholder-gray-500 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>

          {/* Password Input Group */}
          <div className="mb-5">
            <label htmlFor="password-login" className="block text-gray-300 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password-login"
              name="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 placeholder-gray-500 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mb-4 bg-red-900 bg-opacity-30 p-3 rounded-md"
            >
              {error}
            </motion.p>
          )}

          {/* Success Message Display */}
          {successMessage && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-400 text-sm mb-4 bg-green-900 bg-opacity-30 p-3 rounded-md"
            >
              {successMessage}
            </motion.p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!!successMessage}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
                        ${successMessage
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'
                        }`}
          >
            {successMessage ? 'Logged In!' : 'Log In'}
          </button>
        </form>

        {/* Optional: Forgot password / Sign up links */}
        <div className="mt-6 text-center">
          <a href="#" className="inline-block align-baseline font-semibold text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
            Forgot Password?
          </a>
          <p className="text-gray-400 text-sm mt-2">
            Don't have an account? <a href="#" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200">Sign Up</a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default LoginModal;
