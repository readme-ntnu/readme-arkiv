import { FC } from "react";
import { withFirebase } from "../Firebase";

import { Nav } from "react-bootstrap";
import { WithFirebaseProps } from "../Firebase/context";

const PlainSignOutButton: FC<WithFirebaseProps> = ({ firebase }) => (
  <Nav.Link type="button" onClick={firebase.doSignOut}>
    Logg ut
  </Nav.Link>
);
export const SignOutButton = withFirebase(PlainSignOutButton);
