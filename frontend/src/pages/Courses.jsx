import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Courses = () => {
  const [coursesList, setCoursesList] = useState([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCoursesList(data);
      })
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-sm">Our <span className="text-indigo-600">Courses</span></h1>
          <p className="text-xl text-gray-600">
            Meticulously designed curriculum to ensure comprehensive learning and excellent results across all grades.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesList.length > 0 ? coursesList.map((course) => {
            const isHex = /^#[0-9A-F]{6}$/i.test(course.color);
            const hexColor = isHex ? course.color : null;
            
            const colors = isHex ? {} : {
              blue: { bg600: 'bg-blue-600', text600: 'text-blue-600', bg50: 'bg-blue-50', text700: 'text-blue-700', border100: 'border-blue-100', text500: 'text-blue-500', hoverBg600: 'hover:bg-blue-600', border200: 'border-blue-200' },
              purple: { bg600: 'bg-purple-600', text600: 'text-purple-600', bg50: 'bg-purple-50', text700: 'text-purple-700', border100: 'border-purple-100', text500: 'text-purple-500', hoverBg600: 'hover:bg-purple-600', border200: 'border-purple-200' },
              emerald: { bg600: 'bg-emerald-600', text600: 'text-emerald-600', bg50: 'bg-emerald-50', text700: 'text-emerald-700', border100: 'border-emerald-100', text500: 'text-emerald-500', hoverBg600: 'hover:bg-emerald-600', border200: 'border-emerald-200' },
              amber: { bg600: 'bg-amber-600', text600: 'text-amber-600', bg50: 'bg-amber-50', text700: 'text-amber-700', border100: 'border-amber-100', text500: 'text-amber-500', hoverBg600: 'hover:bg-amber-600', border200: 'border-amber-200' },
              rose: { bg600: 'bg-rose-600', text600: 'text-rose-600', bg50: 'bg-rose-50', text700: 'text-rose-700', border100: 'border-rose-100', text500: 'text-rose-500', hoverBg600: 'hover:bg-rose-600', border200: 'border-rose-200' },
              indigo: { bg600: 'bg-indigo-600', text600: 'text-indigo-600', bg50: 'bg-indigo-50', text700: 'text-indigo-700', border100: 'border-indigo-100', text500: 'text-indigo-500', hoverBg600: 'hover:bg-indigo-600', border200: 'border-indigo-200' }
            }[course.color || 'blue'] || {};

            const hexToRgba = (hex, alpha) => {
              if(!hex) return '';
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const b = parseInt(hex.slice(5, 7), 16);
              return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };

            const headerStyle = hexColor ? { backgroundColor: hexColor } : {};
            const textStyle = hexColor ? { color: hexColor } : {};
            const badgeStyle = hexColor ? { backgroundColor: hexToRgba(hexColor, 0.1), color: hexColor, borderColor: hexToRgba(hexColor, 0.2) } : {};

            const subjectsArray = (course.subjects || '').split(',').map(s => s.trim()).filter(Boolean);

            const buttonClass = `course-btn-${course.id}`;
            const customStyles = hexColor ? `
              .${buttonClass} {
                background-color: ${hexToRgba(hexColor, 0.05)};
                color: ${hexColor};
                border-color: ${hexToRgba(hexColor, 0.2)};
              }
              .${buttonClass}:hover {
                background-color: ${hexColor};
                color: #ffffff;
              }
            ` : '';

            return (
            <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
              {hexColor && <style>{customStyles}</style>}
              {/* Card Header Colored */}
              <div style={headerStyle} className={`${!hexColor ? colors.bg600 : ''} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                <h3 className="text-2xl font-bold mb-1 relative z-10">{course.name}</h3>
                <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold relative z-10">
                  {course.class_level}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen size={18} style={textStyle} className={!hexColor ? colors.text600 : ''} /> Subjects Covered
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {subjectsArray.map((sub, i) => (
                      <span key={i} style={badgeStyle} className={`px-2 py-1 rounded-md text-xs font-semibold border ${!hexColor ? colors.bg50 + ' ' + colors.text700 + ' ' + colors.border100 : ''}`}>
                        {sub}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3 text-gray-600 text-sm font-medium">
                      <Clock size={18} style={textStyle} className={`${!hexColor ? colors.text500 : ''} mt-0.5`} />
                      <div>
                        <p className="text-gray-900">{course.duration}</p>
                        <p className="text-gray-500">{course.timing}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link to="/register" 
                  className={`mt-auto w-full inline-flex justify-center items-center py-3 px-4 font-bold rounded-xl transition-all shadow-sm border ${!hexColor ? colors.bg50 + ' ' + colors.text700 + ' ' + colors.hoverBg600 + ' hover:text-white ' + colors.border200 : buttonClass}`}>
                  Enroll Now <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
            );
          }) : (
            <div className="col-span-3 text-center text-gray-500 py-10">Loading courses...</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Courses;
