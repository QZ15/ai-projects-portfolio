// src/pages/HomePage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Slider } from "@mui/material";
import "../styles/global.css";

const Header: React.FC = () => {
  return (
    <header className="container mx-auto flex items-center justify-between py-4 border-b border-gray-300">
      <div className="flex items-center">
        <Link to="/">
          <img src="/images/logo.png" alt="Ceramic Glaze Logo" className="h-20 w-20" />
        </Link>
      </div>
      <nav className="flex-1 flex justify-center space-x-8">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/slip-creator" className="hover:underline">
          Slip Creator
        </Link>
        <Link to="/glaze-creator" className="hover:underline">
          Glaze Creator
        </Link>
        <Link to="/library" className="hover:underline">
          Library
        </Link>
      </nav>
      <div className="space-x-4">
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link to="/register" className="hover:underline">
          Register
        </Link>
      </div>
    </header>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-210 overflow-hidden">
      <div className="absolute top-15 left-1/2 transform -translate-x-1/2 text-center" style={{ fontFamily: '"Nunito", sans-serif' }}>
        <p className="mb-6 text-3xl text-black">
          Elevate your ceramic creativity with your own AI-powered Glaze and Slip designer.
        </p>
      </div>
      <img
        src="/images/hero.png"
        alt="Hero Slide"
        className="absolute top-30 w-full h-140 object-cover"
      />
      <div className="absolute bottom-25 left-1/2 transform -translate-x-1/2 text-center">
        <Link
          to="/glaze-creator"
          className="bg-neutral-700 text-white px-6 py-3 rounded-md hover:bg-neutral-500 transition-colors"
        >
          Try Creator Today
        </Link>
      </div>
    </section>
  );
};

