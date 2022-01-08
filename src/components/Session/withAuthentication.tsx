import React, { ComponentType } from "react";

import { AuthUserContext } from "./context";
import { withFirebase } from "../Firebase";
import { onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import { WithFirebaseProps } from "../Firebase/context";

export const withAuthentication = <P extends WithFirebaseProps>(
  Component: ComponentType<P>
) => {
  class WithAuthentication extends React.Component<
    WithFirebaseProps & P,
    { authUser: User | null }
  > {
    listener: Unsubscribe | null = null;

    constructor(props: WithFirebaseProps & P) {
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
      if (this.listener) {
        this.listener();
      }
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
