import React from "react";
import ReadmeLogo from "../ReadmeLogo";

import style from "./Footer.module.css";

function Footer() {
  return (
    <div className={style.footer}>
      <p>
        Laget med ❤ av <ReadmeLogo />
      </p>
    </div>
  );
}

export default Footer;
