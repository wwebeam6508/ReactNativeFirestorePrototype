import { firebase } from "@react-native-firebase/firestore";

export function getCreatedJobData(uid) {
    return firebase.firestore().collection('jobs').where("uid", "==", uid).orderBy("dateCreated", "desc")
}