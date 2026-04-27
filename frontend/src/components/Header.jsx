import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState('/logo-transparent.png');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.logo_url) setLogo(data.logo_url);
      })
      .catch(console.error);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>

      {/* Top Utility Bar — marquee visible on all screens, full bar on lg+ */}
      <div className="bg-[#001524] border-b border-white/5 overflow-hidden">
        {/* Mobile: marquee only */}
        <div className="lg:hidden py-2 px-4 flex items-center overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <div className="whitespace-nowrap flex gap-12 text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em] animate-marquee">
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
            </div>
          </div>
        </div>

        {/* Desktop: full bar with social + contact */}
        <div className="hidden lg:flex py-2.5 px-6 items-center justify-between">
          <div className="flex-1 overflow-hidden relative flex items-center h-full max-w-[60%]">
            <div className="whitespace-nowrap flex gap-12 text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em] animate-marquee">
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
              <span>Admission Open for 2026-2025</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 px-8 border-x border-white/10 mx-6 h-6">
            <a href="https://www.facebook.com/share/185GfzJX67/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#1877F2] transition-all transform hover:scale-110">
              <Facebook size={18} />
            </a>
            <a href="https://www.instagram.com/mastermindclassesmbd?igsh=MTM5aGJjNjRuM3d3aw==" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#E4405F] transition-all transform hover:scale-110">
              <Instagram size={18} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#FF0000] transition-all transform hover:scale-110">
              <Youtube size={18} />
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex items-center gap-8">
            <Link to="/contact" className="flex items-center gap-3 text-sm font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap hover:text-white transition-colors">
              <Phone size={16} className="text-red-500" /> +91 9058192418
            </Link>
            <a href="mailto:info@mastermindclassesmbd.com" className="flex items-center gap-3 text-sm font-bold text-slate-300 tracking-widest border-l border-slate-700 pl-8 whitespace-nowrap hover:text-white transition-colors">
              <Mail size={16} className="text-red-500" /> info@mastermindclassesmbd.com
            </a>
          </div>
        </div> {/* end desktop flex bar */}
      </div> {/* end utility bar wrapper */}

      {/* Main Navbar */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 transition-all duration-300 items-center">
            <div className="h-full flex items-center">
              <div
                className="absolute top-0 left-0 h-full w-[220px] md:w-[280px] lg:w-[340px] flex items-center justify-center pr-6 md:pr-10 z-20 overflow-visible transition-all duration-300"
              >
                {/* Slanted background container extracted to prevent clipping children */}
                <div
                  className="absolute inset-0 bg-slate-50 shadow-[5px_0_15px_rgba(0,0,0,0.1)] -z-10"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
                >
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17.32l5-8.66h-10l5 8.66zM10 2.68l-5 8.66h10l-5-8.66z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
                </div>

                <Link to="/" className="relative z-30 flex items-center group h-full py-1">
                  <img
                    src={logo}
                    alt="Master Mind Classes Logo"
                    className="h-full w-auto object-contain transform scale-[1.5] md:scale-[1.6] transition-transform duration-300 drop-shadow-2xl hover:scale-[1.55] md:hover:scale-[1.65]"
                    style={{ maxWidth: 'none' }}
                  />
                </Link>
              </div>
            </div>
            <div className="w-[220px] md:w-[280px] lg:w-[340px] h-full shrink-0 transition-all duration-300"></div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white/90 hover:text-white font-bold transition-all relative group py-2 tracking-wide uppercase text-sm"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              <Link
                to="/register"
                className="bg-white text-red-600 px-7 py-3 rounded-full font-black hover:bg-yellow-50 transition-all transform hover:-translate-y-0.5 shadow-xl uppercase text-sm tracking-widest"
              >
                Register Now
              </Link>
            </nav>

            {/* Mobile Hamburger — z-30 so it renders above the slanted logo box */}
            <div className="lg:hidden flex items-center z-30 relative">
              <button
                onClick={() => setIsOpen(true)}
                className="text-white hover:text-yellow-200 focus:outline-none p-2"
                aria-label="Open menu"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide-In Drawer (fixed overlay, never blocked by slanted logo) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] lg:hidden"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-gradient-to-b from-red-700 to-rose-900 z-[70] flex flex-col shadow-2xl lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <span className="text-white font-black uppercase tracking-widest text-lg">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-yellow-200 p-1 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-5 py-4 text-white font-bold text-base uppercase tracking-wider hover:bg-white/10 rounded-2xl transition-all"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA at bottom of drawer */}
              <div className="px-6 py-6 border-t border-white/10">
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-white text-red-600 px-6 py-4 rounded-2xl font-black shadow-2xl uppercase tracking-widest text-sm hover:bg-yellow-50 transition-all"
                >
                  Register Now
                </Link>
                <div className="flex items-center justify-center gap-6 mt-5">
                  <a href="https://www.facebook.com/share/185GfzJX67/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#1877F2] transition-all">
                    <Facebook size={22} />
                  </a>
                  <a href="https://www.instagram.com/mastermindclassesmbd?igsh=MTM5aGJjNjRuM3d3aw==" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#E4405F] transition-all">
                    <Instagram size={22} />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#FF0000] transition-all">
                    <Youtube size={22} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
