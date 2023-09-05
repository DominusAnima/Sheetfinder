import { useEffect, useReducer } from "react";
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

const initialize = (state: Blocks): Blocks => {
  return reducer(state, { type: "recalculate" });
};

const loadState = (): Blocks => {
  try {
    const jsonString = localStorage.getItem("SHEET_DATA");
    if (!jsonString) return DEFAULT_STATE;
    const data = JSON.parse(jsonString);
    return data as Blocks;
  } catch (error) {
    return DEFAULT_STATE;
  }
};

const saveState = (state: Blocks) => {
  localStorage.setItem("SHEET_DATA", JSON.stringify(state));
};

export default function App() {
  const defaultState = loadState();
  const [state, dispatch] = useReducer(reducer, defaultState, initialize);
  useEffect(() => {
    console.log("newState", state);
    saveState(state);
  }, [state]);

  return (
    <FormContextProvider dispatch={dispatch}>
      <Container>
        <h1 className="text-lg font-bold text-center mb-4">Pathfinder digital character sheet prototype</h1>
        <Bio state={state.bio} />
        <AbilityScores state={state.abilityBlock} />
        <HitPoints state={state.hitPoints} />
        <ClassRecorder state={state.classRecorder} />
        <CombatBlock state={state} />
        <Skills state={state} />
        <Special state={state.special} />
      </Container>
    </FormContextProvider>
  );
}
