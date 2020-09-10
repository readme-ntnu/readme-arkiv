import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Switch from "react-switch";

import { withFirebase } from "../../Firebase";

import { toggleContainer } from "./ShowListingToggle.module.css";

function ShowListingToggle({ firebase }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let isSubscribed = true;
      const settings = await firebase.getSettings();
      if (isSubscribed) {
        setSettings(settings);
      }
      setLoading(false);
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [firebase]);

  function toggleShowListing() {
    firebase.setShowListing(!settings.showListing);
    setSettings({ ...settings, showListing: !settings.showListing });
  }

  return (
    <div className={toggleContainer}>
      <p>Vis listingsutgaver:</p>
      <Switch
        onChange={toggleShowListing}
        checked={settings.showListing || false}
        disabled={loading}
      />
      <div>
        {loading ? (
          <Spinner animation="border" size="sm" variant="secondary" />
        ) : null}
      </div>
    </div>
  );
}

export default withFirebase(ShowListingToggle);
