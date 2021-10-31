import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Form, Alert } from "react-bootstrap";

import { withFirebase } from "../Firebase";
import { PasswordForgetLink } from "../PasswordForget";

import * as ROUTES from "../../constants/routes";

import "./SignIn.css";
import SubmitButton from "../Admin/Common/SubmitButton";

const SignInPage = () => (
  <div className="SignInForm">
    <h1>Logg inn</h1>
    <SignInForm />
    <PasswordForgetLink />
  </div>
);
const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
  submitting: false,
};
class SignInFormBase extends Component {
  state: {
    email: string,
    password: string,
    error: Error | null,
    submitting: boolean
  }
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = (event) => {
    const { email, password } = this.state;
    this.setState({ submitting: true });
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.ADMIN);
      })
      .catch((error) => {
        this.setState({ error, submitting: false });
      });
    event.preventDefault();
  };
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error } = this.state;
    const isValid = password !== "" && email !== "";
    return (
      <Form onSubmit={this.onSubmit}>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <Form.Group controlId="email">
          <Form.Label>E-post</Form.Label>
          <Form.Control
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="E-post"
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Passord</Form.Label>
          <Form.Control
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Passord"
          />
        </Form.Group>
        <SubmitButton
          buttonText="Logg inn"
          isSubmitting={this.state.submitting}
          isValid={isValid}
        />
      </Form>
    );
  }
}
const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);
export default SignInPage;
export { SignInForm };
