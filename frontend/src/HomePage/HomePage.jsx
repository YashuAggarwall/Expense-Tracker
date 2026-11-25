import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
