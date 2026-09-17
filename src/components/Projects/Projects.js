import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { useProjects } from "../../hooks/useProjects";
import { useSeo } from "../../hooks/useSeo";

function Projects() {
  const { projects } = useProjects();
  useSeo("/project");

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
          {projects.map((project) => (
            <Col key={project.id || project.title} md={4} className="project-card">
              <ProjectCard
                imgPath={project.cover_image_url}
                isBlog={false}
                title={project.title}
                description={project.description}
                ghLink={project.github_url}
                demoLink={project.demo_url}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;

