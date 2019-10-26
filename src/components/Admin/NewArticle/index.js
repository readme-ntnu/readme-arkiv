import React from "react";
import { Form, Button } from "react-bootstrap";

import { withAuthorization } from "../../Session";

class NewArticlePage extends React.Component {
  render() {
    return <p>Placeholder</p>;
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewArticlePage);
