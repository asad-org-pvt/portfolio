import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { renderIcon } from "../../services/iconResolver";

function Home2({ profile = {}, socialLinks = [] }) {
  const avatarUrl = profile?.avatar_url || myImg;
  const githubUrl = profile?.github_url || "https://github.com/asadsarwar1";
  const linkedinUrl = profile?.linkedin_url || "https://www.linkedin.com/in/itsasadsarwar/";

  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              {profile?.hero_intro_title ? (
                <>
                  LET ME <span className="purple"> INTRODUCE </span> MYSELF
                </>
              ) : (
                <>
                  LET ME <span className="purple"> INTRODUCE </span> MYSELF
                </>
              )}
            </h1>
            <p className="home-about-body" style={{ whiteSpace: "pre-line" }}>
              {profile?.hero_intro_body &&
              profile.hero_intro_body !==
                "I fell in love with programming and I have at least learnt something, I think… 🤷‍♂️ I am fluent in Javascript and Typescript. My field of Interest's are building new Web Technologies and Products. Whenever possible, I also apply my passion for developing products with Node.js and Modern Javascript Library and Frameworks like React.js, Angular and Next.js." ? (
                profile.hero_intro_body
              ) : (
                <>
                  I fell in love with programming and I have at least learnt
                  something, I think… 🤷‍♂️
                  <br />
                  <br />
                  I am fluent in classics like
                  <i>
                    <b className="purple"> Javascript and Typescript. </b>
                  </i>
                  <br />
                  <br />
                  My field of Interest's are building new &nbsp;
                  <i>
                    <b className="purple">Web Technologies and Products </b>
                  </i>
                  <br />
                  <br />
                  Whenever possible, I also apply my passion for developing
                  products with <b className="purple">Node.js</b> and
                  <i>
                    <b className="purple">
                      {" "}
                      Modern Javascript Library and Frameworks
                    </b>
                  </i>
                  &nbsp; like
                  <i>
                    <b className="purple"> React.js, Angular and Next.js</b>
                  </i>
                </>
              )}
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={avatarUrl} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              {socialLinks && socialLinks.length > 0 ? (
                socialLinks.map((item) => (
                  <li key={item.platform || item.id} className="social-icons">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="icon-colour home-social-icons"
                    >
                      {item.icon_name ? renderIcon(item.icon_name) : item.platform === "github" ? <AiFillGithub /> : <FaLinkedinIn />}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li className="social-icons">
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="icon-colour home-social-icons"
                    >
                      <AiFillGithub />
                    </a>
                  </li>
                  <li className="social-icons">
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="icon-colour home-social-icons"
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
    </Container>
  );
}
export default Home2;
