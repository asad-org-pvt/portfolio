import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { BsLink } from "react-icons/bs";
import { Document, Page } from "react-pdf";

function ServicesCards(props) {
  return (
    <Card className="project-card-view">
      {props?.imgPath && (
        <Card.Img variant="top" src={props.imgPath} alt="card-img" />
      )}
      {props.docSource && (
        <Document
          file={props.docSource}
          className="d-flex justify-content-center"
        >
          <Page pageNumber={1} scale={0.3} />
        </Document>
      )}
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>
          {props.description}
        </Card.Text>
        {"\n"}
        {"\n"}

        <Button
          variant="primary"
          href="/contact"
          style={{ marginLeft: "10px" }}
        >
          <BsLink /> &nbsp;
          {"Contact Us"}
        </Button>
      </Card.Body>
    </Card>
  );
}
export default ServicesCards;
