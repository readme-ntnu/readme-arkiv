import React, { FC } from "react";
import { ComponentType } from "react";
import { Firebase } from ".";

export interface WithFirebaseProps {
  firebase: Firebase;
}

export const FirebaseContext = React.createContext<Firebase>({} as Firebase);

export const withFirebase =
  <P extends WithFirebaseProps>(
    Component: ComponentType<P>
  ): FC<Pick<P, Exclude<keyof P, keyof WithFirebaseProps>>> =>
  (props: Pick<P, Exclude<keyof P, keyof WithFirebaseProps>>) =>
    (
      <FirebaseContext.Consumer>
        {(firebase) => <Component {...(props as P)} firebase={firebase} />}
      </FirebaseContext.Consumer>
    );
