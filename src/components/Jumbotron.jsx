import React from 'react';

// Jumbotron component definition
function Jumbotron() {
  return (
   
    <div
      className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center text-white text-center relative pt-20"
      style={{ backgroundImage: `url('')` }}
     
    >
   

   
      <div className="relative z-10 max-w-4xl mx-auto p-4">
       
       <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight -mt-4">
  Discover Your Dream Job
</h1>

      
        <p className="text-lg sm:text-xl md:text-2xl mb-8">
          Connecting talented individuals with leading companies worldwide.
        </p>
    
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-xl transition duration-300">
          Browse Jobs
        </button>
      </div>
    </div>
  );
}

export default Jumbotron;
