import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Target, Users, Award, Calendar, ChevronRight } from 'lucide-react';
import ImageSlider from '../components/ImageSlider';
import ActivitiesSlider from '../components/ActivitiesSlider';

const Home = () => {
  const [classesList, setClassesList] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setClassesList(data);
      })
      .catch(err => console.error('Error fetching classes:', err));

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) setSettings(data);
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Target': return <Target size={28} />;
      case 'Users': return <Users size={28} />;
      case 'Award': return <Award size={28} />;
      case 'BookOpen':
      default: return <BookOpen size={28} />;
    }
  };

  // Highlights exam keywords in the CTA title with gradient colors
  const gradientKeywords = {
    CTET: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400',
    CUET: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400',
    JEE: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400',
    NEET: 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400',
    CAT: 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400',
    UPSC: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400',
  };

  const renderTitle = (title) => {
    if (!title) return null;
    const keywords = Object.keys(gradientKeywords);
    const regex = new RegExp(`(${keywords.join('|')})`, 'g');
    const parts = title.split(regex);
    return parts.map((part, i) =>
      gradientKeywords[part]
        ? <span key={i} className={gradientKeywords[part]}>{part}</span>
        : part
    );
  };

  return (
    <div className="overflow-x-hidden">

      {/* 1. Admissions Banner (Top) */}
      <div className="bg-white text-slate-900 py-1.5 px-4 relative overflow-hidden border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 w-full">
          <div className="flex items-center justify-between w-full md:w-auto mb-3 md:mb-0 pl-[90px] sm:pl-[140px] pr-2 md:px-0 md:ml-[160px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-red-600"></span>
              </span>
              <span className="bg-red-600 text-white px-2 sm:px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm shrink-0">
                Admissions Open
              </span>
            </div>
            <span className="text-[11px] sm:text-sm md:text-base font-bold tracking-tight text-slate-700 ml-2">
              Classes <span className="text-red-600 font-black">IV to XII</span>
            </span>
          </div>

          <div className="flex justify-between md:gap-6 w-full md:w-auto px-4 md:px-0 items-center text-[11px] sm:text-xs md:text-sm font-bold pb-1 md:pb-0">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar size={14} className="text-red-500 shrink-0" />
              <span className="whitespace-nowrap">Starts: <span className="text-slate-900">15th April</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-orange-600">
              <Clock size={14} className="text-orange-500 shrink-0 animate-pulse" />
              <span className="text-orange-600 font-black uppercase tracking-widest animate-pulse drop-shadow-sm whitespace-nowrap">3 Days Free Demo</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <ImageSlider />

      {/* 3. Special Offers Banner */}
      <section className="bg-amber-100 border-y py-4 border-amber-200 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3">
          <Award className="text-amber-600 animate-pulse" size={28} />
          <p className="text-amber-900 font-bold text-lg md:text-xl">
            Early Bird Offer: <span className="text-red-600">FREE Registration</span> for the first 25 students!
          </p>
          <Award className="text-amber-600 animate-pulse" size={28} />
        </div>
      </section>

      {/* 4. Classes Offered (Grid) */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-sky-100/70 border-y-2 border-slate-200/50 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Classes We Offer</h2>
            <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive coaching tailored for every stage of your child's academic journey.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classesList.length > 0 ? classesList.map((cls, idx) => {
              const colors = [
                { bg: 'bg-blue-100', text: 'text-blue-600', linkHover: 'group-hover:text-blue-700' },
                { bg: 'bg-purple-100', text: 'text-purple-600', linkHover: 'group-hover:text-purple-700' },
                { bg: 'bg-emerald-100', text: 'text-emerald-600', linkHover: 'group-hover:text-emerald-700' },
                { bg: 'bg-amber-100', text: 'text-amber-600', linkHover: 'group-hover:text-amber-700' }
              ];
              const color = colors[idx % colors.length];

              return (
                <div key={cls.id} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className={`w-14 h-14 ${color.bg} rounded-2xl flex items-center justify-center ${color.text} mb-6 group-hover:scale-110 transition-transform`}>
                    {getIcon(cls.icon)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{cls.title}</h3>
                  <p className="text-indigo-600 font-semibold mb-4">{cls.subtitle}</p>
                  <p className="text-gray-600 mb-6 line-clamp-3">{cls.description}</p>
                  <Link to="/courses" className={`inline-flex items-center font-semibold ${color.text} ${color.linkHover}`}>
                    View Details <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            }) : (
              <div className="col-span-3 text-center text-gray-500 py-10">Loading classes...</div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Why Choose Us */}
      <div className="py-24 bg-white border-t border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-indigo-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 opacity-20"></div>
              <img
                src="https://images.pexels.com/photos/5212687/pexels-photo-5212687.jpeg"
                alt="Students studying"
                className="relative z-10 rounded-3xl shadow-2xl object-cover h-[600px] w-full"
              />

              {/* Floating badge */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <Award size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-gray-900">Since 2017</p>
                    <p className="text-sm font-medium text-gray-500">Excellence in Education</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Why Choose <span className="text-indigo-600">Master Mind?</span></h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                We go beyond traditional teaching methods. Our holistic approach ensures that every student gets the attention and resources they need to thrive academically.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Smart AC Classrooms", desc: "Interactive digital boards in fully air-conditioned rooms.", icon: "❄️" },
                  { title: "Soundproof Environment", desc: "Zero distractions for maximum focus and learning.", icon: "🔇" },
                  { title: "Library Access", desc: "Extensive collection of reference books and quiet study areas.", icon: "📚" },
                  { title: "Highly Qualified Faculty", desc: "Learn from experienced educators and subject matter experts.", icon: "🎓" },
                  { title: "Weekly Tests & Analysis", desc: "Regular assessment to track progress and identify weak areas.", icon: "📊" },
                  { title: "Comprehensive Notes", desc: "Well-structured study materials provided for all subjects.", icon: "📝" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl shadow-sm border border-indigo-100">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Our Activities */}
      <div className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-black tracking-widest uppercase text-sm mb-3 block">Life at Master Mind</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Our <span className="text-indigo-600">Activities</span></h2>
            <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Beyond academics — celebrations, events, competitions, and moments that make learning memorable.</p>
          </div>
          <ActivitiesSlider />
        </div>
      </div>

      {/* 7. Competitive Courses & CTA */}
      <section className="relative py-24 bg-slate-900 overflow-hidden text-center z-0 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-red-500 font-black tracking-widest uppercase text-sm mb-4 block">
            {settings.cta_badge || 'Specialized Coaching'}
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            {renderTitle(settings.cta_title || 'Preparing for CTET or CUET')}
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            {settings.cta_description || 'Join our expert-led batches specifically designed to help you crack competitive exams with top percentiles.'}
          </p>
          <div className="flex justify-center">
            <Link to="/courses" className="bg-red-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl hover:shadow-red-500/20 uppercase tracking-widest">
              Explore Courses
            </Link>
          </div>
        </div>

        {/* Subtle Background Elements for Dark Mode */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/5 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </section>

    </div>
  );
};

export default Home;
