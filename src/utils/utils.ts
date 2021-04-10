import { UpdateUserInAuthDb, UpdateUserInFirestore, UpdateUserPayload } from "../services/userService/userService.types";
import { logger } from "./logger";

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