import { Dispatch } from "react"
import { ClassRecordBlock } from "./charSheet"
import { ReducerAction } from "./reducer"

export function ClassRecorder({state, dispatch}: {state: ClassRecordBlock, dispatch: Dispatch<ReducerAction>}) {

  function handleChange(entryIndex: number, field: 'hitDie' | 'name' | 'bab' | 'skill' | 'favClassBonusType' | 'favClassBonus' | 'fort' | 'ref' | 'will' | 'levels', value: string) {
    dispatch({type: 'changeClassEntryField', payload: {entryIndex, field, value}})
  }

  return (
    <>
    <h2>Class Recorder</h2>
    <table>
      <thead>
        <tr>
          <th>HD</th>
          <th>Class Name</th>
          <th>BAB</th>
          <th>Skill</th>
          <th>Favoured Bonus Type</th>
          <th>Favoured Bonus</th>
          <th>Fort</th>
          <th>Ref</th>
          <th>Will</th>
          <th>Levels</th>
        </tr>
      </thead>
      <tbody>
        {state.entries.map((entry, i) => {
          return (
            <tr key={i}>
              <td><input value={entry.hitDie} onChange={(e) => (handleChange(i, 'hitDie', e.target.value))} /></td>
              <td><input value={entry.name} onChange={(e) => (handleChange(i, 'name', e.target.value))} /></td>
              <td><input type="number" value={entry.bab} onChange={(e) => (handleChange(i, 'bab', e.target.value))}/></td>
              <td><input type="number" value={entry.skill} onChange={(e) => (handleChange(i, 'skill', e.target.value))}/></td>
              <td><input value={entry.favClassBonusType} onChange={(e) => (handleChange(i, 'favClassBonusType', e.target.value))}/></td>
              <td><input type="number" value={entry.favClassBonus} onChange={(e) => (handleChange(i, 'favClassBonus', e.target.value))}/></td>
              <td><input type="number" value={entry.fort} onChange={(e) => (handleChange(i, 'fort', e.target.value))}/></td>
              <td><input type="number" value={entry.ref} onChange={(e) => (handleChange(i, 'ref', e.target.value))}/></td>
              <td><input type="number" value={entry.will} onChange={(e) => (handleChange(i, 'will', e.target.value))}/></td>
              <td><input type="number" value={entry.levels} onChange={(e) => (handleChange(i, 'levels', e.target.value))}/></td>
            </tr>
          )
        })}
      </tbody>
    </table>
    <button>dd entry</button>
    </>
  )
}