import React, { useState } from "react";
import Switch from "react-switch";
import useDarkMode from "use-dark-mode";

import styles from "./LightSwitch.module.css";

function LightSwitch() {
  const darkmode = useDarkMode();
  const [state, setState] = useState(!darkmode.value);

  function handleChange(checked) {
    setState(checked);
    if (checked) {
      darkmode.disable();
    } else {
      darkmode.enable();
    }
  }

  return (
    <Switch
      onChange={handleChange}
      checked={state}
      checkedIcon={<i className={`material-icons md-24 ${styles.sun}`}> wb_sunny</i>}
      uncheckedIcon={
        <i className={`material-icons md-24 ${styles.moon}`}>brightness_3</i>
      }
      onColor="#fcba03"
    />
  );
}

export default LightSwitch;
