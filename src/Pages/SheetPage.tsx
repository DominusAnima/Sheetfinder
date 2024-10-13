import { AbilityScores } from "../Blocks/AbilityScores";
import Bio from "../Blocks/Bio";
import { ClassRecorder } from "../Blocks/ClassRecorder";
import { CombatBlock } from "../Blocks/Combat";
import { Equipment } from "../Blocks/Equipment";
import { Feats } from "../Blocks/Feats";
import { HitPoints } from "../Blocks/HitPoints";
import { Magic } from "../Blocks/Magic";
import { Skills } from "../Blocks/Skills";
import { Special } from "../Blocks/Special";
import Button from "../Components/Button";
import Container from "../Components/Container";
import { FormContextProvider } from "../lib/FormContext";
import { useReducer, useEffect, useState } from "react";
import { reducer } from "../reducer";
import { Blocks } from "../charSheet";
import { loadState, saveState } from "../firebase";
import { DEFAULT_STATE } from "../DefaultState";
import Field from "../Components/Field";

const initialize = (state: Blocks): Blocks => {
  return reducer(state, { type: "recalculate" });
};

export function SheetPage({
  userId,
  docId,
  docIdSetter,
  userIdSetter,
}: {
  userId: string;
  docId: number;
  docIdSetter: React.Dispatch<React.SetStateAction<number | undefined>>;
  userIdSetter: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [state, setState] = useState<Blocks>();
  useEffect(() => {
    async function fetchState() {
      try {
        const defaultState = await loadState(docId);
        setState(defaultState);
      } catch (error) {
        console.error(error);
        setState(DEFAULT_STATE);
      }
    }
    fetchState();
  }, []);

  if (state == undefined) {
    return <label className="text-center">Loading</label>;
  } else {
    return (
      <LoadedSheetPage
        userId={userId}
        docId={docId}
        docIdSetter={docIdSetter}
        userIdSetter={userIdSetter}
        initState={state}
      />
    );
  }
}

function LoadedSheetPage({
  userId,
  docId,
  docIdSetter,
  userIdSetter,
  initState,
}: {
  userId: string;
  docId: number;
  docIdSetter: React.Dispatch<React.SetStateAction<number | undefined>>;
  userIdSetter: React.Dispatch<React.SetStateAction<string | undefined>>;
  initState: Blocks;
}) {
  const [state, dispatch] = useReducer(reducer, initState, initialize);

  useEffect(() => {
    const handleUnload = (event: any) => {
      // doesn't work. Saves arguments when the listener is created and uses those instead of the actual values of state and docPath.
      // This means that it tries to save the state as it was when the page loaded and the listener was created, not as it is now.
      //saveState(state, docPath);
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  useEffect(() => {
    console.log("newState", state);
  }, [state]);

  function resetSheet() {
    dispatch({ type: "reset" });
  }

  return (
    <FormContextProvider dispatch={dispatch}>
      <Field className="text-center">
        <Button
          onClick={() => {
            if (confirm("Are you sure you want to reset the entire character sheet?")) {
              resetSheet();
            }
          }}
        >
          Reset character sheet
        </Button>
        <Button
          onClick={async () => {
            if (confirm("Are you sure you want to sign out?")) {
              await saveState(state, docId, userId);
              userIdSetter(undefined);
              docIdSetter(undefined);
            }
          }}
        >
          Sign out
        </Button>
        <Button
          onClick={() => {
            async function unload() {
              await saveState(state, docId, userId);
              docIdSetter(undefined);
            }
            unload();
          }}
        >
          Change Character Sheet
        </Button>
        <Button
          onClick={async () => {
            await saveState(state, docId, userId);
          }}
        >
          Save Character sheet
        </Button>
      </Field>
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
    </FormContextProvider>
  );
}
