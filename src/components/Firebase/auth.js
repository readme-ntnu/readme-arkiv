import { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";

function useAnonymousLogin() {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

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
