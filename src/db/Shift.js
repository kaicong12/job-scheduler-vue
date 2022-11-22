import { ref } from 'vue';
import { db } from "@/firebase"
import {collection, query, onSnapshot, where, getDocs, doc, getDoc, addDoc, deleteDoc} from "firebase/firestore";

const db_shifts = collection(db, "shifts")
const shiftQuery = query(db_shifts);
const db_eAssignment = collection(db, "employeeAssignments")
const db_eAvailability = collection(db, "employeeAvailability")
const queryAssignments = query(db_eAssignment)
const queryAvailability = query(db_eAvailability)

const fetchShifts = () => {
    const shifts = ref([])
    const unsubscribe = onSnapshot(shiftQuery, (querySnapshot) => {
        shifts.value = querySnapshot.docs.map((doc) => {
            const shift = doc.data()
            // console.log(shift)
            return {
                'id': doc.id,
                'title': shift.title,
                'date': shift.date,
                'startTime': shift.startTime,
                'endTime': shift.endTime,
                'branch': shift.branch,
                'manpower': shift.manpower,
                'filledManpower': shift.filledManpower
            }
        })
    })

    return [unsubscribe, shifts]
}

const fetchAvailability = () => {
    const availability = ref([])
    const unsubscribe = onSnapshot(queryAvailability, (querySnapshot) => {
        availability.value = querySnapshot.docs.map((doc) => {
            const available = doc.data()
            // console.log(available)
            return {
                'id': doc.id,
                'employeeID': available.employeeID,
                'shiftID': available.shiftID,
            }
        })
    })

    return [unsubscribe, availability]
}

const fetchAssignment = () => {
    const assignment = ref([])
    const unsubscribe = onSnapshot(queryAssignments, (querySnapshot) => {
        assignment.value = querySnapshot.docs.map((doc) => {
            const assign = doc.data()
            return {
                'id': doc.id,
                'employeeID': assign.employeeID,
                'shiftID': assign.shiftID,
            }
        })
    })

    return [unsubscribe, assignment]
}

export const filterShiftAvailability = async (shiftID) => {
    const AssignmentQuery = query(
        db_eAssignment,
        where("shiftID", "==", shiftID)
    )

    // no need to subscribe a listener for this
    const querySnapshot = await getDocs(AssignmentQuery)
    const assignedWorkers = querySnapshot.docs.map((doc) => {
        const assignment = doc.data()
        return assignment.employeeID
    })

    let availabilityQuery = query(
        db_eAvailability,
        where("shiftID", "==", shiftID)
    )

    if (assignedWorkers.length > 0) {
        availabilityQuery = query(availabilityQuery, where("employeeID", "not-in", assignedWorkers))
    }

    const availableWorkers = ref([])
    const unsubscribe = onSnapshot(availabilityQuery, (snapShot) => {
        availableWorkers.value = snapShot.docs.map((doc) => {
            return doc.data().employeeID
        })
    })

    return [unsubscribe, availableWorkers]
}

export const getShift = async (shiftID) => {
    const docRef = doc(db, "shifts", shiftID);
    const docSnap = await getDoc(docRef);

    return docSnap.data()
}

export const filterShiftAssignee = (shiftID) => {
    const assigneeIDs = ref([])
    const AssignmentQuery = query(db_eAssignment, where("shiftID", "==", shiftID))
    const unsubscribe = onSnapshot(AssignmentQuery, (querySnapshot) => {
        assigneeIDs.value = querySnapshot.docs.map((doc) => {
            const assignment = doc.data()
            return assignment.employeeID
        })
    })

    return [unsubscribe, assigneeIDs]
}

export const filterShift = (shifts, branchNames, tags, date=null, assigned, userID) => {
    let filteredShifts = shifts.filter((shift) => {
        let result = true
        //filter by startDate & endDate
        if (date !== null) {
            const startDate = date[0]
            const endDate = date[1]
            if (new Date(shift.date) < startDate || new Date(shift.date) > endDate) {
                return false
            }
        }

        if (!branchNames.includes(shift.branch)) {
            return false
        }
        //filter by whether shift has been fully assigned
        let tempResult = false
        tags.forEach((tag) => {
            if (shift.filledManpower[tag] < shift.manpower[tag]) {
                tempResult = true
            }
        })
        if (tempResult === false) {
            return false
        }

        //filter by whether shift has already been assigned to employee
        assigned.forEach((assign) => {
            if (shift.id === assign.shiftID && userID === assign.employeeID) {
                result = false
            }
        })
        return result
    })
    function compareDate(shiftA, shiftB) {
        if (shiftA.date < shiftB.date) {
            return -1;
        }
        if (shiftA.date > shiftB.date) {
            return 1;
        }
        return 0
    }
    filteredShifts = filteredShifts.sort(compareDate)
    return filteredShifts
}

export const availShift = (filteredShifts, available, userID) => {
    let availShifts = filteredShifts.filter((shift) => {
        let result = false
        available.forEach((avail) => {
            if (shift.id === avail.shiftID && userID === avail.employeeID) {
                result = true
            }
        })
        return result
    })
    return availShifts
}

export const createAssignment = async (shiftID, employeeID) => {
    const q = query(db_eAssignment,
        where("employeeID", "==", employeeID),
        where("shiftID", "==", shiftID)
    );

    const querySnapshot = await getDocs(q);
    // this employee has not been assigned the shift
    if (querySnapshot.empty) {
        await addDoc(db_eAssignment, {
          employeeID: employeeID,
          shiftID: shiftID
        });
    }
}

export const deleteAssignment = async (shiftID, employeeID) => {
    // check if workers moved to "availableWorkers" have been assigned a shift
    const q = query(db_eAssignment,
        where("employeeID", "==", employeeID),
        where("shiftID", "==", shiftID)
    );

    const querySnapshot = await getDocs(q);
    // this employee has been assigned a shift
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref)
        });
    }
}

export const [unsubShift, shifts] = fetchShifts();
export const [unsubAvailable, availability] = fetchAvailability();
export const [unsubAssignment, assignment] = fetchAssignment();
