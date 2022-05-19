import { firebase } from "@react-native-firebase/firestore"


export async function getJobDetailData(jobId) {
    let job_data =  (await firebase.firestore().collection("jobs").doc(jobId).get()).data()
    return job_data
}

export async function getTasksData(jobId) {
    let task_data =  (await firebase.firestore().collection("jobs").doc(jobId).collection('task').orderBy('dateCreated','asc').get())
    let task = []
    task_data.forEach((snap)=>{
        const data = snap.data()
        task.push(data)
    })
    return task
}

export function updateJobDetailData(jobId, params) {
    return firebase.firestore().doc(`jobs/${jobId}`).update(params)
}