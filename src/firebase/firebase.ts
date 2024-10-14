import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { DocumentData, QueryDocumentSnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc } from "firebase/firestore";
import { Blocks } from "../charSheet";

const firebaseConfig = {
  apiKey: "AIzaSyABsTpxdiwxaVsY3CfiyIOa9XGxNUnxqfU",
  authDomain: "sheetfinder-2fe23.firebaseapp.com",
  projectId: "sheetfinder-2fe23",
  storageBucket: "sheetfinder-2fe23.appspot.com",
  messagingSenderId: "88470754964",
  appId: "1:88470754964:web:16a699c1b091b3b349c681",
  measurementId: "G-C8M542N8XL"
};

/*

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const provider = new GoogleAuthProvider();

const firestore = getFirestore(firebaseApp);

// Signs the user in and returns their unique uid.
export const loginGoogle = async (): Promise<string> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user.uid;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Logs out the user
export const logOutGoogle = () => {
  signOut(auth);
}

// Activates whenever a user logs in, or logs out
export const monitorAuthState = (setUserId: React.Dispatch<React.SetStateAction<string | undefined>>, setDataId: React.Dispatch<React.SetStateAction<string | undefined>>) => {
  onAuthStateChanged(auth, user => {
    if(user) {
      console.log("Setting user state to: " + user.uid);
      setUserId(user.uid);
    } else {
      console.log("Resetting Id states to undefined.")
      setUserId(undefined);
      setDataId(undefined);
    }
  })
}

// Loads an existing document or returns default state if the doc doesn't exist.
export const loadState = async (docPath: string): Promise<Blocks> => {
  const snapshot = await getDoc(doc(firestore, docPath));
  if (snapshot.exists()) {
    console.log("Loaded data from " + docPath);
    return snapshot.data() as Blocks;
  } else {
    return Promise.reject("Failed to load " + docPath + " - Doc doesn't exist.");
  }
};

// Updates an existing document with the new data.
// Displays error in console if it fails.
export const saveState = (state: Blocks, docPath: string) => {
  setDoc(doc(firestore, docPath), state, {merge: true})
    .then(() => {
      console.log("Succesfully updated " + docPath);
    })
    .catch((error) => {
      console.error("Failed to save state with error: " + error);
    });
};

// Saves data to a new document
// Returns the id of the new document
export const saveNew = async (state: Blocks, collectionName: string ): Promise<string> => {
  try {
    const newDoc = await addDoc( collection(firestore, collectionName), state);
    console.log("Saved a new document to: " + newDoc.path)
    return newDoc.id;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Returns a list of docs in the provided collection.
export async function getDocList(collectionName: string): Promise<QueryDocumentSnapshot<DocumentData, DocumentData>[]> {
  try {
    const docsQuery = query(collection(firestore, collectionName));

    try {
      const querySnapshot = await getDocs(docsQuery);
      querySnapshot.forEach((snap) => {
        console.log('Document ', snap.id, 'contains', snap.data() as Blocks);
      })
      return querySnapshot.docs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

// Deletes the given document
export async function deleteCharacter(docPath: string) {
  try {
    await deleteDoc(doc(firestore, docPath));
  } catch (error) {
    console.error("Failed to delete character with error: " + error)
  }
}
  
*/
// custom backend calls -----------------------------------------------------------

import { backendUrl } from "./backendSecure";

// Signs the user in and returns their email.
export const login = async (email: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${backendUrl}/login-user?email=${email}&password=${password}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    const data = await response.json();
    return data.email;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Registers a new user and returns their email.
export const register = async (email: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${backendUrl}/register-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      throw new Error("Failed to register");
    }
    const data = await response.json();
    return data.email;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Loads an existing document.
export const loadState = async (sheetId: number): Promise<Blocks> => {
  try {
    const response = await fetch(`${backendUrl}/get-character?sheetId=${sheetId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to load state");
    }
    const data = await response.json();
    return data.result as Blocks;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Updates an existing document with the new data.
// Displays error in console if it fails.
export const saveState = async (state: Blocks, sheetId: number, owner: string) => {
  try {
    // updating sql database is troublesome, so I will just delete the old one and create a new one
    await fetch(`${backendUrl}/delete-character?sheetId=${sheetId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sheetId })
    });
    await fetch(`${backendUrl}/store-new-character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ state, owner, sheetId })
    });
  } catch (error) {
    console.error("Failed to save state with error: " + error);
  }
};

// Saves data to the database
// Returns the id of the core table entry
export const saveNew = async (state: Blocks, owner: string): Promise<number> => {
  try {
    const response = await fetch(`${backendUrl}/store-new-character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ state, owner })
    });
    if (!response.ok) {
      throw new Error("Failed to save new document");
    }
    const data = await response.json();
    return data.result as number;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Returns a list of docs belonging to the provided user.
export async function getDocList(owner: string): Promise<{ id: number, create_time: string, name: string }[]> {
  try {
    // response.results has form [{id: number, create_time: string, name: string}, ...]
    const response = await fetch(`${backendUrl}/get-character-list?owner=${owner}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get document list");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    throw error;
  }
}

// Deletes the given document
export async function deleteCharacter(sheetId: number) {
  try {
    const response = await fetch(`${backendUrl}/delete-character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sheetId })
    });
    if (!response.ok) {
      throw new Error("Failed to delete character");
    }
    console.log("Successfully deleted character");
  } catch (error) {
    console.error("Failed to delete character with error: " + error);
  }
}