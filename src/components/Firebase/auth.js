import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";

function useAnonymousLogin() {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  // eslint-disable-next-line no-restricted-globals
  if (location.hostname === "localhost") {
    firebase.auth().useEmulator("http://localhost:9099")
  }

  useEffect(() => {
    if (!firebase.auth().currentUser) {
      firebase.auth().signInAnonymously().catch(console.error);
    } else {
      setUser(firebase.auth().currentUser);
      setToken(firebase.auth().currentUser.getIdToken());
    }
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
        setUser(null);
        setToken(null);
        return;
      }

      setUser(user);

      firebase
        .auth()
        .currentUser.getIdToken()
        .then(setToken)
        .catch(console.error);
    });
  }, []);

  return {
    user,
    token,
  };
}

export default useAnonymousLogin;
