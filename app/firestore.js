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
Create new group if unique group name
Find user in db based on matching email
If user exists, add user reference
If user does not exist, invite user to join app
Add items
*/
export const addGroup = (userId, group, coOwners, items) => {
  return checkGroupName(group)
    .then((querySnapshot) => querySnapshot.docs)
    .then((matchingItem) => {
      if (matchingItem.length === 0) {
        console.log(`${group} is not taken`)
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
                      .update({
                        coOwners: firebase.firestore.FieldValue.arrayUnion(
                          coOwner.email
                        )
                      })
                  } else {
                    console.log(`${coOwner.email} does exist`)
                    return db
                      .collection('groups')
                      .doc(docRef.id)
                      .update({
                        coOwners: firebase.firestore.FieldValue.arrayUnion(
                          matchingItem[0].id
                        )
                      })
                  }
                })
              })
            return items.forEach(item => {
              return db
                .collection('groups')
                .doc(docRef.id)
                .collection('items')
                .add({
                  created: firebase.firestore.FieldValue.serverTimestamp(),
                  createdBy: userId,
                  name: item.itemName,
                  cost: item.cost,
                  paidOff: item.paidOff,
                  endDate: item.endDate,
                  primaryFunder: item.primaryFunder
                })
            })
          })
      } else {
        console.log(`${group} is taken. Chose a new groupName`)
      }
    })
}

// Check if groupName is already used
export const checkGroupName = (groupName) => {
  return db
    .collection('groups')
    .where('groupName', '==', groupName)
    .get()
}

// Find if user exists in system
export const findUser = (email) => {
  return db
    .collection('users')
    .where('email', '==', email)
    .get()
}

// Add new item to existing coOwnership group
export const addItemToGroup = (items, groupName, userId) => {
  return checkGroupName(groupName)
    .then((querySnapshot) => querySnapshot.docs)
    .then((matchingItem) => {
      if (matchingItem.length !== 0) {
        items.forEach((item) => {
          return db
            .collection('groups')
            .doc(matchingItem[0].id)
            .collection('items')
            .add({
              created: firebase.firestore.FieldValue.serverTimestamp(),
              createdBy: userId,
              name: item.itemName,
              cost: item.cost,
              paidOff: item.paidOff,
              endDate: item.endDate,
              primaryFunder: item.primaryFunder
            })
        })
      }
    })
}

// Get all associated coOwnership groups with currentUser
export const streamAssociatedGroups = (userId, observer) => {
  return db
    .collection('groups')
    .where('coOwners', 'array-contains', userId)
    .onSnapshot(observer)
}

// Get item by itemId
export const getItem = (itemId, observer) => {
  return db
    .collection('groups')
    .doc()
    .collection('items')
    .doc(itemId)
    .onSnapshot(observer)
}

// Get all items associated with groupId
export const streamItems = (groupId, observer) => {
  return Array.isArray(groupId) ?
    groupId.forEach((id, index) => {
      return db
        .collection('groups')
        .doc(id)
        .collection('items')
        .onSnapshot(observer)
    })
  : db
    .collection('groups')
    .doc(groupId)
    .collection('items')
    .onSnapshot(observer)
}
