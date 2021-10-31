import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";

function useAnonymousLogin() {
  const [user, setUser] = useState<firebase.User>();
  const [token, setToken] = useState<string>();

  if (process.env.NODE_ENV === "development") {
    firebase.auth().useEmulator("http://localhost:9099");
  }

  useEffect(() => {
    if (!firebase.auth().currentUser) {
      firebase.auth().signInAnonymously().catch(console.error);
    } else {
      setUser(firebase.auth().currentUser);
      firebase
        .auth()
        .currentUser.getIdToken()
        .then((token) => setToken(token));
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
