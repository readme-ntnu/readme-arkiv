import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Fade } from "react-bootstrap";

import { withAuthorization } from "../Session";

import * as ROUTES from "../../constants/routes";
import "./AdminPage.css";

function AdminPage({ firebase }) {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function fetchData() {
      let isSubscribed = true;
      const settings = await firebase.getSettings();
      if (isSubscribed) {
        setSettings(settings);
      }
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [firebase]);

  function toggleShowListing() {
    firebase.setShowListing(!settings.showListing);
    setSettings({ ...settings, showListing: !settings.showListing });
  }

  return (
    <Fade appear in>
      <div>
        <h1>Admin</h1>
        <div className="buttonContainer">
          <LinkContainer to={ROUTES.NEW_EDITION}>
            <Button variant="primary" block>
              Legg til ny utgave
            </Button>
          </LinkContainer>
          <LinkContainer to={ROUTES.EDITION_LIST}>
            <Button variant="primary" block>
              Vis utgavelisten
            </Button>
          </LinkContainer>
          <LinkContainer to={ROUTES.NEW_ARTICLE}>
            <Button variant="primary" block>
              Legg til ny artikkel
            </Button>
          </LinkContainer>
          <LinkContainer to={ROUTES.ARTICLE_LIST}>
            <Button variant="primary" block>
              Vis artikkellisten
            </Button>
          </LinkContainer>

          <Button variant="secondary" block onClick={() => toggleShowListing()}>
            {settings.showListing ? "Skjul" : "Vis"} listingutgaver
          </Button>
        </div>
      </div>
    </Fade>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AdminPage);
