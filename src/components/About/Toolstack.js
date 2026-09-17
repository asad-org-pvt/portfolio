import React from "react";
import { Col, Row } from "react-bootstrap";
import { DiGithub, DiJira } from "react-icons/di";
import {
  SiVisualstudiocode,
  SiPostman,
  SiSlack,
  SiVercel,
  SiMacos,
  SiXcode,
  SiAndroidstudio,
} from "react-icons/si";

import { renderIcon } from "../../services/iconResolver";

function Toolstack({ skills }) {
  if (skills && skills.length > 0) {
    return (
      <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
        {skills.map((tool) => (
          <Col
            key={tool.id || tool.name}
            xs={4}
            md={2}
            className="tech-icons"
            title={tool.name}
          >
            {renderIcon(tool.icon_name)}
          </Col>
        ))}
      </Row>
    );
  }

  // Fallback to existing static icons
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <SiMacos />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiXcode />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiAndroidstudio />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiVisualstudiocode />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiPostman />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiSlack />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiVercel />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiGithub />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiJira />
      </Col>
    </Row>
  );
}

export default Toolstack;
