import { isArray } from "lodash";
import React from "react";
import { Table, Fade, Button } from "react-bootstrap";

import { searchTable, showMore } from "./Table.module.css";

import { connectInfiniteHits } from "react-instantsearch-dom";

const parseTags = (tags) => {
  if (isArray(tags)) {
    return tags.join(", ");
  } else {
    return tags;
  }
};

function AppTable({ hits, refineNext, hasMore }) {
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
          {hits.map((hit) => (
            <tr key={hit._id}>
              <td>
                <a href={hit.url} target="_blank" rel="noopener noreferrer">
                  {hit.edition}
                </a>
              </td>
              <td>{hit.title}</td>
              <td>{hit.author}</td>
              <td>{hit.layout}</td>
              <td>{hit.type}</td>
              <td>{parseTags(hit.tags)}</td>
            </tr>
          ))}
        </tbody>
        {hasMore && (
          <Button className={showMore} onClick={refineNext}>
            Show more
          </Button>
        )}
      </Table>
    </Fade>
  );
}

export default connectInfiniteHits(AppTable);
