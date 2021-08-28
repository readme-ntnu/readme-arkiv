import React from "react";
import { Spinner } from "react-bootstrap";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Pagination,
} from "react-instantsearch-dom";

import "instantsearch.css/themes/satellite.css";

import algoliasearch from "algoliasearch/lite";

import Hit from "./Hit";

const searchClient = algoliasearch(
  "K9OSMLFRD3",
  "e9162c9f16b6ca303aa413e062713697"
);

function Search() {
  return (
    <>
      <h1>Artikkelsøk</h1>
      <InstantSearch searchClient={searchClient} indexName="Articles">
        <SearchBox />
        <Hits hitComponent={Hit} />
        <Pagination />
      </InstantSearch>
    </>
  );
}

export default Search;
