import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./GalleryCarousel.css";
import abcImg from "../assets/images/event-images/FinalImages/ABC.webp";
import babImg1 from "../assets/images/event-images/FinalImages/BAB.webp";
import babImg2 from "../assets/images/event-images/FinalImages/BAB2.webp";
import babImg3 from "../assets/images/event-images/FinalImages/BAB3.webp";
import crowd from "../assets/images/event-images/FinalImages/crowd.webp";
import event1 from "../assets/images/event-images/FinalImages/Event.webp";
import event2 from "../assets/images/event-images/FinalImages/Event2.webp";
import redAlert from "../assets/images/event-images/FinalImages/RedAlert.webp";
import standUp from "../assets/images/event-images/FinalImages/StandUp.webp";

// Use public folder images for Vercel deployment
const eventImages = [
  abcImg,
  babImg1,
  babImg2,
  babImg3,
  crowd,
  event1,
  event2,
  redAlert,
  standUp,
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
