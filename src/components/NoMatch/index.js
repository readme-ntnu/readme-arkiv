import React from "react";
import { Image, Fade } from "react-bootstrap";

import redaktør from "../../Assets/Images/Shjolberg.png";

function NoMatch(props) {
  return (
    <Fade appear in>
      <div className="404Container">
        <Image src={redaktør}></Image>
        <h1 className="title">404</h1>
        <h4>Oups! Vi finner visst ikke den siden.</h4>
      </div>
    </Fade>
  );
}

export default NoMatch;
