import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Particle from "./Particle";
import contactImage from "../Assets/contact.png";
import { FaLinkedinIn, FaPhone, FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { useContact } from "../hooks/useContact";
import { useProfile } from "../hooks/useProfile";
import { useSeo } from "../hooks/useSeo";

function ContactUs() {
  const { contact } = useContact();
  const { profile } = useProfile();

  useSeo("/contact");

  const email = contact?.email || profile?.email || "notasadsarwar@gmail.com";
  const phone = contact?.phone || profile?.phone || "+92-313-6100930";
  const phoneDigits = phone.replace(/[^0-9+]/g, "");
  const linkedinUrl = profile?.linkedin_url || "https://www.linkedin.com/in/itsasadsarwar/";
  const fullName = profile?.full_name || "Asad Sarwar";
  const heroImage = profile?.contact_image_url || contactImage;

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
                      href={`mailto:${email}`}
                    >
                      <strong className="purple">
                        {email}{" "}
                      </strong>
                    </a>
                    <br />
                    <FaPhone />{" "}
                    <a
                      style={{ textDecoration: "none" }}
                      href={`tel:${phoneDigits}`}
                    >
                      <strong className="purple">
                        {phone} (on <FaWhatsapp /> as well){" "}
                      </strong>
                    </a>
                    <br />
                    <FaLinkedinIn />{" "}
                    <a
                      style={{ textDecoration: "none" }}
                      href={linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <strong className="purple">{fullName}</strong>
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
            <img src={heroImage} alt="about" className="img-fluid" />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default ContactUs;
