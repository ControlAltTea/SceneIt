import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/hero-video.mp4"
        type="video/mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to SceneIt
        </h1>
        <p className="text-lg md:text-2xl mb-6">
          Discover and browse your favorite TV shows and movies
        </p>
        <button className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition">
          Get Started
        </button>
      </div>
    </section>
  );
}
