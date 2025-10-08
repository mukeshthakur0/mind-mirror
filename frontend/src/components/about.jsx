import React from "react";
import aibot from "../assets/logo.jpg"; 
import mood from "../assets/moodd.jpg";
import diary from "../assets/diary.png";

function About() {
  const features = [
    { img: diary, title: "Diary", bg: "bg-gray-200" },
    { img: aibot, title: "AI Bot", bg: "bg-gray-200" },
    { img: aibot, title: "Chatbot", bg: "bg-gray-200" },
    { img: mood, title: "Mood Analyzer", bg: "bg-gray-200" },
  ];

  return (
    <div className="p-6 md:p-12 bg-gray-50 w-full">
      {/* Section Title */}
      <div className="flex justify-center mb-8">
        <span className="px-6 py-2 text-lg md:text-xl font-semibold tracking-wide border border-gray-300 bg-gray-100 text-gray-800 rounded-full">
          Features
        </span>
      </div>

      {/* Features Grid */}
      <div className="flex flex-wrap justify-center gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col items-center transition-transform duration-300 hover:scale-105"
          >
            <div
              className={`${f.bg} w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden flex items-center justify-center shadow-md`}
            >
              <img
                src={f.img}
                alt={f.title}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="mt-4 px-4 py-1 text-sm sm:text-base md:text-lg text-gray-800 border border-gray-300 bg-gray-100 rounded-full">
              {f.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
