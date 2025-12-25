import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./GalleryCarousel.css";

// Use public folder images for Vercel deployment
const eventImages = [
  "https://parsec-iitdh.github.io/assets/gallery/ABC.webp",
  "https://parsec-iitdh.github.io/assets/gallery/BAB.webp",
  "https://parsec-iitdh.github.io/assets/gallery/BAB2.webp",
  "https://parsec-iitdh.github.io/assets/gallery/BAB3.webp",
  "https://parsec-iitdh.github.io/assets/gallery/crowd.webp",
  "https://parsec-iitdh.github.io/assets/gallery/Event.webp",
  "https://parsec-iitdh.github.io/assets/gallery/Event2.webp",
  "https://parsec-iitdh.github.io/assets/gallery/RedAlert.webp",
  "https://parsec-iitdh.github.io/assets/gallery/StandUp.webp",
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
          1024: { slidesPerView: 3 },
        }}
      >
        {eventImages.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="gallery-carousel-card">
              <img
                src={src}
                alt={`Gallery ${idx + 1}`}
                className="gallery-carousel-img"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default GalleryCarousel;
