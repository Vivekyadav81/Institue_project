import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper-bundle.css';

// import required modules
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

const ActivitiesSlider = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setActivities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (activities.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-14 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
        <Camera size={36} strokeWidth={1.5} />
        <p className="text-sm font-semibold">No activity photos yet — add some from the admin panel.</p>
      </div>
    );
  }

  // If only 1 or 2 images, just show them normally to avoid weird coverflow looping physics
  if (activities.length <= 2) {
    return (
      <div className={`grid gap-4 ${activities.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {activities.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="relative overflow-hidden rounded-2xl shadow-lg" style={{ height: '320px' }}>
            <img
              src={item.image_url}
              alt={item.caption || `Activity`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    );
  }

  // If there are too few images (less than 6), Swiper's infinite loop breaks on wide screens 
  // because it doesn't have enough elements to fill both sides visually. We double the array perfectly 
  // fix this without the user needing to upload 6 distinct images.
  const displayActivities = activities.length < 6 ? [...activities, ...activities] : activities;

  return (
    <div className="w-full relative pb-12 overflow-hidden flex justify-center">
      <style>{`
        .swiper-pagination-bullet {
          background: #a3b8d2ff;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #4f46e5;
          width: 24px;
          border-radius: 9999px;
        }
        
        @media (max-width: 768px) {
           .activity-slide {
             width: 280px !important;
             height: 280px !important;
           }
        }
      `}</style>

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        initialSlide={Math.floor(displayActivities.length / 2)}
        loop={true}
        speed={800} // Smooth, elegant transition
        coverflowEffect={{
          rotate: 0,
          stretch: -20, // Negative stretch pulls slides closer to center so more can be seen
          depth: 120,   // How far back the side slides sit
          modifier: 2.5, // Strong scale effect exact to the reference image
          slideShadows: false, // Turned off completely to remove all sharp rectangle artifacts
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="w-full"
        style={{ padding: '40px 0' }}
      >
        {displayActivities.map((item, idx) => (
          <SwiperSlide key={`${item.id}-${idx}`} className="activity-slide" style={{ width: '380px', height: '380px' }}>
            <div className="relative w-full h-full">
              {/* Optimized subtle shadow instead of heavy blur filter */}
              <div
                className="absolute inset-2 z-0 opacity-40 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />

              {/* Main Image Container */}
              <div className="relative z-10 w-full h-full rounded-[1.5rem] overflow-hidden bg-slate-900 border border-slate-200/20">
                <img
                  src={item.image_url}
                  alt={item.caption || 'Activity'}
                  className="block w-full h-full object-cover"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ActivitiesSlider;
