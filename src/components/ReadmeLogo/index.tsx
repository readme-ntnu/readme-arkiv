import React, { FC } from "react";
import useDarkMode from "use-dark-mode";
import CrossfadeImage from "react-crossfade-image";

export const ReadmeLogo: FC = () => {
  const darkmode = useDarkMode();
  const logoSrc = `${process.env.PUBLIC_URL}/readme_liten${
    darkmode.value ? "_hvit" : ""
  }.png`;
  return <CrossfadeImage style={{ maxHeight: "1em" }} src={logoSrc} />;
};
