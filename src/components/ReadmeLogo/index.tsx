import React, { FC } from "react";
import useDarkMode from "use-dark-mode";

export const ReadmeLogo: FC = () => {
  const darkmode = useDarkMode();
  const logoSrc = `${process.env.PUBLIC_URL}/readme_liten_hvit.png`;
  const blackLogoSrc = `${process.env.PUBLIC_URL}/readme_liten.png`;
  return (
    <div>
      <img style={{ maxHeight: "1em" }} src={logoSrc} alt="readmeLogoHvit" />;
      <img
        style={{ maxHeight: "1em" }}
        src={blackLogoSrc}
        alt="readmeLogoHvit"
      />
      ;
    </div>
  );
};
