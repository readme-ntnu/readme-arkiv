import { isArray } from "lodash";
import React from "react";
import { Table, Fade } from "react-bootstrap";

import { searchTable } from "./Table.module.css";

const parseTags = (tags) => {
  if (isArray(tags)) {
    return tags.join(", ");
  } else {
    return tags;
  }
};

function AppTable(props) {
  return (
    <Fade in appear>
      <Table striped bordered hover responsive="lg" className={searchTable}>
        <thead>
          <tr>
            <th>Utgave</th>
            <th>Tittel</th>
            <th>Forfatter</th>
            <th>Layout</th>
            <th>Spalte</th>
            <th>Stikkord</th>
          </tr>
        </thead>
        <tbody>
          {props.articles.map((article) => (
            <tr key={article._id}>
              <td>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.edition}
                </a>
              </td>
              <td>{article.title}</td>
              <td>{article.author}</td>
              <td>{article.layout}</td>
              <td>{article.type}</td>
              <td>{parseTags(article.tags)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fade>
  );
}

export default AppTable;
