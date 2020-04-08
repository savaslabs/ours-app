import React, { useState, useContext } from 'react'
import { AuthContext } from '../../App'
import { withRouter } from 'react-router-dom'

import * as firebase from 'firebase/app'
import * as FirestoreService from '../../firestore'

const Join = ({ history }) => {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setErrors] = useState('')

  const Auth = useContext(AuthContext)

  const handleForm = (e) => {
    e.preventDefault()

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((cred) => {
            /* Create new user in Firestore
            with same userid as Firebase user
            */
            const userId = cred.user.uid;
            FirestoreService.addUser(userId, displayName, email);
            console.log(cred)
            history.push('/me')
            if (cred.user) Auth.setLoggedIn(true)
          })
          .catch((e) => {
            setErrors(e.message)
          })
      })
  }

  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .signInWithPopup(provider)
          .then((cred) => {
            /* Create new user in Firestore
            with same userid as Firebase user
            */
            const userId = cred.user.uid;
            const displayName = cred.user.displayName;
            const email = cred.user.email
            FirestoreService.addUser(userId, displayName, email);
            console.log(cred)
            history.push('/me')
            Auth.setLoggedIn(true)
          })
          .catch((e) => setErrors(e.message))
      })
  }
  return (
    <div>
      <h1>Join</h1>
      <form onSubmit={(e) => handleForm(e)}>
        <input
          type='displayName'
          placeholder='Display name'
          name='displayName'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input
          type='email'
          placeholder='email'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='password'
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <hr />
        <button type='button' onClick={() => handleGoogleLogin()}>
          <img
            src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
            alt='logo'
          />
          Join With Google
        </button>

        <button type='submit'>Create Account</button>

        <span>{error}</span>
      </form>
    </div>
  )
}

export default withRouter(Join)
