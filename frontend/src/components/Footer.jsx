import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowRight, X } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { POLICIES as policies } from '../constants/policies';


const Footer = () => {
  const [modalContent, setModalContent] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (modalContent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalContent]);



  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "https://www.facebook.com/share/185GfzJX67/", color: "text-[#1877F2]", hoverBg: "hover:bg-[#1877F2]/10" },
    { icon: <Instagram size={20} />, href: "https://www.instagram.com/mastermindclassesmbd?igsh=MTM5aGJjNjRuM3d3aw==", color: "text-[#E4405F]", hoverBg: "hover:bg-[#E4405F]/10" },
    { icon: <Youtube size={20} />, href: "#", color: "text-[#FF0000]", hoverBg: "hover:bg-[#FF0000]/10" },
  ];

  const footerLinks = {
    quickLinks: [
      { name: "About Us", path: "/about" },
      { name: "Our Courses", path: "/courses" },
      { name: "Our Faculty", path: "/faculty" },
      { name: "Register Now", path: "/register" },
      { name: "Contact Us", path: "/contact" },
    ],
    courses: [
      "Class V - VIII",
      "Class IX - X",
      "Class XI - XII (PCM/PCB)",
      "Commerce & Humanities",
      "CTET & CUET Coaching",
    ]
  };

  return (
    <footer className="relative bg-[#05070a] text-white pt-24 pb-12 overflow-hidden border-t border-indigo-500/20">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-indigo-600/10 blur-[100px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CTA Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to transform your future?</h2>
              <p className="text-gray-400 max-w-md">Join Master Mind Classes today and start your journey towards academic excellence with our expert faculty.</p>
            </div>
            <Link
              to="/contact#contact-form"
              className="relative z-10 group bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-1"
            >
              Contact Us
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/20">
                <BookOpen size={28} className="text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight leading-7">
                Master Mind <br />
                <span className="text-xs font-black text-indigo-400 tracking-[0.2em] uppercase">
                  Classes
                </span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              Empowering students through quality education. Our mission is to turn potential into performance with personalized coaching and expert guidance.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800/30 ${social.color} ${social.hoverBg} transition-all border border-gray-700/50 hover:border-current/30 shadow-lg`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-bold mb-8 text-white flex items-center gap-2">
              <span className="w-8 h-px bg-indigo-500"></span>
              Quick Links
            </h3>
            <ul className="space-y-4">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center group">
                    <ArrowRight size={14} className="mr-2 -ml-6 opacity-0 group-hover:ml-0 group-hover:opacity-100 transition-all text-indigo-500" />
                    <span className="footer-link-underline">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses Column */}
          <div>
            <h3 className="text-lg font-bold mb-8 text-white flex items-center gap-2">
              <span className="w-8 h-px bg-indigo-500"></span>
              Our Courses
            </h3>
            <ul className="space-y-4">
              {footerLinks.courses.map((course, index) => (
                <li key={index} className="flex items-center text-gray-400 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 group-hover:bg-indigo-500 mr-3 transition-colors"></div>
                  {course}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-bold mb-8 text-white flex items-center gap-2">
              <span className="w-8 h-px bg-indigo-500"></span>
              Join Us
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Our Location</p>
                  <p className="text-gray-400 leading-relaxed">Family Mart, Near Aryans International School, Buddhi Vihar, Moradabad - 244001</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Phone Number</p>
                  <Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">+91 9058192418 , +91 9058092418</Link>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Email Address</p>
                  <a href="mailto:info@mastermindclassesmbd.com" className="text-gray-400 hover:text-indigo-400 transition-colors">info@mastermindclassesmbd.com</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm">
            &copy; {currentYear} <span className="text-indigo-400 font-semibold">Master Mind Classes</span>. All rights reserved. Developed by <span className="text-indigo-400 font-semibold"> Hatbaliya Technologies. </span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <button onClick={() => setModalContent('privacy')} className="hover:text-indigo-400 transition-colors bg-transparent border-none p-0 cursor-pointer">Privacy Policy</button>
            <button onClick={() => setModalContent('terms')} className="hover:text-indigo-400 transition-colors bg-transparent border-none p-0 cursor-pointer">Terms of Service</button>
            <button onClick={() => setModalContent('cookies')} className="hover:text-indigo-400 transition-colors bg-transparent border-none p-0 cursor-pointer">Cookies</button>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full opacity-50 pointer-events-none"></div>

      {/* Policy Modals */}
      <AnimatePresence>
        {modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f141f] border border-indigo-500/20 rounded-none w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-indigo-500/20 relative z-50 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-indigo-500/20">
                <h2 className="text-2xl font-bold text-white">{policies[modalContent].title}</h2>
                <button
                  onClick={() => setModalContent(null)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {policies[modalContent].content}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
