import { ref } from 'vue';
import { db } from "@/firebase"
import {collection, query, onSnapshot, where, addDoc, getDocs, deleteDoc, doc, getDoc} from "firebase/firestore";

const employeeQuery = query(collection(db, "employee"))
const branchColRef = collection(db, "branch")
const branchQuery = query(branchColRef)
const dbBranchEmployee = collection(db, "branchEmployee")


export const getEmployee =  async (pk) => {
    const docRef = doc(db, "employee", pk);
    const docSnap = await getDoc(docRef);

    return docSnap.data()
}

export const listEmployees = () => {
    const employees = ref([])
    const unsubscribe = onSnapshot(employeeQuery, (querySnapshot) => {
        employees.value = querySnapshot.docs.map((doc) => {
            const employee = doc.data()
            return {
                "id": doc.id,
                "firstName": employee.firstName,
                "lastName": employee.lastName,
                "fullName": `${employee.firstName} ${employee.lastName}`,
                "emailAddress": employee.emailAddress,
                "contactNo": employee.contactNo,
                "address1": employee.address1,
                "address2": employee.address2,
                "address3": employee.address3,
                "hasProfileImage": employee.hasProfileImage
            }
          })
        })

    return [unsubscribe, employees]
}

export const fetchBranches = () => {
    const branches = ref([])
    const unsubscribe = onSnapshot(branchQuery, (querySnapshot) => {
        branches.value = querySnapshot.docs.map((doc) => {
            const branch = doc.data()
            return {"id": doc.id, "name": branch.name}
          })
        })

    return [unsubscribe, branches]
}

export const fetchAssignments = () => {
    const assignments = ref([])
    const q = query(dbBranchEmployee)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        assignments.value = querySnapshot.docs.map((doc) => {
            const assignment = doc.data()
            return {"id": doc.id, "branchID": assignment.branchID, "employeeID": assignment.employeeID}
          })
        })

    return [unsubscribe, assignments]
}

export const fetchBranchAssignment = (employeeID, branchOptions) => {
    const employeeBranch = ref([])
    const q = query(dbBranchEmployee, where("employeeID", "==", employeeID))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        employeeBranch.value = querySnapshot.docs.map((doc) => {
            const branchID = doc.data().branchID
            // only going to return one value
            const branchNames = branchOptions.filter((branch) => {
              return branch.id === branchID;
            })
            return branchNames[0].value
          })
        })

    return [unsubscribe, employeeBranch]
}

export const createBranchAssignment = async (employeeID, branchID) => {
    // check if this employee is already assigned to this branch
    const q = query(dbBranchEmployee,
        where("employeeID", "==", employeeID),
        where("shiftID", "==", branchID)
    );

    const querySnapshot = await getDocs(q);
    // this employee has not been assigned to the branch
    if (querySnapshot.empty) {
        await addDoc(dbBranchEmployee, {
          employeeID: employeeID,
          branchID: branchID
        });
    }
}

export const removeBranchAssignment = async (employeeID, branchID=null) => {
    let employeeQuery = query(dbBranchEmployee,
          where("employeeID", "==", employeeID)
      )

    if (branchID !== null) {
        employeeQuery = query(employeeQuery,
            where("branchID", "==", branchID)
        )}

    const employeeDocRef = await getDocs(employeeQuery)
    // remove employee from a branch
    employeeDocRef.forEach( (doc) => {
    deleteDoc(doc.ref)
    })
}


export const [unsubEmployee, employees] = listEmployees()
export const [unsubBranch, branches] = fetchBranches()
export const [unsubAssignments, assignments] = fetchAssignments()
