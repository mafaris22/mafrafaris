  import React, { useState, useEffect, useRef } from 'react';
  import { BrowserRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
  import Jumbotron from '../components/Jumbotron';
  import Navbar from '../components/Navbar';
  import FeatureCard from '../components/Card';
  import Footer from '../components/Footer';
  import LoginModal from '../components/Modal/LoginModal';
  import OriginalJobDetailPage from '../pages/JobDetailPage'; // Your actual JobDetailPage component
  import { AnimatePresence, motion } from 'framer-motion';

  // Wrapper for Job Detail Page to fetch data using URL params and pass it
  function JobDetailPageWrapper({ jobsAll }) {
    const { jobId } = useParams();
    // Ensure jobsAll is an array before trying to find
    const job = Array.isArray(jobsAll) ? jobsAll.find(j => j.id.toString() === jobId) : null;

    if (!Array.isArray(jobsAll) || jobsAll.length === 0 && !job) {
      // This condition means jobsAll is not yet loaded or is empty, and we haven't found a job.
      // It's possible jobs are still loading.
      return (
        <motion.div // Added motion for consistency if you animate routes
          key="jobDetailLoading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center p-10 flex flex-col items-center justify-center min-h-[calc(100vh-5rem-100px)]" // 5rem navbar, ~100px footer
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Loading Job Details...</h2>
          <p className="text-gray-300 mb-6">Please wait a moment.</p>
          {/* Optional: Add a spinner here */}
          <Link to="/" className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
              Back to Job Listings
          </Link>
        </motion.div>
      );
    }

    if (!job) {
      return (
        <motion.div // Added motion
          key="jobDetailNotFound"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center p-10 flex flex-col items-center justify-center min-h-[calc(100vh-5rem-100px)]"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Job Not Found</h2>
          <p className="mb-6 text-gray-300">The job you are looking for does not exist or may have been removed.</p>
          <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
            Back to Job Listings
          </Link>
        </motion.div>
      );
    }
    // Pass the found job to the actual detail page component
    return <OriginalJobDetailPage job={job} />;
  }

  // This component contains the main application logic and structure
  export default function HomePage() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);

    const availablePositionsHeaderRef = useRef(null);
    const location = useLocation(); // Get current location
    const isJobDetailView = location.pathname.startsWith('/jobs/');

    useEffect(() => {
      fetch('/dummyJobs.json') // Make sure dummyJobs.json is in your public folder
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok while fetching jobs.');
          }
          return response.json();
        })
        .then(data => {
          setJobs(data);
          setIsLoadingJobs(false);
          console.log('App.jsx: Jobs loaded successfully');
        })
        .catch(error => {
          console.error('App.jsx: Failed to fetch jobs:', error);
          setIsLoadingJobs(false);
        });
    }, []);

    const openLoginModal = () => {
      if (!isJobDetailView) { // Only open login modal if not on a detail page
        setIsLoginModalOpen(true);
      }
    };

    const closeLoginModal = () => {
      setIsLoginModalOpen(false);
    };

    const handleLoginSuccess = (userData) => {
      console.log('App: handleLoginSuccess called with user:', userData.name);
      setIsAuthenticated(true);
      setCurrentUser(userData);
      // LoginModal might close itself after a delay
    };

    const handleLogout = () => {
      console.log('App: handleLogout called.');
      setIsAuthenticated(false);
      setCurrentUser(null);
      // For a cleaner logout, navigate to home then reload, or just reload.
      window.location.reload();
    };

    const handleSeeJobDetails = (job) => {
      console.log('App: Opening details for job in new tab:', job.title);
      const jobDetailUrl = `/jobs/${job.id}`;
      // Added 'noopener,noreferrer' for security with _blank
      window.open(jobDetailUrl, '_blank', 'noopener,noreferrer');
    };

    return (
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-gray-100 font-inter min-h-screen flex flex-col">
        <Navbar
          onLoginClick={openLoginModal}
          isAuthenticated={isAuthenticated}
          onLogoutClick={handleLogout}
          currentUser={currentUser}
        />

        {/* Wrapper for content below Navbar to apply padding for fixed Navbar */}
        <div className="pt-20 flex-grow flex flex-col"> {/* Added flex-grow and flex-col */}
          <AnimatePresence mode="wait"> {/* 'wait' ensures one component exits before the next enters */}
            <Routes location={location} key={location.pathname}> {/* Pass location and key for AnimatePresence */}
              <Route path="/" element={
                <motion.div // Wrap route element content for animation
                  key="jobListingsPage" // Unique key for AnimatePresence
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex-grow flex flex-col" // Added flex-grow and flex-col
                >
                  {!isJobDetailView && <Jumbotron />} {/* Show Jumbotron only on listings page */}
                  <main className="flex-grow flex flex-col items-center p-4 sm:p-8 pb-16">
                    <header ref={availablePositionsHeaderRef} className="text-center mb-10 max-w-2xl mx-auto">
                      <h1 id="availposition" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                        Available Positions
                      </h1>
                      <p className="text-lg sm:text-xl opacity-90">
                        Find your next career opportunity with us.
                      </p>
                    </header>

                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl w-full mx-auto">
                      {isLoadingJobs ? (
                        <p className="text-center col-span-full">Loading job listings...</p>
                      ) : jobs.length > 0 ? (
                        jobs.map(job => {
                          const cardBackDescription = `${job.description.substring(0, 120)}...\n\nCompany: ${job.company}\nLevel: ${job.level}\nLocation: ${job.location}\nType: ${job.type}\nPosted: ${job.postedDate}`;
                          return (
                            <FeatureCard
                              key={job.id}
                              title={job.title}
                              description={cardBackDescription}
                              icon={job.icon || "💼"} // Default icon
                              onSeeDetailsClick={() => handleSeeJobDetails(job)}
                            />
                          );
                        })
                      ) : (
                        <p className="text-center col-span-full">No job listings available at the moment.</p>
                      )}
                    </section>

                    <div className="mt-12 text-center">
                      <button
                        onClick={() => {
                          console.log('View All Openings button clicked!');
                          // Potentially navigate to a different page or scroll, etc.
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                      >
                        View All Openings
                      </button>
                    </div>
                  </main>
                </motion.div>
              } />
              <Route
                path="/jobs/:jobId"
                element={
                  // JobDetailPageWrapper already includes motion.div if needed for animation
                  <JobDetailPageWrapper jobsAll={jobs} />
                }
              />
            </Routes>
          </AnimatePresence>
        </div>

        <Footer />

        <AnimatePresence>
          {isLoginModalOpen && !isJobDetailView && (
            <LoginModal
              key="loginModal" // Unique key for AnimatePresence
              isOpen={isLoginModalOpen}
              onClose={closeLoginModal}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
