import React from 'react';
import { Link } from 'react-router-dom';
import homeimage from '../images/homepage.jpeg';

const Home = () => {
  return (
    <div className="bg-neutral-100 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-screen" style={{ backgroundImage: `url(${homeimage})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className='text-white font-semibold mb-4 relative'>!! Static client only version hosted on github pages. Complete code on Github. Please reload only on the home page. !!</div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Your Dream Home Awaits</h1>
          <p className="text-lg mb-6">Find, buy, or rent properties effortlessly</p>
          <div className="flex gap-4">
            <Link to="/homescape-deploy/search" className="bg-blue-500 text-white text-xl py-2 px-4 rounded hover:bg-blue-600 transition">
              View Listings
            </Link>
            <Link to="/homescape-deploy/create-listing" className="bg-green-500 text-white text-xl py-2 px-4 rounded hover:bg-green-600 transition">
              Create Listing
            </Link>
          </div>
        </div>
      </section>

      {/* Introductory Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Welcome to HomeScape</h2>
          <p className="text-lg text-gray-700 mb-6">
          HomeScape is your gateway to a world of real estate opportunities. Whether you're looking to buy, sell, or rent, our platform offers a seamless and efficient experience.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Ready to begin? Click on the buttons above to view our listings or create a new listing.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-8 bg-stone-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 ml-4">How It Works</h2>
          <div className="flex flex-col items-center mr-4">
            <div className="w-full max-w-lg">
              <div className="relative">
                <div className="absolute left-0 top-0 w-0.5 bg-blue-500 h-[calc(100%-6rem)]"></div>
                <div className="flex items-start mb-8 relative">
                  <div className="absolute -left-4 top-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold">1</div>
                  <div className="ml-8 p-6 bg-white rounded-xl shadow-lg w-full">
                    <h3 className="text-2xl font-bold mb-2">Browse Listings</h3>
                    <p className="text-gray-600">Explore a wide range of properties that meet your criteria.</p>
                  </div>
                </div>
                <div className="flex items-start mb-8 relative">
                  <div className="absolute -left-4 top-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold">2</div>
                  <div className="ml-8 p-6 bg-white rounded-xl shadow-lg w-full">
                    <h3 className="text-2xl font-bold mb-2">Contact Sellers</h3>
                    <p className="text-gray-600">Get in touch with property owners and schedule visits.</p>
                  </div>
                </div>
                <div className="flex items-start relative">
                  <div className="absolute -left-4 top-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold">3</div>
                  <div className="ml-8 p-6 bg-white rounded-xl shadow-lg w-full">
                    <h3 className="text-2xl font-bold mb-2">Finalize Deal</h3>
                    <p className="text-gray-600">Complete the transaction and move into your new home.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
