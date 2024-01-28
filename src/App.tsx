import { useEffect, useReducer, useState } from "react";
import { AbilityScores } from "./Blocks/AbilityScores.tsx";
import Bio from "./Blocks/Bio.tsx";
import { ClassRecorder } from "./Blocks/ClassRecorder.tsx";
import { CombatBlock } from "./Blocks/Combat.tsx";
import { HitPoints } from "./Blocks/HitPoints.tsx";
import { Skills } from "./Blocks/Skills.tsx";
import Container from "./Components/Container.tsx";
import { DEFAULT_STATE } from "./DefaultState.tsx";
import { Blocks } from "./charSheet.tsx";
import "./constants.tsx";
import { FormContextProvider } from "./lib/FormContext.tsx";
import { reducer } from "./reducer.tsx";
import { Special } from "./Blocks/Special.tsx";
import { Feats } from "./Blocks/Feats.tsx";
import { Equipment } from "./Blocks/Equipment.tsx";
import { Magic } from "./Blocks/Magic.tsx";
import Button from "./Components/Button.tsx";
//firebase stuff
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  connectAuthEmulator,
  signOut,
} from "firebase/auth";
import { connectFirestoreEmulator, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyABsTpxdiwxaVsY3CfiyIOa9XGxNUnxqfU",
  authDomain: "sheetfinder-2fe23.firebaseapp.com",
  projectId: "sheetfinder-2fe23",
  storageBucket: "sheetfinder-2fe23.appspot.com",
  messagingSenderId: "88470754964",
  appId: "1:88470754964:web:16a699c1b091b3b349c681",
  measurementId: "G-C8M542N8XL",
});

const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://127.0.0.1:9099");
const provider = new GoogleAuthProvider();
let userCredential = await signInWithPopup(auth, provider);

const firestore = getFirestore(firebaseApp);
connectFirestoreEmulator(firestore, "127.0.0.1", 8080);

//end of firebase stuff

const initialize = (state: Blocks): Blocks => {
  return reducer(state, { type: "recalculate" });
};

const loadState = async (): Promise<Blocks> => {
  const snapshot = await getDoc(doc(firestore, "UserBoundCharacters/" + userCredential.user.uid));
  if (snapshot.exists()) {
    console.log("Loaded data from UserBoundCharacters/" + userCredential.user.uid);
    return snapshot.data() as Blocks;
  } else {
    console.error("Failed to load data. Doc doesn't exist");
    return DEFAULT_STATE;
  }
};

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (!userLoggedIn) {
        console.log(user);
        setUserLoggedIn(true);
      }
    } else {
      if (userLoggedIn) {
        setUserLoggedIn(false);
      }
    }
  });

  let defaultState = DEFAULT_STATE;
  useEffect(() => {
    (async () => {
      defaultState = await loadState();
    })();
  }, []);
  const [state, dispatch] = useReducer(reducer, defaultState, initialize);
  useEffect(() => {
    console.log("newState", state);
    saveState(state);
  }, [state]);

  function resetSheet() {
    dispatch({ type: "reset" });
  }

  const saveState = (state: Blocks) => {
    if (userLoggedIn) {
      setDoc(doc(firestore, "UserBoundCharacters/" + userCredential.user.uid), { state }, { merge: true })
        .then(() => {
          console.log("Succesfully saved to UserBoundCharacters/" + userCredential.user.uid);
        })
        .catch((error) => {
          console.error("Failed to save state with error: " + error);
        });
    }
  };

  return (
    <FormContextProvider dispatch={dispatch}>
      <Container>
        <h1 className="text-lg font-bold text-center mb-4">Pathfinder digital character sheet prototype</h1>
        <Button
          onClick={() => {
            if (confirm("Are you sure you want to reset the entire character sheet?")) {
              resetSheet;
            }
          }}
        >
          Reset character sheet
        </Button>
        {userLoggedIn ? (
          <Button
            onClick={() => {
              if (confirm("Are you sure you want to sign out?")) {
                signOut(auth);
              }
            }}
          >
            Sign out
          </Button>
        ) : (
          <Button
            onClick={async () => {
              signInWithPopup(auth, provider)
                .then((value) => {
                  userCredential = value;
                })
                .catch((error) => {
                  console.error("Sign in failed with error: " + error);
                });
            }}
          >
            Sign in
          </Button>
        )}
      </Container>
      {userLoggedIn ? (
        <Container>
          <Bio state={state.bio} />
          <ClassRecorder state={state.classRecorder} />
          <AbilityScores state={state.abilityBlock} />
          <HitPoints state={state.hitPoints} />
          <CombatBlock state={state} />
          <Skills state={state} />
          <Special state={state.special} />
          <Feats state={state.featList} />
          <Equipment state={state} />
          <Magic state={state.magic} />
        </Container>
      ) : (
        <></>
      )}
    </FormContextProvider>
  );
}
