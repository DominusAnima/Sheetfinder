import cx from "classnames";
import React, { useState } from "react";
import EditButton from "../Components/EditButton";
import InlineInput from "../Components/InlineInput";
import SectionTitle from "../Components/SectionTitle";
import { Abilities, AbilityBlock } from "../charSheet";
import { ABILITY_TYPES } from "../constants";
import { useFormDispatch } from "../lib/useFormDispatch";

const ABILITY_LABELS: { [key in keyof Abilities]: string } = {
  cha: "Charisma",
  con: "Constitution",
  dex: "Dexterity",
  int: "Intelligence",
  str: "Strength",
  wis: "Wisdom",
};

type ValueKey = "base" | "enh" | "size" | "misc" | "damage" | "drain";

export function AbilityScores({ state }: { state: AbilityBlock }) {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useFormDispatch();
  const handleChange = (ability: keyof Abilities, valueKey: ValueKey, value: string) => {
    dispatch({
      type: "changeAbilities",
      payload: { ability, field: valueKey, value },
    });
  };

  const input = (ability: keyof Abilities, value: ValueKey) => {
    return (
      <div className="flex flex-col flex-1">
        <span className="text-xs text-center">{value}</span>
        <InlineInput
          type="number"
          value={state.abilities[ability][value]}
          onChange={(e) => handleChange(ability, value, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="mt-4">
      <SectionTitle title="Ability Scores">
        <EditButton editing={showDetails} onClick={() => setShowDetails((v) => !v)} />
      </SectionTitle>

      <table className="w-full mt-4 table table--striped">
        {!showDetails && (
          <thead>
            <tr>
              <th />
              <th className="w-20">Total</th>
              <th className="w-20">Mod</th>
            </tr>
          </thead>
        )}
        <tbody>
          {ABILITY_TYPES.map((ability) => (
            <React.Fragment key={ability}>
              <tr>
                <th
                  className={cx("text-left text-sm", { "font-normal": !showDetails })}
                  title={ABILITY_LABELS[ability]}
                >
                  {ABILITY_LABELS[ability]}
                </th>
                <td className="text-center value">
                  {showDetails && "Total: "}
                  {state.abilities[ability].total}
                </td>
                <td className="text-center value">
                  {showDetails && "Mod: "}
                  {state.abilities[ability].mod}
                </td>
              </tr>
              {showDetails && (
                <tr>
                  <td colSpan={3}>
                    <div className="flex justify-end gap-1 pb-4">
                      {input(ability, "base")}
                      {input(ability, "enh")}
                      {input(ability, "size")}
                      {input(ability, "misc")}
                      {input(ability, "damage")}
                      {input(ability, "drain")}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
