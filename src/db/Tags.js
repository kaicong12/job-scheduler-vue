import {collection, onSnapshot, query, where, getDocs, deleteDoc, addDoc} from "firebase/firestore";
import {db} from "@/firebase";
import { ref} from "vue";

const dbTag = collection(db, "tags")
const dbEmployeeTag = collection(db, "employeeTag")
const tagQuery = query(dbEmployeeTag)

const listTags = () => {
    const tags = ref([])
    const q = query(dbTag)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        tags.value = querySnapshot.docs.map((doc) => {
            const tag = doc.data()
            return {"id": doc.id, "value": tag.tag}
          })
        })

    return [unsubscribe, tags]
}

export const fetchTags = () => {
    const tags = ref([])
    const unsubscribe = onSnapshot(tagQuery, (querySnapshot) => {
        tags.value = querySnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
                'employeeID': data.employeeID,
                'tagName': data.tagName
            }
        })
    })

    return [unsubscribe, tags]
}

export const getTag = (employeeID) => {
    const tags = ref([])
    const tagQ = query(tagQuery, where("employeeID", "==", employeeID))
    const unsubscribe = onSnapshot(tagQ, (querySnapshot) => {
        tags.value = querySnapshot.docs.map((doc) => {
            return doc.data().tagName
        })
    })

    return [unsubscribe, tags]
}

export const removeTag = async (employeeID, tagName=null) => {
    let q = query(tagQuery,
        where("employeeID", "==", employeeID)
    )

    if (tagName !== null) {
        q = query(q, where("tagName", "==",  tagName))
    }

    const querySnapShot = await getDocs(q)
    querySnapShot.forEach((doc) => {
      deleteDoc(doc.ref)
    });
}

export const addTag = async (employeeID, tagName) => {
    await addDoc(dbEmployeeTag, {
        'employeeID': employeeID,
        'tagName': tagName
    })
}

export const [unsubListTag, allTags] = listTags()
export const [unsubTag, tags] = fetchTags()
