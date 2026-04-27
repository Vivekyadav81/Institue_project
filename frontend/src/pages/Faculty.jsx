import { User, Award, ImageIcon, ChevronDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Faculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState(null); // { type: 'Qual' | 'Exp', title: string, content: string }

  useEffect(() => {
    fetch('/api/faculty')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFacultyList(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;

  return (
    <div className="pb-12 pt-32 bg-slate-50 relative overflow-x-hidden min-h-screen">
      <div className="absolute top-0 inset-x-0 h-64 bg-indigo-600/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-[0.3em] rounded-full mb-4 border border-indigo-100"
          >
            Mentors for Success
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 mb-6 tracking-tight">Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-indigo-600">Expert Faculty</span></h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Learn from the brightest minds. Our teachers are not just educators, they are mentors who shape careers with decades of collective experience.
          </p>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {Array.isArray(facultyList) && facultyList.map((faculty) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={faculty.id} 
                className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]"
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden bg-slate-50">
                  {faculty.image ? (
                    <div className="w-full h-full transition-transform duration-1000 group-hover:scale-110">
                      <img 
                        src={faculty.image} 
                        alt={faculty.name} 
                        style={{ 
                          transform: `scale(${faculty.zoom || 1}) translate(${faculty.offset_x || 0}%, ${faculty.offset_y || 0}%)`,
                          transformOrigin: 'center center'
                        }}
                        className={`w-full h-full ${faculty.display_mode === 'contain' ? 'object-contain p-6' : 'object-cover'}`}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <ImageIcon size={64} className="text-slate-200" />
                    </div>
                  )}
                  
                  {/* Name Overlay (Premium Dark Gradient) */}
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent">
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none drop-shadow-xl">
                      {faculty.name}
                    </h3>
                  </div>
                </div>
                
                {/* Details Section (Compact & Highlighted) */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Qualification Box */}
                      <div 
                        onClick={() => setSelectedDetail({ 
                          type: 'Qualification', 
                          icon: <Award size={24} />, 
                          color: 'red',
                          content: faculty.qualification,
                          name: faculty.name
                        })}
                        className="relative overflow-hidden bg-gradient-to-br from-red-50 to-white p-3 rounded-2xl border border-red-100/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-red-200"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 bg-red-600 rounded-lg text-white shadow-lg shadow-red-200">
                            <Award size={14} />
                          </div>
                          <span className="text-[8px] font-black text-red-600/60 uppercase tracking-[0.1em]">Qual</span>
                        </div>
                        <p className="text-[11px] font-black text-slate-800 leading-tight truncate">
                          {faculty.qualification || 'N/A'}
                        </p>
                      </div>

                      {/* Experience Box */}
                      <div 
                        onClick={() => setSelectedDetail({ 
                          type: 'Experience', 
                          icon: <User size={24} />, 
                          color: 'indigo',
                          content: `${faculty.experience || 'N/A'} ${faculty.experience && (parseInt(faculty.experience) && !faculty.experience.toLowerCase().includes('year') ? 'Years+' : '')}`,
                          name: faculty.name
                        })}
                        className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white p-3 rounded-2xl border border-indigo-100/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-indigo-200"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200">
                            <User size={14} />
                          </div>
                          <span className="text-[8px] font-black text-indigo-600/60 uppercase tracking-[0.1em]">Exp</span>
                        </div>
                        <p className="text-[11px] font-black text-slate-800 leading-tight truncate">
                          {faculty.experience || 'N/A'} {faculty.experience && (parseInt(faculty.experience) && !faculty.experience.toLowerCase().includes('year') ? 'Yrs+' : '')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="w-full py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-slate-950/20 hover:bg-red-600 hover:shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn">
                      View Profile
                      <ChevronDown size={12} className="-rotate-90 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedDetail && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDetail(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className={`h-2 ${selectedDetail.color === 'red' ? 'bg-red-600' : 'bg-indigo-600'}`} />
                <div className="p-8 sm:p-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 ${selectedDetail.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'} rounded-[1.5rem] shadow-sm`}>
                        {selectedDetail.icon}
                      </div>
                      <div>
                        <span className={`text-xs font-black ${selectedDetail.color === 'red' ? 'text-red-600' : 'text-indigo-600'} uppercase tracking-[0.3em]`}>{selectedDetail.type}</span>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">{selectedDetail.name}</h2>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedDetail(null)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                    <p className="text-slate-700 font-bold leading-relaxed text-lg">
                      {selectedDetail.content || 'Information not available.'}
                    </p>
                  </div>
                  
                  <div className="mt-10">
                    <button 
                      onClick={() => setSelectedDetail(null)}
                      className={`w-full py-4 ${selectedDetail.color === 'red' ? 'bg-red-600 shadow-red-200' : 'bg-indigo-600 shadow-indigo-200'} text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95`}
                    >
                      Got it, thanks
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};


export default Faculty;

