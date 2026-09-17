import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.svg";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";
import { useProfile } from "../../hooks/useProfile";
import { useContact } from "../../hooks/useContact";
import { useSeo } from "../../hooks/useSeo";

function Home() {
  const { profile } = useProfile();
  const { socialLinks } = useContact();
  useSeo("/");

  const heroImage = profile?.hero_image_url || homeLogo;
  const fullName = profile?.full_name || "ASAD SARWAR";
  const heroGreeting = profile?.hero_greeting || "Hi There!";

  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <h1 style={{ paddingBottom: 15 }} className="heading">
                {heroGreeting}{" "}
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h1>

              <h1 className="heading-name">
                I'M
                <strong className="main-name"> {fullName.toUpperCase()}</strong>
              </h1>

              <div style={{ padding: 50, textAlign: "left" }}>
                <Type strings={profile?.rotating_titles} />
              </div>
            </Col>

            <Col md={5} style={{ paddingBottom: 20 }}>
              <img
                src={heroImage}
                alt="home pic"
                className="img-fluid"
                style={{ maxHeight: "450px" }}
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <Home2 profile={profile} socialLinks={socialLinks} />
    </section>
  );
}

export default Home;
