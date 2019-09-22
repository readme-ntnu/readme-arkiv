import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import "./PasswordForgottenPage.css";

const PasswordForgetPage = () => (
  <div className="PasswordForgetPage">
    <h1>Password Reset</h1>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  error: null
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;
    const isInvalid = email === "";
    return (
      <Form onSubmit={this.onSubmit}>
        {error && <Alert variant="danger">{error.message}</Alert>}

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
        </Form.Group>
        <Button variant="primary" disabled={isInvalid} type="submit">
          Reset My Password
        </Button>
      </Form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
