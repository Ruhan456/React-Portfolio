import React from "react";
import { useParams } from "react-router-dom";

function ProjectPage() {
  const { slug } = useParams();
  return <main className="page"><h1>{slug}</h1></main>;
}

export default ProjectPage;
