import { Abilities, Blocks } from "../charSheet";
import { ABILITY_TYPES } from "../constants";
import { useFormDispatch } from "../lib/useFormDispatch";

export function Skills({ state }: { state: Blocks }) {
  const dispatch = useFormDispatch();
  function handleChange(skillIndex: number, field: "name" | "ranks" | "misc", value: string) {
    if (
      !(
        field === "ranks" &&
        (Number(value) - Number(state.skills.skills[skillIndex].ranks) > Number(state.skills.remainRanks) ||
          Number(value) > state.classRecorder.totals.levels ||
          Number(value) < 0)
      )
    ) {
      dispatch({
        type: "changeSkillField",
        payload: { skillIndex, field, value },
      });
    }
  }

  function handleSkillToggle(skillIndex: number, field: "classSkill" | "trained") {
    dispatch({ type: "toggleSkill", payload: { skillIndex, field } });
  }

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  function toggleDetail() {
    dispatch({ type: "toggleSkillDetail" });
  }

  function addSkill() {
    dispatch({ type: "addSkill" });
  }

  function handleSelectChange(index: number, value: keyof Abilities) {
    dispatch({ type: "changeSkillAbil", payload: { index, value } });
  }

  function removeSkill(skillIndex: number) {
    dispatch({ type: "removeSkill", payload: { skillIndex } });
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Skills</h2>
      <button onClick={toggleDetail}>toggle detail</button>
      <button onClick={addSkill}>Add Skill</button>
      <label>
        available ranks:{state.skills.remainRanks}/{state.skills.totalRanks}
      </label>
      <table>
        <thead>
          {state.skills.detailToggle ? (
            <tr>
              <th>trained</th>
              <th>class</th>
              <th>skill name</th>
              <th>ability</th>
              <th>total</th>
              <th>ability bonus</th>
              <th>AC penalty</th>
              <th>ranks</th>
              <th>misc</th>
            </tr>
          ) : (
            <tr>
              <th>trained</th>
              <th>skill name</th>
              <th>total</th>
            </tr>
          )}
        </thead>
        <tbody>
          {state.skills.detailToggle
            ? state.skills.skills.map((skill, i) => {
                return (
                  <tr key={i}>
                    {skill.editable ? (
                      <td>
                        <input
                          type="checkbox"
                          defaultChecked={skill.trained}
                          onChange={() => handleSkillToggle(i, "trained")}
                        />
                      </td>
                    ) : (
                      <td>{skill.trained ? "*" : ""}</td>
                    )}
                    <td>
                      <input
                        type="checkbox"
                        defaultChecked={skill.classSkill}
                        onChange={() => handleSkillToggle(i, "classSkill")}
                      />
                    </td>
                    <td>
                      {skill.editable ? (
                        <input value={skill.name} onChange={(e) => handleChange(i, "name", e.target.value)} />
                      ) : (
                        skill.name
                      )}
                    </td>
                    <td>
                      {skill.editable ? (
                        <select
                          value={skill.ability}
                          onChange={(e) => handleSelectChange(i, e.target.value as keyof Abilities)}
                        >
                          {Object.values(ABILITY_TYPES).map((abilType) => {
                            return (
                              <option key={abilType} value={abilType}>
                                {abilType}
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        skill.ability
                      )}
                    </td>
                    <td>{!skill.trained || (skill.trained && Number(skill.ranks) > 0) ? skill.totalBonus : "-"}</td>
                    <td>{state.abilityBlock.abilities[skill.ability].mod}</td>
                    <td>{skill.armorPenalty ? state.combat.armorCheckPenalty : "-"}</td>
                    <td>
                      <input
                        type="number"
                        value={skill.ranks}
                        onChange={(e) => handleChange(i, "ranks", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={skill.misc}
                        onChange={(e) => handleChange(i, "misc", e.target.value)}
                      />
                    </td>
                    {skill.editable && (
                      <td>
                        <button onClick={() => removeSkill(i)}>Remove</button>
                      </td>
                    )}
                  </tr>
                );
              })
            : state.skills.skills.map((skill, i) => {
                return (
                  <tr key={i}>
                    <td>{skill.trained ? "*" : ""}</td>
                    <td>{skill.name}</td>
                    <td>{!skill.trained || (skill.trained && Number(skill.ranks) > 0) ? skill.totalBonus : "-"}</td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}
