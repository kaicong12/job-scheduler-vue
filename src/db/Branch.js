import { ref } from 'vue';
import { db } from "@/firebase"
import { collection, query, getDocs, where, documentId, onSnapshot} from "firebase/firestore";

const dbShifts = collection(db, "shifts")
const dbEmployeeTag = collection(db, "employeeTag")
const dbBranchEmployee = collection(db, "branchEmployee")

export const fetchBranches = (employeeID) => {
    const branchID = ref([])
	const branchQuery = query(dbBranchEmployee, where("employeeID", "==", employeeID))

    const unsubscribe = onSnapshot(branchQuery, (querySnapshot) => {
        branchID.value = querySnapshot.docs.map((doc) => {
            return doc.data().branchID
          })
        })

	// returns a list of changing "branchID" array
    return [unsubscribe, branchID]
}


export const fetchTags = (employeeID) => {
    const tagNames = ref([])
	const tagQuery = query(dbEmployeeTag, where("employeeID", "==", employeeID))
    const unsubscribe = onSnapshot(tagQuery, (querySnapshot) => {
        tagNames.value = querySnapshot.docs.map((doc) => {
            return doc.data().tagName
        })
    })

	// returns a live "tags" array
    return [unsubscribe, tagNames]
}

export const filterShifts = (branchNames, tags, startDate, endDate=null) => {
	//date filter
	let q = query(dbShifts, where("date", ">=", startDate))
	if (endDate !== null) {
		q = query(q, where("date", "<=", endDate))
	}

	// branch filter
	q = query(q, where("branch", "in", branchNames))

	// tag filter
	tags.forEach((tag) => {
		q = query(q, where(`manpower.${tag}`, ">=", `filledManpower.${tag}`))
	})

	const shifts = ref([])
	const unsubscribe = onSnapshot(q, (querySnapshot) => {
        shifts.value = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
            'employeeID': data.employeeID,
            'tagName': data.tagName
        }})
    })

    //snapshot listener receives a new query snapshot whenever query result changes
    return [unsubscribe, shifts]
}

export async function getBranchName(branchID) {
    //query for branch based on brandID
    let userBranch = []
    if (branchID.length > 0) {
      const queryBranch = await getDocs(query(collection(db, "branch"), where(documentId(), "in", branchID)))
      queryBranch.forEach((doc) => {
        userBranch.push(doc.data().name)
      })
    }
    // Get Branch that user belongs to.
    return userBranch;
}
// defunc, replaced with getBranchName()
// export async function fetchUserBranch(employeeID) {
//     //query for branchID based on employeeID
//     const queryUserBranch = query(collection(db, "branchEmployee"), where("employeeID", "==", employeeID));
//     const queryBranchID = await getDocs(queryUserBranch);
//     let userBranchID = []
//     queryBranchID.forEach((doc) => {
//       userBranchID.push(doc.data().branchID)
//     })

//     //query for branch based on brandID
//     const queryBranch = await getDocs(query(collection(db, "branch"), where(documentId(), "in", userBranchID)))
//     let userBranch = []
//     queryBranch.forEach((doc) => {
//         userBranch.push(doc.data().name)
//     })

//     // Get Branch that user belongs to.
//     return userBranch;
// }