const DemoSlipCreator: React.FC = () => {
    // Sample ingredient data for slip
    const ingredients = [
      { name: "Clay", value: 40 },
      { name: "Water", value: 30 },
      { name: "Additive", value: 30 }
    ];
  
    return (
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-sans text-center mb-8">Demo Slip Creator</h2>
        <div className="flex flex-col items-center">
          <img
            src="/images/demoSlip.png"
            alt="Demo Slip Output"
            className="w-140 rounded-md shadow-md mb-8"
          />
          <div className="w-full max-w-lg space-y-6">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="w-24 text-right">{ingredient.name}:</span>
                <Slider
                    defaultValue={ingredient.value}
                    aria-label={ingredient.name}
                    valueLabelDisplay="auto"
                    sx={{
                        color: "#404040", // sets the slider's color to neutral-700 (#374151)
                        '& .MuiSlider-thumb': {
                        borderColor: "#404040",
                        },
                        '& .MuiSlider-track': {
                        backgroundColor: "#404040",
                        },
                        '& .MuiSlider-rail': {
                        opacity: 0.5,
                        },
                    }}
                />
                <input
                  type="text"
                  value={`${ingredient.value}%`}
                  readOnly
                  className="w-16 text-center border border-gray-300 rounded-md p-1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

const DemoGlazeCreator: React.FC = () => {
    // Sample ingredient data for glaze
    const ingredients = [
      { name: "Silica", value: 30 },
      { name: "Alumina", value: 20 },
      { name: "Feldspar", value: 50 }
    ];
  
    return (
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-sans text-center mb-8">Demo Glaze Creator</h2>
        <div className="flex flex-col items-center">
          <img
            src="/images/demoGlaze.png"
            alt="Demo Glaze Output"
            className="w-140 rounded-md shadow-md mb-8"
          />
          <div className="w-full max-w-lg space-y-6">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="w-24 text-right">{ingredient.name}:</span>
                <Slider
                    defaultValue={ingredient.value}
                    aria-label={ingredient.name}
                    valueLabelDisplay="auto"
                    sx={{
                        color: "#404040", // sets the slider's color to neutral-700 (#374151)
                        '& .MuiSlider-thumb': {
                        borderColor: "#404040",
                        },
                        '& .MuiSlider-track': {
                        backgroundColor: "#404040",
                        },
                        '& .MuiSlider-rail': {
                        opacity: 0.5,
                        },
                    }}
                />
                <input
                  type="text"
                  value={`${ingredient.value}%`}
                  readOnly
                  className="w-16 text-center border border-gray-300 rounded-md p-1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
// Combined demo creator section: Slip first, then Glaze (side-by-side on larger screens)
const DemoCreators: React.FC = () => {
    return (
      <section className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <DemoSlipCreator />
          <DemoGlazeCreator />
        </div>
      </section>
    );
  };

interface ExploreSectionProps {
    title: string;
    placeholderPrefix: string;
  }
  
  const ExploreSection: React.FC<ExploreSectionProps> = ({ title }) => {
    return (
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-sans text-center mb-8">{title}</h2>
        <div className="overflow-x-visible">
          <div className="flex justify-center space-x-6 px-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="min-w-[250px] bg-white border border-gray-200 rounded-md shadow-md p-4 transform transition-transform duration-200 hover:scale-105"
            >
              <img
                src="/images/placeholder.png"
                alt="Placeholder Image"
                className="rounded-md mb-2 mx-auto"
              />
              <p className="text-center">Recipe {i}</p>
            </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col w-full h-fit bg-neutral-700 text-white px-14 py-14">
      <div className="flex flex-row">
        <div className="flex flex-col gap-2 justify-center w-[35%]">
          <div className="flex items-center w-full gap-4">
            <img
              alt="Logo Preview"
              src="/images/logo.png"
              width="120"
            />
            <div className="text-5xl">Glaze Me Ceramics</div>
          </div>
          <div className="grid grid-cols-3 gap-6 mx-auto p-4">
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-row w-[65%] justify-end gap-16 text-nowrap">
          <div className="grid grid-cols-3 gap-24">
            <div className="flex flex-col gap-2">
              <div className="font-bold uppercase text-[#9ca3af] pb-3">Explore</div>
              <a href="#xxx" className="hover:underline">Features</a>
              <a href="#xxx" className="hover:underline">Docs</a>
              <a href="#xxx" className="hover:underline">Pricing</a>
              <a href="#xxx" className="hover:underline">Security</a>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-bold uppercase text-[#9ca3af] pb-3">Company</div>
              <a href="#xxx" className="hover:underline">About Us</a>
              <a href="#xxx" className="hover:underline">Contact</a>
              <a href="#xxx" className="hover:underline">Support</a>
              <a href="#xxx" className="hover:underline">News</a>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-bold uppercase text-[#9ca3af] pb-3">Legal</div>
              <a href="#xxx" className="hover:underline">Imprint</a>
              <a href="#xxx" className="hover:underline">Privacy Policy</a>
              <a href="#xxx" className="hover:underline">Terms of Use</a>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-bold uppercase text-[#9ca3af] pb-3">Newsletter</div>
            <p className="text-[#e5e7eb] mb-2">Subscribe to our newsletter.</p>
            <form className="flex items-center">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full bg-gray-100 text-gray-700 rounded-l-lg py-3 px-4 focus:outline-hidden focus:ring-purple-600 focus:border-transparent"
                autoComplete="off"
                required
              />
              <button
                type="submit"
                className="bg-[#757575] text-[#ffffff] font-semibold py-3 px-6 rounded-r-lg transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="w-full border-t border-gray-500 my-8"></div>
      <div className="text-center">© 2025 Your Companys - All rights reserved.</div>
    </footer>
  );
};

const HomePage: React.FC = () => {
  return (
    <div className="bg-white text-gray-900">
      <Header />
      <HeroSection />
      <DemoCreators />
      <ExploreSection title="Explore Glazes" placeholderPrefix="Glaze" />
      <ExploreSection title="Explore Slips" placeholderPrefix="Slip" />
      <Footer />
    </div>
  );
};

export default HomePage;
