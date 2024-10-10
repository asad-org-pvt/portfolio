import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import CertificateCards from "./CertificateCards";
import FEDevHackerrank from "../../Assets/frontend_developer_react.pdf";
import JSInterHackerrank from "../../Assets/js_intermediate.pdf";
import SEHackerrank from "../../Assets/se.pdf";

function Certificates() {
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
            <CertificateCards
              docSource={FEDevHackerrank}
              isBlog={false}
              title="Frontend Developer (React) Certificate"
              description="Awarded by HackerRank for successfully completing the Frontend Developer (React) Certificate. The certificate verifies that the recipient has successfully completed the Frontend Developer (React) Certificate."
              openLink="https://www.hackerrank.com/certificates/c81d69157c24"
            />
          </Col>
          <Col md={4} className="project-card">
            <CertificateCards
              docSource={SEHackerrank}
              isBlog={false}
              title="Software Engineer Certificate"
              description="Awarded by HackerRank for successfully completing the Software Engineer Certificate. The certificate verifies that the recipient has successfully completed the Software Engineer Certificate."
              openLink="https://www.hackerrank.com/certificates/56fb13932891"
            />
          </Col>
          <Col md={4} className="project-card">
            <CertificateCards
              docSource={JSInterHackerrank}
              isBlog={false}
              title="JavaScript (Intermediate) Certificate"
              description="Awarded by HackerRank for successfully completing the JavaScript (Intermediate) Certificate. The certificate verifies that the recipient has successfully completed the JavaScript (Intermediate) Certificate."
              openLink="https://www.hackerrank.com/certificates/7c5552aeb986"
            />
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <CertificateCards
              imgPath="https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~GMTR8AY2YPRP/CERTIFICATE_LANDING_PAGE~GMTR8AY2YPRP.jpeg"
              isBlog={false}
              title="GCP: Core Infrastructure"
              description="Awarded by Google & Coursera for successfully completing the Google Cloud Platform Fundamentals: Core Infrastructure. The certificate verifies that the recipient has successfully completed the Google Cloud Platform Fundamentals: Core Infrastructure."
              openLink="https://www.coursera.org/account/accomplishments/verify/GMTR8AY2YPRP?utm_source=mobile&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course"
            />
          </Col>
          <Col md={4} className="project-card">
            <CertificateCards
              imgPath="https://images.credly.com/size/680x680/images/ae2f5bae-b110-4ea1-8e26-77cf5f76c81e/GCC_badge_IT_Support_1000x1000.png"
              isBlog={false}
              title="Google IT Support Certificate"
              description="Awarded by Google & Coursera and authorized by Credly for successfully completing the Google IT Support Certificate. The certificate verifies that the recipient has successfully completed the Google IT Support Certificate."
              openLink="https://www.credly.com/badges/b73c48de-d683-4d48-8f92-09fc59235554/linked_in_profile"
            />
          </Col>
          <Col md={4} className="project-card">
            <CertificateCards
              imgPath="https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~SX6KPVQHKM29/CERTIFICATE_LANDING_PAGE~SX6KPVQHKM29.jpeg"
              isBlog={false}
              title="Getting Started With Application Development: GCP"
              description="Awarded by Google & Coursera for successfully completing the Getting Started With Application Development: GCP. The certificate verifies that the recipient has successfully completed the Getting Started With Application Development: GCP."
              openLink="https://www.coursera.org/account/accomplishments/verify/SX6KPVQHKM29?utm_source=mobile&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Certificates;
