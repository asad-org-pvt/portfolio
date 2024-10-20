import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Particle from "./Particle";
import contactImage from "../Assets/contact.png";
import { FaLinkedinIn, FaPhone, FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";

function ContactUs() {
  return (
    <Container fluid className="about-section">
      <Container>
        <Particle />
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 className="project-heading">
              Contact <strong className="purple">Us </strong>
            </h1>
            <p style={{ color: "white" }}>
              Click on the text below to trigger the approperiate action.
            </p>
            <Card className="quote-card-view">
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p style={{ textAlign: "justify" }}>
                    <AiOutlineMail />{" "}
                    <a
                      style={{ textDecoration: "none" }}
                      href="mailto:notasadsarwar@gmail.com"
                    >
                      <strong className="purple">
                        notasadsarwar@gmail.com{" "}
                      </strong>
                    </a>
                    <br />
                    <FaPhone />{" "}
                    <a
                      style={{ textDecoration: "none" }}
                      href="tel:+923136100930"
                    >
                      <strong className="purple">
                        +92-313-6100930 (on <FaWhatsapp /> as well){" "}
                      </strong>
                    </a>
                    <br />
                    <FaLinkedinIn />{" "}
                    <a
                      style={{ textDecoration: "none" }}
                      href="https://www.linkedin.com/in/itsasadsarwar/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <strong className="purple">Asad Sarwar</strong>
                    </a>{" "}
                  </p>
                </blockquote>
              </Card.Body>
            </Card>
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <img src={contactImage} alt="about" className="img-fluid" />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default ContactUs;
