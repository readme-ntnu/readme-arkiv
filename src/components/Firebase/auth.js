import { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";

function useAnonymousLogin() {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    firebase
      .auth()
      .signInAnonymously()
      .catch(console.error);
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
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
    token
  };
}

export default useAnonymousLogin;
