import React from "react";
import { isArray } from "lodash";
import { compose } from "recompose";
import { Table, Fade, Button } from "react-bootstrap";
import {
  connectInfiniteHits,
  connectStateResults,
} from "react-instantsearch-dom";

import { searchTable, showMore } from "./Table.module.css";

const parseTags = (tags) => {
  if (isArray(tags)) {
    return tags.join(", ");
  } else {
    return tags;
  }
};

function AppTable({ hits, refineNext, hasMore, searchState }) {
  return searchState && searchState.query ? (
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
            Vis mer
          </Button>
        )}
      </Table>
    </Fade>
  ) : null;
}

export default compose(connectInfiniteHits, connectStateResults)(AppTable);
