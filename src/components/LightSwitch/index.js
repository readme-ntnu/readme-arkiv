import React, { useState } from "react";
import Switch from "react-switch";

import { sun, moon } from "./LightSwitch.module.css";

function LightSwitch() {
  const [state, setState] = useState(true);

  function handleChange(checked) {
    setState(checked);
  }

  return (
    <Switch
      onChange={handleChange}
      checked={state}
      checkedIcon={<i className={`material-icons md-24 ${sun}`}> wb_sunny</i>}
      uncheckedIcon={
        <i className={`material-icons md-24 ${moon}`}>brightness_3</i>
      }
      onColor="#fcba03"
    />
  );
}

export default LightSwitch;
