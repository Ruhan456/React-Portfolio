import React from "react";
import { Link } from "react-router-dom";
import { homeCards } from "../data/homeCards";

function HomeBox() {
  return (
    <main className="page">
      <h1>Ruhan Bhavsar</h1>
      <ul>
        {homeCards.map((card) => (
          <li key={card.id}>
            <Link to={card.to}>{card.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default HomeBox;
