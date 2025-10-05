// src/SignupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email Signup with Verification
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Save user but mark unverified
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        uid: result.user.uid,
        verified: false,
        createdAt: new Date(),
      });

      // Send verification OTP (email link)
      await sendEmailVerification(result.user);

      alert("Verification email sent! Please check your inbox.");

      // Navigate to "check email" page or login
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  // Google Signup
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          verified: true, // Google is already verified
          createdAt: new Date(),
        });
      }
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 space-y-6">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-green-600 text-white py-2 rounded-lg">
            Sign Up
          </button>
        </form>

        <hr />

        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center gap-3 w-full border py-2 rounded-lg"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
