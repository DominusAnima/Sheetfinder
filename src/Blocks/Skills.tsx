import { Dispatch } from "react";
import { Abilities, Blocks } from "../charSheet";
import { ReducerAction } from "../reducer";
import { ABILITY_TYPES } from "../constants";

export function Skills({
  state,
  dispatch,
}: {
  state: Blocks;
  dispatch: Dispatch<ReducerAction>;
}) {
  function handleChange(
    skillIndex: number,
    field: "name" | "ranks" | "misc",
    value: string
  ) {
    dispatch({
      type: "changeSkillField",
      payload: { skillIndex, field, value },
    });
  }

  function handleSkillToggle(
    skillIndex: number,
    field: "classSkill" | "trained"
  ) {
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

  function handleSelectChange(index: number, value: string) {
    dispatch({ type: "changeSkillAbil", payload: { index, value } });
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
                      <th>
                        <input
                          type="checkbox"
                          defaultChecked={skill.trained}
                          onChange={(e) => handleSkillToggle(i, "trained")}
                        />
                      </th>
                    ) : (
                      <th>{skill.trained ? "*" : ""}</th>
                    )}
                    <th>
                      <input
                        type="checkbox"
                        defaultChecked={skill.classSkill}
                        onChange={() => handleSkillToggle(i, "classSkill")}
                      />
                    </th>
                    <th>
                      {skill.editable ? (
                        <input
                          value={skill.name}
                          onChange={(e) =>
                            handleChange(i, "name", e.target.value)
                          }
                        />
                      ) : (
                        skill.name
                      )}
                    </th>
                    <th>
                      {skill.editable ? (
                        <select
                          value={skill.ability}
                          onChange={(e) =>
                            handleSelectChange(i, e.target.value)
                          }
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
                    </th>
                    <th>
                      {!skill.trained ||
                      (skill.trained && Number(skill.ranks) > 0)
                        ? skill.totalBonus
                        : "-"}
                    </th>
                    <th>{state.abilityBlock.abilities[skill.ability].mod}</th>
                    <th>
                      {skill.armorPenalty
                        ? state.combat.armorCheckPenalty
                        : "-"}
                    </th>
                    <th>
                      <input
                        type="number"
                        value={skill.ranks}
                        onChange={(e) =>
                          handleChange(i, "ranks", e.target.value)
                        }
                      />
                    </th>
                    <th>
                      <input
                        type="number"
                        value={skill.misc}
                        onChange={(e) =>
                          handleChange(i, "misc", e.target.value)
                        }
                      />
                    </th>
                  </tr>
                );
              })
            : state.skills.skills.map((skill, i) => {
                return (
                  <tr key={i}>
                    <th>{skill.trained ? "*" : ""}</th>
                    <th>{skill.name}</th>
                    <th>
                      {!skill.trained ||
                      (skill.trained && Number(skill.ranks) > 0)
                        ? skill.totalBonus
                        : "-"}
                    </th>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}
