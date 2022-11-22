import {ref} from "vue"
import { db } from "@/firebase"
import {collection, query, where, addDoc, getDocs, onSnapshot, deleteDoc} from "firebase/firestore";

const dbAvailability = collection(db, "employeeAvailability")
const eAvailabilityQuery = query(dbAvailability)

export const isAvailable =  (employeeID, shiftID) => {
    const availability = ref([])
    const q = query(eAvailabilityQuery,
        where("employeeID", "==", employeeID),
        where("shiftID", "==", shiftID)
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      availability.value = querySnapshot.docs.map((doc) => {
          return doc.data();
      });
    });

    return [unsubscribe, availability]
}

export const postAvailability = async (employeeID, shiftID) => {
    // check if this employee has indicated availability
    const q = query(dbAvailability,
        where("employeeID", "==", employeeID),
        where("shiftID", "==", shiftID)
    );

    const querySnapshot = await getDocs(q);
    // this employee has not been indicated availability on this shift
    if (querySnapshot.empty) {
        await addDoc(dbAvailability, {
          employeeID: employeeID,
          shiftID: shiftID
        });
    }
}

export const deleteAvailability = async (employeeID, shiftID) => {
    const q = query(dbAvailability,
        where("employeeID", "==", employeeID),
        where("shiftID", "==", shiftID)
    );

    const availabilityDocRef = await getDocs(q)
    // remove employee from a branch
    availabilityDocRef.forEach( (doc) => {
        deleteDoc(doc.ref)
    })
}
