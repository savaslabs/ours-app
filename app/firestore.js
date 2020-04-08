import * as firebase from 'firebase/app'
import firebaseConfig from '../firebaseConfig'
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export const addGroup = (userId, groupName) => {
  return db.collection('coOwnershipGroups').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: userId,
    group: [
      {
        userId: userId,
        groupName: groupName
      }
    ]
  })
}
