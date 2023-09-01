import { Dispatch } from "react";
import { Abilities, AbilityBlock } from "../charSheet";
import { ABILITY_TYPES } from "../constants";
import { ReducerAction } from "../reducer";

export function AbilityScores({
  state,
  dispatch,
}: {
  state: AbilityBlock;
  dispatch: Dispatch<ReducerAction>;
}) {
  const handleChange = (
    ability: keyof Abilities,
    valueKey: "base" | "enh" | "size" | "misc" | "damage" | "drain",
    value: string
  ) => {
    dispatch({
      type: "changeAbilities",
      payload: { ability, field: valueKey, value },
    });
  };

  const handleClick = () => {
    dispatch({ type: "abilToggle" });
  };

  return (
    <>
      <h2>Ability scores</h2>
      <button onClick={handleClick}>toggle detailed stats</button>
      <table>
        <thead>
          <tr>
            <th>Ability Score</th>
            <th>Total</th>
            <th>Mod</th>
            {state.toggleDetail && (
              <>
                <th>Base</th>
                <th>Enhance</th>
                <th>Size</th>
                <th>Misc</th>
                <th>Damage</th>
                <th>Drain</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {ABILITY_TYPES.map((ability) => (
            <tr key={ability}>
              <td>{ability}</td>
              <td>{state.abilities[ability].total}</td>
              <td>{state.abilities[ability].mod}</td>
              {state.toggleDetail && (
                <>
                  <td>
                    <input
                      type="number"
                      value={state.abilities[ability].base}
                      onChange={(e) =>
                        handleChange(ability, "base", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={state.abilities[ability].enh}
                      onChange={(e) =>
                        handleChange(ability, "enh", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={state.abilities[ability].size}
                      onChange={(e) =>
                        handleChange(ability, "size", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={state.abilities[ability].misc}
                      onChange={(e) =>
                        handleChange(ability, "misc", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={state.abilities[ability].damage}
                      onChange={(e) =>
                        handleChange(ability, "damage", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={state.abilities[ability].drain}
                      onChange={(e) =>
                        handleChange(ability, "drain", e.target.value)
                      }
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
