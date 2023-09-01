import { Dispatch } from "react";
import { Blocks } from "../charSheet";
import { ReducerAction } from "../reducer";

export function Skills({
  state,
  dispatch,
}: {
  state: Blocks;
  dispatch: Dispatch<ReducerAction>;
}) {
  function handleChange(
    skillIndex: number,
    field: "ranks" | "misc",
    value: string
  ) {
    dispatch({
      type: "changeSkillField",
      payload: { skillIndex, field, value },
    });
  }

  function handleClassSkillToggle(skillIndex: number) {
    dispatch({ type: "toggleClassSkill", payload: { skillIndex } });
  }

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  function toggleDetail() {
    dispatch({ type: "toggleSkillDetail" });
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Skills</h2>
      <button onClick={toggleDetail}>toggle detail</button>
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
                    <th>{skill.trained ? "*" : ""}</th>
                    <th>
                      <input
                        type="checkbox"
                        defaultChecked={skill.classSkill}
                        onChange={() => handleClassSkillToggle(i)}
                      />
                    </th>
                    <th>{skill.name}</th>
                    <th>{skill.ability}</th>
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
