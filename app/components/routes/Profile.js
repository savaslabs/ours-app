import React, { useContext } from 'react'
import { AuthContext } from '../../App'

import * as firebase from 'firebase/app'

function Profile() {
  const Auth = useContext(AuthContext)
  const { isLoggedIn } = useContext(AuthContext)

  console.log(firebase.auth().currentUser.uid)

  const signOut = (e) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        Auth.setLoggedIn(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
  <React.Fragment>
    <h1>Profile Page</h1>
    {isLoggedIn && <button onClick={signOut}>Sign Out</button>}
  </React.Fragment>
  )
}

export default Profile
