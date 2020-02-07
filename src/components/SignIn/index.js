import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

import { withFirebase } from "../Firebase";
import { PasswordForgetLink } from "../PasswordForget";

import * as ROUTES from "../../constants/routes";

import "./SignIn.css";

const SignInPage = () => (
  <div className="SignInForm">
    <h1>Sign In</h1>
    <SignInForm />
    <PasswordForgetLink />
  </div>
);
const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
  submitting: false
};
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email, password } = this.state;
    this.setState({ submitting: true });
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
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
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";
    return (
      <Form onSubmit={this.onSubmit}>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button
          variant="primary"
          disabled={isInvalid || this.state.submitting}
          type="submit"
        >
          {this.state.submitting ? (
            <Spinner animation="border" size="sm" />
          ) : null}
          Sign In
        </Button>
      </Form>
    );
  }
}
const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);
export default SignInPage;
export { SignInForm };
