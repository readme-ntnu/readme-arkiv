import React from "react";
import { ComponentType } from "react";
import { Firebase } from ".";

export interface WithFirebaseProps {
  firebase: Firebase;
}

export const FirebaseContext = React.createContext<Firebase>(null);

export const withFirebase =
  <P extends WithFirebaseProps>(Component: ComponentType<P>) =>
  (props) =>
    (
      <FirebaseContext.Consumer>
        {(firebase) => <Component {...(props as P)} firebase={firebase} />}
      </FirebaseContext.Consumer>
    );
