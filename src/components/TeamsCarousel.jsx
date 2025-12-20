import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./TeamsCarousel.css";
import teamData from "../assets/data/team.json";
import { useNavigate } from "react-router-dom";

function TeamsCarousel() {
  const navigate = useNavigate();
  // Flatten all team members into one array
  const members = Object.values(teamData).flat();
  return (
    <section className="teams-carousel-section">
      <h2 className="teams-carousel-title">Meet the Team</h2>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="teams-carousel-swiper"
        breakpoints={{
          480: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {members.map((member, idx) => (
          <SwiperSlide key={idx}>
            <div className="teams-carousel-card" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around", gap: "5px" }}>
              <div >
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="teams-carousel-img"
                  />
                ) : (
                  <div className="teams-carousel-img teams-carousel-img-placeholder" />
                )}
              </div>
              <div className="teams-carousel-info">
                <h3 className="teams-carousel-name">{member.name}</h3>
                <p className="teams-carousel-role">{member.role}</p>
                <p className="teams-carousel-team">{member.team}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="teams-carousel-more" onClick={() => navigate("/team")}>
        See More
      </button>
    </section>
  );
}

export default TeamsCarousel;
