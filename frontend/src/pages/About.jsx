import { Target, Lightbulb, TrendingUp, ShieldCheck } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Header */}
      <div className="relative text-white pt-24 pb-52 text-center overflow-hidden bg-gray-900">
        <img
          src="https://images.pexels.com/photos/5212331/pexels-photo-5212331.jpeg"
          alt="Classroom"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold mb-6"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">xyzclasses</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-indigo-100">
            Shaping the future of students since 2017 with unyielding dedication to academic excellence and holistic development.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">

        {/* Intro */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-indigo-600 pl-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Established in 2017, xyzclasses was founded with a singular vision: to turn every student's potential into performance.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium">
                We believe that education is not just about scoring marks, but about developing a deep understanding of concepts and cultivating a lifelong love for learning. Our expert faculty and smart infrastructure create the perfect ecosystem for success.
              </p>
            </div>
            <div>
              <img src="https://images.pexels.com/photos/12125962/pexels-photo-12125962.jpeg" alt="Classroom" className="rounded-2xl shadow-lg w-full h-80 object-cover" />
            </div>
          </div>
        </div>

  {/* Mission & Vision */}
  <div className="grid md:grid-cols-2 gap-8 mb-16 bg-slate-100 p-8 rounded-3xl border border-slate-200/60">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-blue-50 shadow-sm">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
              <Target size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To provide accessible, high-quality education that empowers students to achieve their academic goals and excel in competitive environments. We strive to foster critical thinking and intellectual curiosity.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-emerald-50 shadow-sm">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
              <Lightbulb size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To be recognized as the premier educational institute that consistently delivers outstanding results and shapes the visionary leaders and innovators of tomorrow.
            </p>
          </div>
        </div>

  {/* Core Values */}
  <div className="bg-sky-100/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 border-y-2 border-sky-200/40">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: <TrendingUp size={28} />, title: 'Excellence', desc: 'Striving for the best in every endeavor.' },
              { icon: <ShieldCheck size={28} />, title: 'Integrity', desc: 'Upholding honesty and ethical standards.' },
              { icon: <Target size={28} />, title: 'Focus', desc: 'Dedicated attention to student progress.' },
              { icon: <Lightbulb size={28} />, title: 'Innovation', desc: 'Smart teaching methodolgies.' },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default About;
