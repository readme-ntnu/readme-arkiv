import { useState, useEffect, useContext } from "react";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { FirebaseContext } from "../Firebase";

export const useAnonymousLogin = () => {
  const [user, setUser] = useState<User | null>();
  const [token, setToken] = useState<string | null>();
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    const auth = firebase.auth;
    if (!auth.currentUser) {
      signInAnonymously(auth).catch(console.error);
    } else {
      auth.currentUser.getIdToken().then((idToken) => {
        setUser(auth.currentUser);
        setToken(idToken);
      });
    }
  }, [firebase.auth]);

  useEffect(() => {
    const auth = firebase.auth;
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setUser(user);

        user
          .getIdToken()
          .then((token) => setToken(token))
          .catch(console.error);
      } else {
        setUser(null);
        setToken(null);
      }
    });
  }, [firebase.auth]);

  return {
    user,
    token,
  };
};
