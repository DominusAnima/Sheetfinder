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

export default function App() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE, initialize);
    
  function initialize(state: Blocks): Blocks {
    return reducer(state, {type: 'recalculate'});
  }

  return (
    <>
      <h1>Pathfinder digital character sheet prototype</h1>
      <Bio state={state.bio} dispatch={dispatch}/>
      <AbilityScores state={state.abilityBlock} dispatch={dispatch} />
      <HitPoints state={state.hitPoints} dispatch={dispatch} />
      {/* <ClassRecorder state={state.classRecorder} dispatch={dispatch} /> */}
    </>
    )
}