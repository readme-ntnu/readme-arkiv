import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { WithFirebaseProps } from "../Firebase/context";

import { withFirebase } from "../Firebase";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { AuthUserContext } from ".";
import * as ROUTES from "../../constants/routes";

export const withAuthorization = (condition) => (Component) => {
  class WithAuthorization extends React.Component<
    WithFirebaseProps & RouteComponentProps
  > {
    listener: Unsubscribe;
    componentDidMount() {
      this.listener = onAuthStateChanged(
        this.props.firebase.auth,
        (authUser) => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.SIGN_IN);
          }
        }
      );
    }
    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {(authUser) =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withRouter(withFirebase(WithAuthorization));
};
