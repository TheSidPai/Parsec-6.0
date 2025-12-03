import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./GalleryCarousel.css";



const placeholderImages = [
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80"
];

function GalleryCarousel() {
  return (
    <section className="gallery-carousel-section">
      <h2 className="gallery-carousel-title">Gallery</h2>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className="gallery-carousel-swiper"
        breakpoints={{
          480: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {placeholderImages.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="gallery-carousel-card">
              <img src={src} alt={`Gallery ${idx + 1}`} className="gallery-carousel-img" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default GalleryCarousel;
