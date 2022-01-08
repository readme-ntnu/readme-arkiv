import { FC } from "react";
import { isArray } from "lodash";
import { Table, Fade, Button } from "react-bootstrap";
import {
  connectInfiniteHits,
  connectStateResults,
  InfiniteHitsProvided,
  StateResultsProvided,
} from "react-instantsearch-core";

import styles from "./Table.module.css";

const parseTags = (tags: Array<string> | string) => {
  if (isArray(tags)) {
    return tags.join(", ");
  } else {
    return tags;
  }
};

const SearchTable: FC<InfiniteHitsProvided & StateResultsProvided> = ({
  hits,
  refineNext,
  hasMore,
  searchState,
}) => {
  return (
    <>
      {searchState && searchState.query ? (
        <Fade in appear>
          <Table
            striped
            bordered
            hover
            responsive="lg"
            className={styles.searchTable}
          >
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
              <Button className={styles.showMore} onClick={refineNext}>
                Vis mer
              </Button>
            )}
          </Table>
        </Fade>
      ) : null}
    </>
  );
};

export const AppTable = connectInfiniteHits(connectStateResults(SearchTable));
