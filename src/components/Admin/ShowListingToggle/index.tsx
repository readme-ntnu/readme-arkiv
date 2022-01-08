import { useState, useEffect, FC } from "react";
import { Spinner } from "react-bootstrap";
import Switch from "react-switch";

import { withFirebase } from "../../Firebase";
import { WithFirebaseProps } from "../../Firebase/context";

import style from "./ShowListingToggle.module.css";

const PlainShowListingToggle: FC<WithFirebaseProps> = ({ firebase }) => {
  interface ISettings {
    showListing: boolean;
  }

  const [settings, setSettings] = useState<ISettings>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let isSubscribed = true;
      const settings = await firebase.getSettings();
      if (isSubscribed) {
        setSettings(settings as ISettings);
      }
      setLoading(false);
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [firebase]);

  function toggleShowListing() {
    firebase.setShowListing(!settings?.showListing);
    setSettings({ ...settings, showListing: !settings?.showListing });
  }

  return (
    <div className={style.toggleContainer}>
      <p>Vis listingsutgaver:</p>
      <Switch
        onChange={toggleShowListing}
        checked={settings?.showListing ?? false}
        disabled={loading}
      />
      <div>
        {loading ? (
          <Spinner animation="border" size="sm" variant="secondary" />
        ) : null}
      </div>
    </div>
  );
};

export const ShowListingToggle = withFirebase(PlainShowListingToggle);
