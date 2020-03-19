import * as firebase from 'firebase/app'
import { useState, useEffect } from 'react'

import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCLhIKGOYZilQuXirB_W-1UmKNfQygETqw",
  authDomain: "readme-arkiv.firebaseapp.com",
  databaseURL: "https://readme-arkiv.firebaseio.com",
  projectId: "readme-arkiv",
  storageBucket: "readme-arkiv.appspot.com",
  messagingSenderId: "884912593534",
  appId: "1:884912593534:web:994587a01eb1bd1d85d62f"
};

firebase.initializeApp(firebaseConfig);

export function useAnonymousLogin() {
  const [user, setUser] = useState()
  const [token, setToken] = useState()

  useEffect(() => {
    firebase.auth().signInAnonymously().catch(console.error)
  }, [])

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        setUser(null)
        setToken(null)
        return
      }

      setUser(user)

      firebase.auth().currentUser.getIdToken()
      .then(setToken)
      .catch(console.error)
    });
  }, [])

  return {
      user,
      token,
    }
}
