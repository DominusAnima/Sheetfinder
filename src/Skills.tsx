import { Dispatch } from "react";
import { Blocks } from "./charSheet";
import { ReducerAction } from "./reducer";

export function Skills({state, dispatch}: {state: Blocks, dispatch: Dispatch<ReducerAction>}) {

  function handleChange(skillIndex: number, field: 'ranks' | 'misc', value: string) {
    dispatch({type: 'changeSkillField',payload: {skillIndex, field, value}})
  }

  function handleClassSkillToggle(skillIndex: number, value: string) {
    dispatch({type: 'toggleClassSkill', payload: {skillIndex, value}})
  }

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Skills</h2>
      <label>available ranks:{state.skills.remainRanks}/{state.skills.totalRanks}</label>
      <table>
        <thead>
          <tr>
            <th>trained skill</th>
            <th>class skill</th>
            <th>skill name</th>
            <th>ability used</th>
            <th>total</th>
            <th>ability bonus</th>
            <th>armor check penalty</th>
            <th>ranks</th>
            <th>misc</th>
          </tr>
        </thead>
        <tbody>
          {state.skills.skills.map((skill, i) => {
            return (
              <tr key={i}>
                <th><input type="checkbox" disabled defaultChecked={skill.trained} /></th>
                <th><input type="checkbox" defaultChecked={skill.classSkill} onChange={(e) => (handleClassSkillToggle(i, e.target.value))} /></th>
                <th>{skill.name}</th>
                <th>{skill.ability}</th>
                <th>{skill.totalBonus}</th>
                <th>{state.abilityBlock.abilities[skill.ability].mod}</th>
                <th>{skill.armorPenalty ? state.combat.armorCheckPenalty : '-'}</th>
                <th><input type="number" value={skill.ranks} onChange={(e) => (handleChange(i, 'ranks', e.target.value))} /></th>
                <th><input type="number" value={skill.misc} onChange={(e) => (handleChange(i, 'misc', e.target.value))} /></th>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}