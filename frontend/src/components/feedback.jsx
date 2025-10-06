// src/pages/FeedbackPage.js
import React from "react";

// Sample user feedback data
const feedbacks = [
  {
    name: "John Doe",
    role: "Product Manager",
    comment:
      "MindMirror has really helped me track my daily mood and organize my thoughts efficiently!",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jane Smith",
    role: "Software Engineer",
    comment:
      "The AI Bot feature is incredible! Gives relevant suggestions and insights.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Brown",
    role: "Designer",
    comment:
      "I love the clean design of the app. Everything feels intuitive and easy to use.",
    img: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    name: "Emily Davis",
    role: "Content Creator",
    comment:
      "Mood Analyzer is a game-changer. Helps me understand my mental state better.",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const FeedbackPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          User Feedback
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          See what our users have to say about MindMirror. Their experience
          helps us grow and improve continuously.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {feedbacks.map((f, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
          >
            <img
              src={f.img}
              alt={f.name}
              className="w-20 h-20 rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-900">{f.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{f.role}</p>
            <p className="text-gray-700">{f.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
