import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard({ profile = {}, experiences = [], educations = [] }) {
  const fullName = profile?.full_name || "Asad Sarwar";
  const aboutQuote = profile?.about_quote || "Strive to build things that make a difference!";
  const quoteAuthor = profile?.about_quote_author || "Asad";
  const hobbies =
    Array.isArray(profile?.hobbies) && profile.hobbies.length > 0
      ? profile.hobbies
      : ["Travelling", "Watching Movies", "Reading Ancient History"];

  const currentEmployer = profile?.current_employer || "Stella Technology";
  const educationSummary =
    profile?.education_summary || "BS Software Engineering from the Sukkur IBA University";

  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            {profile?.about_body &&
            profile.about_body !==
              "Hi Everyone, I am Asad Sarwar from Pakistan. I am currently employed as a Software Engineer at Stella Technology. I have completed BS Software Engineering from the Sukkur IBA University." ? (
              <span style={{ whiteSpace: "pre-line" }}>{profile.about_body}</span>
            ) : (
              <>
                Hi Everyone, I am <span className="purple">{fullName} </span>
                from <span className="purple"> Pakistan.</span>
                <br />
                I am currently employed as a Software Engineer at {currentEmployer}.
                <br />
                I have completed {educationSummary}.
              </>
            )}
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            {hobbies.map((hobby, index) => (
              <li key={index} className="about-activity">
                <ImPointRight /> {hobby}
              </li>
            ))}
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "{aboutQuote}"{" "}
          </p>
          <footer className="blockquote-footer">{quoteAuthor}</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
