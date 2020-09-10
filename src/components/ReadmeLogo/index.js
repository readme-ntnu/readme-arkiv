import React from "react";
import useDarkMode from "use-dark-mode";
import CrossfadeImage from "react-crossfade-image";

function ReadmeLogo() {
  const darkmode = useDarkMode();
  const logoSrc = `${process.env.PUBLIC_URL}/readme_liten${
    darkmode.value ? "_hvit" : ""
  }.png`;
  return (
    <span
      style={{
        fontFamily: "OCR A Extended",
        fontWeight: "400",
        textTransform: "lowercase",
      }}
    >
      <CrossfadeImage src={logoSrc} />
    </span>
  );
}

export default ReadmeLogo;
