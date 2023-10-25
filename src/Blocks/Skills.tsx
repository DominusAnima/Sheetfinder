import { useState } from "react";
import { Abilities, Blocks } from "../charSheet";
import { ABILITY_TYPES } from "../constants";
import { useFormDispatch } from "../lib/useFormDispatch";
import SectionTitle from "../Components/SectionTitle";
import EditButton from "../Components/EditButton";
import FlatButton from "../Components/FlatButton";
import { FaPlusCircle } from "react-icons/fa";
import Field from "../Components/Field";
import InlineInput from "../Components/InlineInput";
import Button from "../Components/Button";

export function Skills({ state }: { state: Blocks }) {
  const [showDetails, setShowDetails] = useState(false);
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

  function handleSelectChange(index: number, value: keyof Abilities) {
    dispatch({ type: "changeSkillAbil", payload: { index, value } });
  }

  return (
    <div className="mt-4">
      <SectionTitle title="Skills">
        <EditButton editing={showDetails} onClick={() => setShowDetails((v) => !v)} />
        <FlatButton onClick={() => dispatch({ type: "addSkill" })}>
          <FaPlusCircle />
        </FlatButton>
      </SectionTitle>

      <Field label="Available ranks: " horizontal>
        <p className="flex-1 text-center value">
          {state.skills.remainRanks}/{state.skills.totalRanks}
        </p>
      </Field>

      <hr className="my-4" />

      <table className="table table--striped w-full mt-4">
        <thead>
          {showDetails ? (
            <tr>
              <th className="whitespace-nowrap">trained</th>
              <th className="whitespace-nowrap">class</th>
              <th className="whitespace-nowrap">skill name</th>
              <th className="whitespace-nowrap">ability</th>
              <th className="whitespace-nowrap">total</th>
              <th className="whitespace-nowrap">ability bonus</th>
              <th className="whitespace-nowrap">AC penalty</th>
              <th className="whitespace-nowrap">ranks</th>
              <th className="whitespace-nowrap">misc</th>
            </tr>
          ) : (
            <tr>
              <th className="whitespace-nowrap">trained</th>
              <th className="whitespace-nowrap">skill name</th>
              <th className="whitespace-nowrap">total</th>
            </tr>
          )}
        </thead>
        <tbody>
          {showDetails
            ? state.skills.skills.map((skill, i) => {
                return (
                  <tr key={i}>
                    {skill.editable ? (
                      <td className="text-center">
                        <input
                          type="checkbox"
                          defaultChecked={skill.trained}
                          onChange={() => handleSkillToggle(i, "trained")}
                        />
                      </td>
                    ) : (
                      <td className="text-center font-bold">{skill.trained ? "*" : ""}</td>
                    )}
                    <td className="text-center">
                      <input
                        type="checkbox"
                        defaultChecked={skill.classSkill}
                        onChange={() => handleSkillToggle(i, "classSkill")}
                      />
                    </td>
                    {skill.editable ? (
                      <td>
                        <InlineInput value={skill.name} onChange={(e) => handleChange(i, "name", e.target.value)} />
                      </td>
                    ) : (
                      <td className="text-center font-bold">{skill.name}</td>
                    )}

                    {skill.editable ? (
                      <td className="text-center">
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
                      </td>
                    ) : (
                      <td className="text-center">{skill.ability}</td>
                    )}

                    <td className="text-center value">
                      {!skill.trained || (skill.trained && Number(skill.ranks) > 0) ? skill.totalBonus : "-"}
                    </td>
                    <td className="text-center value">{state.abilityBlock.abilities[skill.ability].mod}</td>
                    <td className="text-center value">{skill.armorPenalty ? state.combat.armorCheckPenalty : "-"}</td>
                    <td>
                      <InlineInput
                        type="number"
                        value={skill.ranks}
                        onChange={(e) => handleChange(i, "ranks", e.target.value)}
                      />
                    </td>
                    <td>
                      <InlineInput
                        type="number"
                        value={skill.misc}
                        onChange={(e) => handleChange(i, "misc", e.target.value)}
                      />
                    </td>
                    {skill.editable && (
                      <td>
                        <Button
                          size="small"
                          onClick={() => {
                            if (confirm("Are you sure?")) {
                              dispatch({ type: "removeSkill", payload: { skillIndex: i } });
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })
            : state.skills.skills.map((skill, i) => {
                return (
                  <tr key={i}>
                    <td className="text-center font-bold">{skill.trained ? "*" : ""}</td>
                    <td className="text-center font-bold">{skill.name}</td>
                    <td className="text-center value">
                      {!skill.trained || (skill.trained && Number(skill.ranks) > 0) ? skill.totalBonus : "-"}
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}
