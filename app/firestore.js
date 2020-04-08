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

/*
Create new coOwnership group:
Create new group with group name
Find user in db based on matching email
If user exists, add user reference
If user does not exist, invite user to join app
Add items
*/
export const addGroup = (userId, group, coOwners, items) => {
  return db
    .collection('groups')
    .add({
      created: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userId,
      groupName: group
    })
    .then((docRef) => {
      coOwners.forEach((coOwner) => {
        return findUser(coOwner.email)
          .then((querySnapshot) => querySnapshot.docs)
          .then((matchingItem) => {
            if (matchingItem.length === 0) {
              console.log(`${coOwner.email} doesnt exist`)
              return db
                .collection('groups')
                .doc(docRef.id)
                .collection('users')
                .add({
                  email: coOwner.email,
                  name: coOwner.firstName
                })
            } else {
              console.log(`${coOwner.email} does exist`)
              return db
                .collection('groups')
                .doc(docRef.id)
                .collection('users')
                .doc(matchingItem[0].id)
                .set({
                  email: coOwner.email,
                  name: coOwner.firstName
                })
            }
          })
          .then(() => {
            items.forEach((item) => {
              return db
                .collection('groups')
                .doc(docRef.id)
                .collection('items')
                .add({
                  name: item.itemName,
                  cost: item.cost
                })
            })
          })
      })
    })
}

// Find if user exists in system
export const findUser = (email) => {
  return db
    .collection('users')
    .where('email', '==', email)
    .get()
}

// Add new item to coOwnership group
export const addItemToGroup = (item, groupId, userId) => {
  return getGroupItems(groupId)
    .then((querySnapshot) => querySnapshot.docs)
    .then((groupItems) =>
      groupItems.find(
        (groupItem) =>
          groupItem.data().name.toLowerCase() === item.toLowerCase()
      )
    )
    .then((matchingItem) => {
      if (!matchingItem) {
        return db.collection('groups').doc(groupId).collection('items').add({
          name: item,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: userId
        })
      }
    })
}

// Get all associated coOwnership groups
export const getGroups = (userId) => {
  return db
    .collection('groups')
    .doc(userId)
    .get()
}

// Get all associated items
export const getGroupItems = (groupId) => {
  return db
    .collection('groups')
    .doc(groupId)
    .collection('items')
    .get()
}

// Get all item details
export const streamItems = (groupId, observer) => {
  return db
    .collection('groups')
    .doc(groupId)
    .collection('items')
    .onSnapshot(observer)
}
