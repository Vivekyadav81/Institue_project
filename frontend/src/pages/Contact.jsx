import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you.' });
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setStatus({ type: 'error', message: 'Failed to send message.' });
      }
    } catch (error) {
      console.error("Error", error);
      setStatus({ type: 'error', message: 'Unable to reach the server. Please check your internet connection or try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12 pt-32 px-4 sm:px-6 lg:px-8 overflow-x-hidden bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-sm">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our courses or admissions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 bg-indigo-900 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-600 rounded-full opacity-50 blur-3xl mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600 rounded-full opacity-50 blur-3xl mix-blend-screen"></div>

            <h3 className="text-3xl font-bold mb-8 relative z-10">Contact Information</h3>
            <p className="text-indigo-200 mb-12 text-lg relative z-10">
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-8 relative z-10 text-lg">
              <div className="flex items-start gap-4">
                <Phone className="text-indigo-400 mt-1" size={28} />
                <div>
                  <p className="font-semibold mb-1">Phone</p>
                  <p className="text-indigo-100">+91 9058192418</p>
                  <p className="text-indigo-100">+91 9058092418</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-indigo-400 mt-1" size={28} />
                <div>
                  <p className="font-semibold mb-1">Email</p>
                  <p className="text-indigo-100">info@mastermindclassesmbd.com</p>

                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="text-indigo-400 mt-1" size={28} />
                <div>
                  <p className="font-semibold mb-1">Location</p>
                  <p className="text-indigo-100">Family Mart, Near Aryans International School, Buddhi Vihar, Moradabad - 244001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="lg:col-span-3 p-10 lg:p-14">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h3>

            {status.message && (
              <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {status.type === 'success' && <CheckCircle size={24} className="text-green-600" />}
                <p className="font-semibold">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text" name="name" id="name" required
                    value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm bg-gray-50/50"
                    placeholder="Enter Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel" name="phone" id="phone" required
                    value={formData.phone} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm bg-gray-50/50"
                    placeholder="10-digit number"
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message or Inquiry</label>
                <textarea
                  name="message" id="message" rows="5" required
                  value={formData.message} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm bg-gray-50/50 resize-y"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-1 disabled:transform-none disabled:opacity-70 mt-8"
              >
                {loading ? 'Sending...' : (
                  <>Send Message <Send size={20} className="ml-2" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
