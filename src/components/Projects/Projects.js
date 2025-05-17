import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import klaims from "../../Assets/Projects/klaims.png";
import confidant from "../../Assets/Projects/confidant.png";
import bulletproofinbox from "../../Assets/Projects/bulletproofinbox.png";
import manifestnotify from "../../Assets/Projects/manifestnotify.png";
import makman from "../../Assets/Projects/makman.png";
import wellsnsiesmic from "../../Assets/Projects/wellsnsiesmic.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={confidant}
              isBlog={false}
              title="Confidant Health"
              description="Confidant Health is both a tech platform and a network of top-notch behavioral health providers. We’re a virtual health system specializing in mental health and addiction. We combine cutting edge tech with great caregivers to help people thrive."
              // ghLink="https://github.com/soumyajit4419/Chatify"
              demoLink="https://confidanthealth.com/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={klaims}
              isBlog={false}
              title="Klaims"
              description="Klaim is an award-winning fintech company based in UAE. Since 2019, we’ve been revolutionizing the healthcare industry by giving providers access to the working capital they need to grow faster and serve patients better. Our solutions are already trusted by more than 40 healthcare providers, and so far we’ve accelerated 300,000 claims and paid out 100 million AED in purchased claims"
              // ghLink="https://github.com/soumyajit4419/Bits-0f-C0de"
              demoLink="https://www.klaim.ai/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={bulletproofinbox}
              isBlog={false}
              title="Bulletproof Inbox"
              description="Bulletproof turns your open-access inbox into a permission-based one.
‍Stop emails from unknown senders before they arrive in your inbox. It works with Gmail and Outlook."
              demoLink="https://www.bulletproofinbox.com/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={manifestnotify}
              isBlog={false}
              title="Manifest Notify"
              description="MX Notify is a powerful, customizable tool that updates clinicians and 
              other care providers moments after their patients are seen in the emergency department
              or are discharged from a hospital"
              // ghLink="https://github.com/soumyajit4419/Plant_AI"
              demoLink="https://www.manifestmedex.org/solutions/mx-notify/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={wellsnsiesmic}
              isBlog={false}
              title="Wells and Siesmic"
              description="Wells and Siesmic is an online data management and reporting tool
              for wells, siesmic and related data from Oman, Turkey and more. Data can also be 
              exported and shared in many standards and formates."
              // ghLink="https://github.com/soumyajit4419/Plant_AI"
              demoLink="https://was.dev.omanbidround.com"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={makman}
              isBlog={false}
              title="Makman"
              description="Makman is an online open data market place, where you can access
              free data of wells and siesmic from Oman, Turkey and more. Data can also be purchased from there."
              // ghLink="https://github.com/soumyajit4419/Plant_AI"
              demoLink="https://makman.makmandev.omanbidround.com/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
