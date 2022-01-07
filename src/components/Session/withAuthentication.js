import React from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null,
      };
    }
    componentDidMount() {
      this.listener = onAuthStateChanged(
        this.props.firebase.auth,
        (authUser) => {
          authUser
            ? this.setState({ authUser })
            : this.setState({ authUser: null });
        }
      );
    }
    componentWillUnmount() {
      this.listener();
    }
    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
  return withFirebase(WithAuthentication);
};
export default withAuthentication;
