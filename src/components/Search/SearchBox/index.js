import { connectSearchBox } from "react-instantsearch-dom";
import { Spinner } from "react-bootstrap";

import { searchBox, end } from "./SearchBox.module.css";

function SearchBox({ currentRefinement, refine, isSearchStalled }) {
  return (
    <div className={searchBox}>
      <input
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
        placeholder="Søk..."
        size="32"
      />
      <div className={end}>
        {isSearchStalled ? (
          <Spinner animation="border" />
        ) : (
          <i className={`material-icons md-36`}>search</i>
        )}
      </div>
    </div>
  );
}

export default connectSearchBox(SearchBox);
