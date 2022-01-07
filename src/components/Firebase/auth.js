import { useState, useEffect, useContext } from "react";
import {
  connectAuthEmulator,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import { FirebaseContext } from "../Firebase";

function useAnonymousLogin() {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    const auth = firebase.auth;
    if (!auth.currentUser) {
      signInAnonymously(auth).catch(console.error);
    } else {
      setUser(auth.currentUser);
      setToken(auth.currentUser.getIdToken());
    }
  }, [firebase.auth]);

  useEffect(() => {
    const auth = firebase.auth;
    onAuthStateChanged(auth, function (user) {
      if (!user) {
        setUser(null);
        setToken(null);
        return;
      }

      setUser(user);

      auth.currentUser.getIdToken().then(setToken).catch(console.error);
    });
  }, [firebase.auth]);

  return {
    user,
    token,
  };
}

export default useAnonymousLogin;
