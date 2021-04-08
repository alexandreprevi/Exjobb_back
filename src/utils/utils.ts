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