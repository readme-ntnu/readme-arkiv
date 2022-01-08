import { ComponentType, FC, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { WithFirebaseProps } from "../Firebase/context";

import { withFirebase } from "../Firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthUserContext } from ".";
import * as ROUTES from "../../constants/routes";

interface P extends WithFirebaseProps, RouteComponentProps {}

export const withAuthorization =
  (condition: (authUser: User) => boolean) =>
  (
    Component: ComponentType<P>
  ): FC<
    Pick<P, Exclude<keyof P, keyof WithFirebaseProps & RouteComponentProps>>
  > => {
    const WithAuthorizationInner = (
      props: Pick<
        P,
        Exclude<keyof P, keyof WithFirebaseProps & RouteComponentProps>
      >
    ) => {
      useEffect(() => {
        const sub = onAuthStateChanged(props.firebase.auth, (authUser) => {
          if (!authUser || !condition(authUser)) {
            props.history.push(ROUTES.SIGN_IN);
          }
        });

        return () => sub();
      });

      return (
        <AuthUserContext.Consumer>
          {(authUser) =>
            authUser && condition(authUser) ? (
              <Component {...(props as P)} />
            ) : null
          }
        </AuthUserContext.Consumer>
      );
    };
    return withFirebase(withRouter(WithAuthorizationInner));
  };
