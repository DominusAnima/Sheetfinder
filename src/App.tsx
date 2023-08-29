import './App.css'
import './constants.tsx'
import { useReducer } from 'react'
import { reducer } from './reducer.tsx'
import { DEFAULT_STATE } from './DefaultState.tsx'
import { Blocks } from './charSheet.tsx'
import { Bio } from './Bio.tsx'
import { AbilityScores } from './AbilityScores.tsx'
import { ClassRecorder } from './ClassRecorder.tsx'
import { HitPoints } from './HitPoints.tsx'
import { Skills } from './Skills.tsx'

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
      <Skills state={state} dispatch={dispatch} />
    </>
    )
}