import React from "react";
import Navbar from "../components/Navbar";
import "./Services.css";
import "./Home.css";

function Services() {
  const services = [
    {
      title: "AI Cinematic Video Production",
      desc: "Creation of story-driven cinematic videos using generative AI tools, focusing on visual storytelling, composition, and film-style aesthetics.",
    },
    {
      title: "Trailer & Concept Video Creation",
      desc: "Development of cinematic trailers and concept videos designed to present narratives, shows, or creative ideas in a compelling format.",
    },
    {
      title: "AI Commercial Advertising",
      desc: "Production of AI-generated advertising videos and promotional content for brands, products, and marketing campaigns.",
    },
    {
      title: "Visual Development & Concept Frames",
      desc: "Design of characters, environments, and cinematic frames to establish the visual direction of a project.",
    },
    {
      title: "AI Storyboarding",
      desc: "Creation of AI-generated storyboard sequences to visualize scenes, camera angles, and narrative flow before production.",
    },
  ];

  return (
    <div className="home-bg">
      <Navbar />
      <section className="showcase-section" style={{ marginTop: 30 }}>
        <div className="services-container">
          <div className="services-inner">
            <h1
              className="hero-title exact-hero-title"
              style={{ marginBottom: 40 }}
            >
              <span>SERVICES</span>
            </h1>
            <div className="services-grid">
              {services.map((s, i) => (
                <article className="service-card" key={i}>
                  <h2 className="service-card-title">{s.title}</h2>
                  <p className="service-card-desc">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
