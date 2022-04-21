import { firebase } from "@react-native-firebase/firestore";

export function getRequestedJobData(uid) {
    return firebase.firestore().collection('jobrequsters').where("from", "==", uid).orderBy("dateRequest", "desc")
}

export async function getJobsDetail(job_id) {

    let job_data =  (await firebase.firestore().collection("jobs").doc(job_id).get()).data()
    const user_data = await getUserDetail(job_data.uid)
    job_data.owner = user_data
    return job_data
}

export async function getUserDetail(uid) {
    const user_data =  (await (firebase.firestore().collection("users").doc(uid).get())).data()
    return {
        firstname: user_data.firstname,
        lastname: user_data.lastname,
        sex: user_data.sex,
        avatar: user_data.avatar
    }
}