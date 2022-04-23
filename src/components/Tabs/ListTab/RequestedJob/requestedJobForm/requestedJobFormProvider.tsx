import { firebase } from "@react-native-firebase/firestore"


export async function getJobDetailData(jobId) {
    let job_data =  (await firebase.firestore().collection("jobs").doc(jobId).get()).data()
    return job_data
}