import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "./Particle";
import ServiceCards from "./ServiceCards";
import FEImange from "../Assets/fee.webp";
import BEImange from "../Assets/be.png";
import RNImange from "../Assets/md.png";
import ConsultImange from "../Assets/consult.png";
import TechstackInService from "./TechstackInService";
import { useServices } from "../hooks/useServices";
import { useSkills } from "../hooks/useSkills";
import { useSeo } from "../hooks/useSeo";

function Services() {
  const { services } = useServices();
  const { skills } = useSkills("service");

  useSeo("/services");

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <Container className="about-section2">
          <h1 className="project-heading">
            Available <strong className="purple">Skillset </strong>
          </h1>
          <p style={{ color: "white" }}>
            Our team is proficient in the following technologies and more.
          </p>
          <TechstackInService skills={skills} />
        </Container>
        <h1 className="project-heading">
          Available <strong className="purple">Services </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are freelance services provided by my team.
        </p>

        {services && services.length > 0 ? (
          <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
            {services.map((service) => (
              <Col
                key={service.id || service.title}
                md={4}
                className="project-card"
              >
                <ServiceCards
                  imgPath={service.icon_url}
                  isBlog={false}
                  title={service.title}
                  description={service.description}
                  ctaLabel={service.cta_label}
                  ctaLink={service.cta_link}
                  openLink=""
                />
              </Col>
            ))}
          </Row>
        ) : (
          <>
            <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
              <Col md={4} className="project-card">
                <ServiceCards
                  imgPath={FEImange}
                  isBlog={false}
                  title="Frontend Development"
                  description="We have a team of experienced frontend developers who are proficient in React.js, Angular, and Next.js. We can build scalable and responsive web applications for you."
                  openLink=""
                />
              </Col>
              <Col md={4} className="project-card">
                <ServiceCards
                  imgPath={BEImange}
                  isBlog={false}
                  title="Backend Development"
                  description="We have a team of experienced backend developers who are proficient in Node.js, Express.js, and MongoDB. We can build scalable and secure backend for your web and mobile applications."
                  openLink=""
                />
              </Col>
              <Col md={4} className="project-card">
                <ServiceCards
                  imgPath={RNImange}
                  isBlog={false}
                  title="Mobile Application Development"
                  description="We have a team of experienced React Native developers. We can build cross-platform mobile applications for you. Including the ability to build/publish mobile applications for both iOS and Android on App Store and Play Store."
                  openLink=""
                />
              </Col>
            </Row>
            <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
              <Col md={4} className="project-card">
                <ServiceCards
                  imgPath={ConsultImange}
                  isBlog={false}
                  title="Consultation Services"
                  description="We provide consultation services for your web and mobile applications. We can help you with the architecture of your application, the technology stack, and the best practices to follow."
                  openLink=""
                />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </Container>
  );
}

export default Services;
