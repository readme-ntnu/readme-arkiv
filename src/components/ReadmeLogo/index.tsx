import { FC } from "react";
import useDarkMode from "use-dark-mode";

import styles from "./ReadmeLogo.module.css";

export const ReadmeLogo: FC<{
  maxWidth?: string;
  maxHeight?: string;
  small?: boolean;
}> = ({ maxWidth, maxHeight, small }) => {
  const darkmode = useDarkMode();
  const logoSrc = `${process.env.PUBLIC_URL}/readme${
    small ? "_liten" : ""
  }_hvit.png`;
  const blackLogoSrc = `${process.env.PUBLIC_URL}/readme${
    small ? "_liten" : ""
  }.png`;
  return (
    <div className={styles.readmeLogo}>
      <img
        className={styles.logoHvit}
        style={{
          opacity: darkmode.value ? 1 : 0,
          maxHeight,
          maxWidth,
        }}
        src={logoSrc}
        alt="readmeLogoHvit"
      />
      <img
        className={styles.logoSort}
        style={{
          opacity: darkmode.value ? 0 : 1,
          maxHeight,
          maxWidth,
        }}
        src={blackLogoSrc}
        alt="readmeLogoHvit"
      />
    </div>
  );
};
