import React from "react";
import GitHubCalendar from "react-github-calendar";
import { Row } from "react-bootstrap";

function Github({ usernames }) {
  const user1 = usernames?.main || "asadsarwar1";
  const user2 = usernames?.alt || "asarwar-tes";

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
      <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
        Days I <strong className="purple">Code</strong>
      </h1>
      {user1 && (
        <GitHubCalendar
          username={user1}
          blockSize={15}
          blockMargin={5}
          color="#c084f5"
          fontSize={16}
        />
      )}
      {user2 && (
        <GitHubCalendar
          username={user2}
          blockSize={15}
          blockMargin={5}
          color="#c084f5"
          fontSize={16}
        />
      )}
    </Row>
  );
}

export default Github;
