import { FC } from "react";
import { ReadmeLogo } from "../ReadmeLogo";

import style from "./Footer.module.css";

export const Footer: FC = () => {
  return (
    <div className={style.footer}>
      <p>
        Laget med ❤ av <ReadmeLogo small maxHeight={"1em"} />
      </p>
    </div>
  );
};
