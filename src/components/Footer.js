import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { useProfile } from "../hooks/useProfile";
import { useContact } from "../hooks/useContact";
import { renderIcon } from "../services/iconResolver";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();

  const { profile } = useProfile();
  const { socialLinks } = useContact();

  const fullName = profile?.full_name || "Asad Sarwar";
  const initials = profile?.initials || "AS";
  const githubUrl = profile?.github_url || "https://github.com/asadsarwar1";
  const linkedinUrl = profile?.linkedin_url || "https://www.linkedin.com/in/itsasadsarwar/";

  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <h3>Designed and Developed by {fullName}</h3>
        </Col>
        <Col md="4" className="footer-copywright">
          <h3>Copyright © {year} {initials}</h3>
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons">
            {socialLinks && socialLinks.length > 0 ? (
              socialLinks.map((link) => (
                <li key={link.id || link.platform} className="social-icons">
                  <a
                    href={link.url}
                    style={{ color: "white" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {renderIcon(link.icon_name)}
                  </a>
                </li>
              ))
            ) : (
              <>
                <li className="social-icons">
                  <a
                    href={githubUrl}
                    style={{ color: "white" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AiFillGithub />
                  </a>
                </li>
                <li className="social-icons">
                  <a
                    href={linkedinUrl}
                    style={{ color: "white" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedinIn />
                  </a>
                </li>
              </>
            )}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
