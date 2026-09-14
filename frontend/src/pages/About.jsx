import React from "react";
import Container from "react-bootstrap/Container";
import "./About.css";

const About = () => {
  return (
    <section className="aboutContainer">
      <Container>
        {/* Hero Section */}
        <div className="aboutHero">
          <span className="aboutSubtitle">ABOUT OUR BLOG</span>

          <h1>
            Ideas, Stories & Knowledge
            <br />
            Worth Sharing
          </h1>

          <p>
            Welcome to our blog — a place where curiosity meets useful
            knowledge. We share thoughtful articles, practical insights, and
            interesting stories designed to help you learn something new with
            every visit.
          </p>
        </div>

        {/* Mission */}
        <div className="aboutSection">
          <h2>Our Mission</h2>

          <p>
            Our mission is simple: to create useful and meaningful content that
            makes learning easier and more enjoyable. The internet is filled
            with information, but finding information that is clear, practical,
            and worth your time can be difficult.
          </p>

          <p>
            That's why we focus on turning complex ideas into easy-to-understand
            articles that you can actually use in your everyday life, career,
            and personal growth.
          </p>
        </div>

        {/* What We Write About */}
        <div className="aboutSection">
          <h2>What We Write About</h2>

          <div className="aboutCards">
            <div className="aboutCard">
              <h3>Technology</h3>
              <p>
                Explore web development, programming, modern technologies,
                tools, and trends shaping the digital world.
              </p>
            </div>

            <div className="aboutCard">
              <h3>Learning</h3>
              <p>
                Discover practical learning strategies, useful concepts, and
                resources that can help you improve your skills.
              </p>
            </div>

            <div className="aboutCard">
              <h3>Lifestyle</h3>
              <p>
                Read practical ideas about productivity, creativity, personal
                development, and building better habits.
              </p>
            </div>

            <div className="aboutCard">
              <h3>Ideas & Stories</h3>
              <p>
                Thought-provoking perspectives, experiences, and stories that
                encourage curiosity and new ways of thinking.
              </p>
            </div>
          </div>
        </div>

        {/* Why Read */}
        <div className="aboutSection">
          <h2>Why Read Our Blog?</h2>

          <div className="aboutPoints">
            <div>
              <h3>01. Simple & Clear</h3>
              <p>
                We avoid unnecessary complexity and explain ideas in a way that
                is easy to understand.
              </p>
            </div>

            <div>
              <h3>02. Practical Knowledge</h3>
              <p>
                Our goal is not just to provide information but to share
                knowledge that you can apply in real situations.
              </p>
            </div>

            <div>
              <h3>03. Quality Over Quantity</h3>
              <p>
                We believe one genuinely useful article is better than many
                articles that provide little value.
              </p>
            </div>

            <div>
              <h3>04. Always Learning</h3>
              <p>
                Technology and the world around us are constantly changing. We
                keep learning, researching, and sharing along the way.
              </p>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="aboutClosing">
          <h2>Keep Learning. Keep Exploring.</h2>

          <p>
            Whether you're here to learn a new skill, discover a different
            perspective, or simply spend a few minutes reading something
            interesting, we hope you find something valuable here.
          </p>

          <p>Thanks for being part of our journey.</p>
        </div>
      </Container>
    </section>
  );
};

export default About; 