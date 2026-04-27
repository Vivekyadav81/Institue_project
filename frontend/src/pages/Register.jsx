import { useState, useEffect } from 'react';
import { Send, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { POLICIES as policies } from '../constants/policies';


const Register = () => {
  const competitiveExams = ['CUET', 'CTET'];

  const [formData, setFormData] = useState({
    student_name: '',
    applying_for: '',
    stream: '',
    phone_number: '',
    parent_name: '',
    address: '',
    demo_requested: false,
    registration_type: 'standard',
    accepted_terms: false
  });

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


  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (!formData.accepted_terms) {
      setStatus({ type: 'error', message: 'You must agree to the Terms of Service and Privacy Policy.' });
      setLoading(false);
      return;
    }

    try {
      const isExam = competitiveExams.includes(formData.applying_for);
      const payload = {
        ...formData,
        class: isExam ? '' : formData.applying_for,
        competitive_exam: isExam ? formData.applying_for : '',
      };
      delete payload.applying_for;

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Registration successful! We will contact you soon.' });
        setFormData({
          student_name: '', applying_for: '', stream: '', phone_number: '',
          parent_name: '', address: '', demo_requested: false, registration_type: 'standard',
          accepted_terms: false
        });
      } else {
        setStatus({ type: 'error', message: data.message || 'Registration failed.' });
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setStatus({ type: 'error', message: 'Unable to reach the server. Please check your internet connection or try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden bg-slate-50 min-h-screen">

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-indigo-600 px-8 py-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <h2 className="text-3xl font-extrabold mb-2 relative z-10">Register Now</h2>
            <p className="text-indigo-100 relative z-10">Join Master Mind Classes and secure your child's future.</p>
          </div>

          <div className="p-8 sm:p-12">
            {status.message && (
              <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                 {status.type === 'success' && <CheckCircle size={24} className="text-green-600" />}
                 <p className="font-semibold">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="student_name" className="block text-sm font-bold text-gray-700 mb-2">Student Name *</label>
                  <input
                    type="text" name="student_name" id="student_name" required
                    value={formData.student_name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label htmlFor="parent_name" className="block text-sm font-bold text-gray-700 mb-2">Parent/Guardian Name *</label>
                  <input
                    type="text" name="parent_name" id="parent_name" required
                    value={formData.parent_name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                    placeholder="Enter parent name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                  <label htmlFor="phone_number" className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel" name="phone_number" id="phone_number" required
                    value={formData.phone_number} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                    placeholder="Enter 10-digit number"
                    pattern="[0-9]{10}"
                  />
                </div>
                <div>
                  <label htmlFor="applying_for" className="block text-sm font-bold text-gray-700 mb-2">Applying For</label>
                  <select
                    name="applying_for" id="applying_for"
                    value={formData.applying_for} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm bg-white"
                  >
                    <option value="">Select a class or exam</option>
                    <optgroup label="── School Classes ──">
                      <option value="Class IV">Class IV</option>
                      <option value="Class V">Class V</option>
                      <option value="Class VI">Class VI</option>
                      <option value="Class VII">Class VII</option>
                      <option value="Class VIII">Class VIII</option>
                      <option value="Class IX">Class IX</option>
                      <option value="Class X">Class X</option>
                      <option value="Class XI">Class XI</option>
                      <option value="Class XII">Class XII</option>
                    </optgroup>
                    <optgroup label="── Competitive Exams ──">
                      <option value="CUET">CUET</option>
                      <option value="CTET">CTET</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {(formData.applying_for === 'Class XI' || formData.applying_for === 'Class XII') && (
                <div>
                  <label htmlFor="stream" className="block text-sm font-bold text-gray-700 mb-2">Stream (For Class XI/XII)</label>
                  <select
                    name="stream" id="stream"
                    value={formData.stream} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm bg-white"
                  >
                    <option value="">Select Stream</option>
                    <option value="PCM">Science (PCM)</option>
                    <option value="PCB">Science (PCB)</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Humanities">Humanities</option>
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">Full Address *</label>
                <textarea
                  name="address" id="address" rows="3" required
                  value={formData.address} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                  placeholder="Enter your complete address"
                ></textarea>
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-3">Registration Options</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="registration_free" name="registration_type" type="radio" value="free_first_25"
                      checked={formData.registration_type === 'free_first_25'} onChange={handleChange}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="registration_free" className="ml-3 block text-sm font-medium text-gray-800">
                      Apply for Free Registration <span className="text-amber-600 text-xs font-bold bg-amber-100 px-2 py-0.5 rounded ml-2">Early Bird (First 25)</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="demo_requested" name="demo_requested" type="checkbox"
                      checked={formData.demo_requested} onChange={handleChange}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="demo_requested" className="ml-3 block text-sm font-medium text-gray-800">
                      Book 3 Days Free Demo Class
                    </label>
                  </div>
                </div>
              </div>

              {/* Terms and Privacy Checkbox */}
              <div className="flex items-start gap-3 mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="accepted_terms" name="accepted_terms" type="checkbox" required
                    checked={formData.accepted_terms} onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <label htmlFor="accepted_terms" className="text-sm text-gray-600 leading-tight cursor-pointer select-none">
                  I agree to the{" "}
                  <button 
                    type="button" 
                    onClick={() => setModalContent('terms')}
                    className="text-indigo-600 font-bold hover:underline bg-transparent border-none p-0"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button 
                    type="button" 
                    onClick={() => setModalContent('privacy')}
                    className="text-indigo-600 font-bold hover:underline bg-transparent border-none p-0"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>


              <button
                type="submit" disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
              >
                {loading ? 'Submitting...' : (
                  <>Submit Registration <Send size={20} className="ml-2" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Policy Modals */}
      <AnimatePresence>
        {modalContent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f141f] border border-indigo-500/20 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative z-[110] overflow-hidden"
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
    </div>
  );
};

export default Register;
