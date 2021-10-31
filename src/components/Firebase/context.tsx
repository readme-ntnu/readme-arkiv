import React from "react";
import Firebase from ".";

const FirebaseContext = React.createContext<Firebase>(null);

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);
export default FirebaseContext;
