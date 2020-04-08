import * as firebase from 'firebase/app'
import firebaseConfig from '../firebaseConfig'
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

// Add new users to db
export const addUser = (userId, displayName, email) => {
  return db.collection('users').doc(userId).set({
    name: displayName,
    email: email
  })
}

// Create new coOwnership group
export const addGroup = (userId, groupName) => {
  return db.collection('coOwnershipGroups').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: userId,
    groupName: groupName,
    users: [
      {
        userId: userId,
        name: userName
      }
    ]
  })
}

// Add new item to coOwnership group

// Get all associated coOwnership groups

// Get all associated items

// Get all item details

