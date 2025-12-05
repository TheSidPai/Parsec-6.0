import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./GalleryCarousel.css";

// Import event images
import ABC from "../assets/images/event-images/FinalImages/ABC.webp";
import BAB from "../assets/images/event-images/FinalImages/BAB.webp";
import BAB2 from "../assets/images/event-images/FinalImages/BAB2.webp";
import BAB3 from "../assets/images/event-images/FinalImages/BAB3.webp";
import crowd from "../assets/images/event-images/FinalImages/crowd.webp";
import Event from "../assets/images/event-images/FinalImages/Event.webp";
import Event2 from "../assets/images/event-images/FinalImages/Event2.webp";
import RedAlert from "../assets/images/event-images/FinalImages/RedAlert.webp";
import StandUp from "../assets/images/event-images/FinalImages/StandUp.webp";

const eventImages = [
  ABC,
  BAB,
  BAB2,
  BAB3,
  crowd,
  Event,
  Event2,
  RedAlert,
  StandUp
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
        {eventImages.map((src, idx) => (
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
