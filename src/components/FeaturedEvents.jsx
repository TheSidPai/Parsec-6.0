import React from "react";
import { Link } from "react-router-dom";
import "./FeaturedEvents.css";

const FeaturedEvents = () => {
  const events = [
    {
      id: "aurora-2",
      title: "Aurora 2.0: Beyond the Horizon",
      category: "Hackathon",
      description:
        "A multidisciplinary hackathon partnered with SAC-ISRO, focusing on mining activity monitoring using multispectral satellite imagery and Geospatial AI.",
      image:
        "https://parsec-iitdh.github.io/assets/events_main_img/LOGO/aurora_logo.jpg",
      link: "/events/aurora-2",
      registrationLink: "https://parsec.iitdh.ac.in/events/aurora-2",
    },
    // {
    //   id: "protocraft",
    //   title: "Protocraft",
    //   category: "Hackathon",
    //   description:
    //     "Theme-based mechanical design challenge. Think like an engineer and build like a creator: sketch, model, and refine your ideas using solid mechanical principles.",
    //   image:
    //     "https://parsec-iitdh.github.io/assets/events_main_img/LOGO/protocraft_logo.jpeg",
    //   link: "/events/protocraft",
    //   registrationLink: "https://parsec.iitdh.ac.in/events/protocraft",
    // },
    {
      id: "singularity",
      title: "Singularity: Build. Evolve. Converge.",
      category: "Hackathon",
      description:
        "A 30-hour agentic AI hackathon focused on building autonomous multi-agent systems with real-time decision-making.",
      image:
        "https://parsec-iitdh.github.io/assets/events_main_img/LOGO/singularity_logo.jpeg",
      link: "/events/singularity",
      registrationLink: "https://parsec.iitdh.ac.in/events/singularity",
    },
    // {
    //   id: "build-a-bot-3",
    //   title: "Build-A-Bot 3.0",
    //   category: "Hackathon",
    //   description:
    //     "Flagship robotics challenge. Two tracks: Junior (newcomers) and Senior (experienced). Teams design and build functional robots.",
    //   image:
    //     "https://parsec-iitdh.github.io/assets/events_main_img/LOGO/bab_logo.png",
    //   link: "/events/build-a-bot-3",
    //   registrationLink: "https://parsec.iitdh.ac.in/events/build-a-bot-3",
    // },
    {
      id: "devhack-7",
      title: "DevHack 7.0",
      category: "Hackathon",
      description:
        "PARSEC's 30-hour flagship hackathon. Participants embark on a journey of brainstorming, coding, and problem-solving to turn bold ideas into working prototypes under the mentorship of industry experts.",
      image:
        "https://parsec-iitdh.github.io/assets/events_main_img/LOGO/devhack_logo.jpeg",
      link: "/events/devhack-7",
      registrationLink: "https://parsec.iitdh.ac.in/events/devhack-7",
    },
  ];

  return (
    <div className="featured-section">
      <h2 className="featured-title">Featured Events</h2>

      <div className="featured-container">
        {events.map((event) => (
          <Link to={event.link} key={event.id} className="featured-card">
            <div className="featured-image-wrapper">
              <img
                src={
                  event.image ||
                  "https://via.placeholder.com/400x300?text=" +
                    encodeURIComponent(event.title)
                }
                alt={event.title}
                className="featured-image"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=" +
                    encodeURIComponent(event.title);
                }}
              />
              <div className="featured-overlay"></div>
              <span className="featured-category">{event.category}</span>
            </div>

            <div className="featured-content">
              <h3 className="featured-event-title">{event.title}</h3>
              <p className="featured-description">{event.description}</p>

              {/* Learn More → external event link */}
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="featured-link-text"
                onClick={(e) => e.stopPropagation()}
              >
                Learn More →
              </a>
            </div>
          </Link>
        ))}
      </div>

      <Link to="/events" className="view-all-button">
        View All Events
      </Link>
    </div>
  );
};

export default FeaturedEvents;
