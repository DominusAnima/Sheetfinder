import { Dispatch } from "react"
import { ClassRecordBlock } from "./charSheet"
import { ReducerAction } from "./reducer"

export function ClassRecorder({state, dispatch}: {state: ClassRecordBlock, dispatch: Dispatch<ReducerAction>}) {

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
              <td><input value={entry.bab} onChange={(e) => (handleChange(entry, 'bab', e.target.value))}/></td>
            </tr>
          )
        })}
      </tbody>
    </table>
    <button onClick={() => setEntries([...entries, DEFAULT_CLASS])}>dd entry</button>
    </>
  )
}