import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultSlides = [
  {
    id: 1,
    image_url: "/slider1.png",
    title: "Turning Potential Into Performance",
    subtitle: "Empowering students with expert faculty, smart classrooms, and personalized attention."
  },
  {
    id: 2,
    image_url: "/slider2.png",
    title: "Expert Faculty & Smart Classrooms",
    subtitle: "Learn in fully air-conditioned smart classrooms with experienced educators."
  }
];

const ImageSlider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/slides');
        const data = await response.json();
        if (data.length > 0) {
          setSlides(data);
        } else {
          setSlides(defaultSlides);
        }
      } catch (error) {
        console.error('Error fetching slides:', error);
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  if (loading) return <div className="h-[600px] bg-gray-900 flex items-center justify-center text-white">Loading Slider...</div>;

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-gray-900 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image_url}
            alt="Slider Background"
            className="w-full h-full object-cover transition-all duration-1000"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex items-center gap-2 mb-6"
                >
                  <span className="h-0.5 w-12 bg-indigo-500 rounded-full"></span>
                  <span className="text-indigo-400 text-sm md:text-base font-bold tracking-[0.2em] uppercase drop-shadow-sm">
                    Premium Coaching Institute
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-white drop-shadow-2xl"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500">{slides[current].title}</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                  className="text-lg md:text-2xl text-gray-200 mb-12 max-w-2xl leading-relaxed font-medium drop-shadow-md"
                >
                  {slides[current].subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                  className="flex flex-col sm:flex-row gap-5"
                >
                  <Link to="/register" className="group relative inline-flex justify-center items-center px-10 py-4.5 text-lg font-extrabold rounded-full text-white overflow-hidden transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-indigo-500/20">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 group-hover:scale-105 transition-transform duration-500"></span>
                    <span className="relative flex items-center gap-2">
                      Join Today <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={22} />
                    </span>
                  </Link>
                  <Link to="/contact" className="inline-flex justify-center items-center px-10 py-4.5 text-lg font-extrabold rounded-full text-white bg-white/10 border border-white/30 backdrop-blur-md hover:bg-white/20 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg">
                    Book Trial Class
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${current === index ? "bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/40 hover:bg-white/60"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
