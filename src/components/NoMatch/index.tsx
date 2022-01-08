import { FC } from "react";
import { Image, Fade } from "react-bootstrap";

import redaktør from "../../Assets/Images/Shjolberg.png";

export const NoMatch: FC = () => {
  return (
    <Fade appear in>
      <div className="404Container">
        <Image src={redaktør}></Image>
        <h1 className="title">404</h1>
        <h4>Oups! Vi finner visst ikke den siden.</h4>
      </div>
    </Fade>
  );
};
