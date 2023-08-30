import './App.css'
import './constants.tsx'
import { useReducer } from 'react'
import { reducer } from './reducer.tsx'
import { DEFAULT_STATE } from './DefaultState.tsx'
import { Blocks } from './charSheet.tsx'
import { Bio } from './Blocks/Bio.tsx'
import { AbilityScores } from './Blocks/AbilityScores.tsx'
import { ClassRecorder } from './Blocks/ClassRecorder.tsx'
import { HitPoints } from './Blocks/HitPoints.tsx'
import { Skills } from './Blocks/Skills.tsx'
import { CombatBlock } from './Blocks/Combat.tsx'

const initialize = (state: Blocks): Blocks => {
  return reducer(state, {type: 'recalculate'});
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE, initialize);

  return (
    <>
      <h1>Pathfinder digital character sheet prototype</h1>
      <Bio state={state.bio} dispatch={dispatch}/>
      <AbilityScores state={state.abilityBlock} dispatch={dispatch} />
      <HitPoints state={state.hitPoints} dispatch={dispatch} />
      <ClassRecorder state={state.classRecorder} dispatch={dispatch} />
      <CombatBlock state={state} dispatch={dispatch} />
      <Skills state={state} dispatch={dispatch} />
    </>
    )
}