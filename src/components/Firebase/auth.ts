import { useState, useEffect, useContext } from "react";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { FirebaseContext } from "../Firebase";

function useAnonymousLogin() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
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
