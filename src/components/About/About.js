import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about.png";
import Toolstack from "./Toolstack";
import { useProfile } from "../../hooks/useProfile";
import { useSkills } from "../../hooks/useSkills";
import { useExperience } from "../../hooks/useExperience";
import { useEducation } from "../../hooks/useEducation";
import { useSeo } from "../../hooks/useSeo";

function About() {
  const { profile } = useProfile();
  const { skills: techSkills } = useSkills("technical");
  const { skills: toolSkills } = useSkills("tool");
  const { experiences } = useExperience();
  const { educations } = useEducation();

  useSeo("/about");

  const aboutImage = profile?.about_image_url || laptopImg;

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              Know Who <strong className="purple">I'M</strong>
            </h1>
            <Aboutcard
              profile={profile}
              experiences={experiences}
              educations={educations}
            />
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <img src={aboutImage} alt="about" className="img-fluid" />
          </Col>
        </Row>
        <h1 className="project-heading">
          Professional <strong className="purple">Skillset </strong>
        </h1>

        <Techstack skills={techSkills} />

        <h1 className="project-heading">
          <strong className="purple">Tools</strong> I use
        </h1>
        <Toolstack skills={toolSkills} />

        <Github
          usernames={{
            main: profile?.github_username_main,
            alt: profile?.github_username_alt,
          }}
        />
      </Container>
    </Container>
  );
}

export default About;
