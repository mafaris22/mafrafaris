import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/dummyJobs.json')
      .then(res => res.json())
      .then(data => {
        const foundJob = data.find(j => j.id === jobId);
        setJob(foundJob);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading job data:', err);
        setLoading(false);
      });
  }, [jobId]);

  if (loading) {
    return (
      <div className="text-center p-10 text-white">
        <h2 className="text-xl">Loading job details...</h2>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center p-10 text-white">
        <h2 className="text-2xl font-bold mb-4">Job details are not available.</h2>
        <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
          Back to Job Listings
        </Link>
      </div>
    );
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, x: -100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 100 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  };

 return (
    <motion.div
      key="jobDetail"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.4 }}
      className="container mx-auto px-4 py-8 pt-0 md:pt-8 max-w-3xl"
    >
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 bg-opacity-50 shadow-2xl rounded-lg p-6 md:p-10 backdrop-blur-md">
        <div className="mb-6">
          <Link 
            to="/#availposition" 
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300 inline-flex items-center group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Job Listings
          </Link>
        </div>

        <header className="mb-8 border-b border-gray-700 pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{job.title}</h1>
          <p className="text-xl text-blue-300">{job.company}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="bg-gray-700 px-3 py-1 rounded-full text-gray-300">{job.location}</span>
            <span className="bg-green-600 px-3 py-1 rounded-full text-white">{job.type}</span>
            <span className="bg-purple-600 px-3 py-1 rounded-full text-white">{job.level}</span>
          </div>
        </header>

        <section className="prose prose-invert prose-lg max-w-none text-gray-300">
          <h2 className="text-2xl font-semibold text-white border-l-4 border-blue-500 pl-3 mb-4">Job Description</h2>
          <p>{job.description}</p>

          {job.responsibilities?.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-white mt-6 border-l-4 border-blue-500 pl-3 mb-3">Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-1">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </>
          )}

          {job.qualifications?.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-white mt-6 border-l-4 border-blue-500 pl-3 mb-3">Qualifications</h3>
              <ul className="list-disc pl-6 space-y-1">
                {job.qualifications.map((qual, index) => (
                  <li key={index}>{qual}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        <footer className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-500">Posted: {job.postedDate}</p>
          <button
            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300"
            onClick={() => console.log(`Applying for ${job.title}`)}
          >
            Apply Now
          </button>
        </footer>
      </div>
    </motion.div>
  );
}

export default JobDetailPage;