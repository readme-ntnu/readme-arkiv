import React from "react";
import ReadmeLogo from "../ReadmeLogo";

import { footer } from "./Footer.module.css";

function Footer() {
  return (
    <div className={footer}>
      <p>
        Laget med ❤ av <ReadmeLogo />
      </p>
    </div>
  );
}

export default Footer;
