import {collection, addDoc} from "firebase/firestore";
import {db} from "@/firebase";


const dbBranchRequest = collection(db, "branchRequest")
const dbTagRequest = collection(db, "tagRequest")

export const requestBranch = async (employeeID, branchName) => {
    await addDoc(dbBranchRequest, {
        'employeeID': employeeID,
        'branch': branchName
    })
}

export const requestTag = async (employeeID, tagName) => {
    await addDoc(dbTagRequest, {
        'employeeID': employeeID,
        'tagName': tagName
    })
}