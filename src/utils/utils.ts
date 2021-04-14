import firebase from 'firebase-admin'
import { ReactionPayload } from '../services/reactionService/reactionService.types'
import { UpdateUserInAuthDb, UpdateUserInFirestore, UpdateUserPayload } from '../services/userService/userService.types'

export const prepareUserObjectForAuthDb = (userChanges: UpdateUserPayload): UpdateUserInAuthDb => {
  const allowedFields = ['email', 'displayName', 'photoURL']

  const filtered = Object.keys(userChanges)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = userChanges[key]
      return obj
    }, {})
  return filtered
}

export const prepareUserObjectForFirestore = (userChanges: UpdateUserPayload): UpdateUserInFirestore => {
  const allowedFields = ['email', 'displayName', 'photoURL', 'firstName', 'lastName']

  const filtered = Object.keys(userChanges)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = userChanges[key]
      return obj
    }, {})
  return filtered
}

export const generateIdWithTimestamp = (): string => {
  const day = new Date().getDate()
  const year = new Date().getFullYear().toString().substr(-2)
  const month = new Date().getMonth() + 1
  const hour = new Date().getHours()
  const minutes = new Date().getMinutes()
  const seconds = new Date().getSeconds()
  const weekDay = new Date().getDay()
  const random2DigitsNumber = Math.floor(10 + (99 - 10) * Math.random())
  return `H${year}${month}${day}${weekDay}${hour}${minutes}${seconds}-${random2DigitsNumber}`.toString()
}

export const prepareReactionData = (reaction: ReactionPayload, uid: string) => {
  let incrementMethod: FirebaseFirestore.FieldValue
  let arrayMethod: FirebaseFirestore.FieldValue
  if (reaction.action === 'add') {
    incrementMethod = firebase.firestore.FieldValue.increment(1)
    arrayMethod = firebase.firestore.FieldValue.arrayUnion(uid)
  } else if (reaction.action === 'remove') {
    incrementMethod = firebase.firestore.FieldValue.increment(-1)
    arrayMethod = firebase.firestore.FieldValue.arrayRemove(uid)
  }
  switch (reaction.name) {
    case 'like':
      return {
        'reactions.like.total': incrementMethod,
        'reactions.like.authorsIds': arrayMethod,
      }
    case 'dislike':
      return {
        'reactions.dislike.total': incrementMethod,
        'reactions.dislike.authorsIds': arrayMethod,
      }
    case 'laugh':
      return {
        'reactions.laugh.total': incrementMethod,
        'reactions.laugh.authorsIds': arrayMethod,
      }
    case 'fire':
      return {
        'reactions.fire.total': incrementMethod,
        'reactions.fire.authorsIds': arrayMethod,
      }
    case 'rocket':
      return {
        'reactions.rocket.total': incrementMethod,
        'reactions.rocket.authorsIds': arrayMethod,
      }
    case 'confused':
      return {
        'reactions.confused.total': incrementMethod,
        'reactions.confused.authorsIds': arrayMethod,
      }
    case 'applause':
      return {
        'reactions.applause.total': incrementMethod,
        'reactions.applause.authorsIds': arrayMethod,
      }
    case 'angry':
      return {
        'reactions.angry.total': incrementMethod,
        'reactions.angry.authorsIds': arrayMethod,
      }
  }
}

export const userIsOwner = (requestAuthorid: string, documentAuthorId: string): boolean => {
  return requestAuthorid === documentAuthorId
}
