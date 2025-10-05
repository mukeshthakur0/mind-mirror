import React from 'react';
import myimage from '../assets/mentalhealth.png';

function Hero() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-10  min-h-screen">
      
      {/* Left Text */}
      <div className="md:w-1/2 space-y-4 ">
        <h1 className="text-5xl font-comforter ">Mirror Mind</h1>
        <p className="text-gray-700 text-lg font-festive text-white">
          Discover your inner peace by journaling your thoughts. Mirror Mind is your companion
          on the journey to mental clarity and self-awareness.
        </p>
        <button className=" font-festive mt-4 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-purple-300">
          Start Journaling
        </button>
      </div>

    
      <div className="md:w-1/2 mt-10 md:mt-0 relative">
        <div className="w-88 h-88 mx-auto md:ml-auto rounded-[40%] overflow-hidden transform rotate-3 shadow-2xl border-4 border-purple-300">
          <img
            src={myimage}
            alt="Mental Health"
            className="w-full h-full object-cover filter grayscale-0  transition duration-300"
          />
        </div>
      </div>
      
    </div>
  );
}

export default Hero;

