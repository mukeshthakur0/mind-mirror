import React from "react";
import aibot from "../assets/logo.jpg"; 
import mood from "../assets/moodd.jpg";
import diary from "../assets/diary.png";

function About() {
  const features = [
    { img: diary, title: "Diary", bg: "bg-purple-300" },
    { img: aibot, title: "AI Bot", bg: "bg-pink-300" },
    { img: aibot, title: "Chatbot", bg: "bg-blue-300" },
    { img: mood, title: "Mood Analyzer", bg: "bg-green-300" },
  ];

  return (
    <div className="p-6">
     
      <div className="flex justify-center mb-6">
        <span className="px-6 py-2 text-lg font-medium tracking-wide border border-pink-400 bg-pink-100/20 text-pink-200 rounded-full">
          Features
        </span>
      </div>

      {/* Features Grid */}
      <div className="flex flex-wrap items-center justify-center gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col items-center transition-transform duration-300 hover:scale-105"
          >
            <div
              className={`${f.bg} w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden flex items-center justify-center`}
            >
              <img
                src={f.img}
                alt={f.title}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="mt-3 px-4 py-1 text-sm sm:text-base text-pink-200 border border-pink-400 bg-pink-100/20 rounded-full">
              {f.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
