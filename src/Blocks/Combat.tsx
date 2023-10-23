import { useState } from "react";
import EditButton from "../Components/EditButton";
import Field from "../Components/Field";
import InlineInput from "../Components/InlineInput";
import SectionTitle from "../Components/SectionTitle";
import { Blocks, SpeedList } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";
import { SPECIAL_SIZE_MODIFIER } from "../constants";

export function CombatBlock({ state }: { state: Blocks }) {
  const [editing, setEditing] = useState(false);
  const dispatch = useFormDispatch();
  function handleACChange(field: "dodge" | "deflect" | "natural" | "size" | "misc", value: string) {
    dispatch({ type: "changeACBonus", payload: { field, value } });
  }

  function handleSaveChange(saveType: "fort" | "ref" | "will", field: "enh" | "misc", value: string) {
    dispatch({ type: "changeSaveBonus", payload: { saveType, field, value } });
  }

  function handleAttackChange(attackType: "melee" | "ranged", field: "misc", value: string) {
    dispatch({
      type: "changeAttackBonus",
      payload: { attackType, field, value },
    });
  }

  function handleManeuverMiscChange(maneuverType: "combatBonus" | "combatDefense", value: string) {
    dispatch({
      type: "changeManeuverBonus",
      payload: { maneuverType, value },
    });
  }

  function handleSpeedChange(speedType: keyof SpeedList, value: string) {
    dispatch({ type: "changeSpeed", payload: { speedType, value } });
  }

  function handleInitChange(value: string) {
    dispatch({ type: "changeInit", payload: { value } });
  }

  return (
    <div className="mt-4">
      <SectionTitle title="Attacks & Defense">
        <EditButton editing={editing} onClick={() => setEditing((v) => !v)} />
      </SectionTitle>

      <div className="space-y-2 mt-4">
        <Field label="Armor Check Penalty" horizontal>
          <p className="flex-1 text-center value">{state.combat.armorCheckPenalty}</p>
        </Field>
        <Field label="Maximum DEX Bonus" horizontal>
          <p className="flex-1 text-center value">{state.combat.acBonuses.maxDex}</p>
        </Field>
        <Field label="Spell Failure Chance" horizontal>
          <p className="flex-1 text-center value">{state.combat.spellFail}</p>
        </Field>
      </div>

      <hr className="my-4" />

      <div className="space-y-2 mt-4">
        <Field label="Initiative" horizontal>
          <p className="flex-1 text-center value">{state.combat.initiative}</p>
          {editing && (
            <InlineInput
              className="flex-1 text-center"
              type="number"
              value={state.combat.initBonus}
              onChange={(e) => handleInitChange(e.target.value)}
            />
          )}
        </Field>
        <Field label="Speed" horizontal>
          <table>
            <thead>
              <tr>
                <th className="whitespace-nowrap w-20">Base</th>
                <th className="whitespace-nowrap w-20">Fly</th>
                <th className="whitespace-nowrap w-20">Swim</th>
                <th className="whitespace-nowrap w-20">Climb</th>
              </tr>
            </thead>
            <tbody>
              {editing ? (
                <tr>
                  <td>
                    <InlineInput
                      type="number"
                      value={state.combat.speed.base}
                      onChange={(e) => handleSpeedChange("base", e.target.value)}
                    />
                  </td>
                  <td>
                    <InlineInput
                      type="number"
                      value={state.combat.speed.fly}
                      onChange={(e) => handleSpeedChange("fly", e.target.value)}
                    />
                  </td>
                  <td>
                    <InlineInput
                      type="number"
                      value={state.combat.speed.swim}
                      onChange={(e) => handleSpeedChange("swim", e.target.value)}
                    />
                  </td>
                  <td>
                    <InlineInput
                      type="number"
                      value={state.combat.speed.climb}
                      onChange={(e) => handleSpeedChange("climb", e.target.value)}
                    />
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="text-center value">{state.combat.speed.base}</td>
                  <td className="text-center value">{state.combat.speed.fly}</td>
                  <td className="text-center value">{state.combat.speed.swim}</td>
                  <td className="text-center value">{state.combat.speed.climb}</td>
                </tr>
              )}
            </tbody>
          </table>
        </Field>
      </div>

      <hr className="my-4" />

      {/* It would be better to change the AC objects into something similar to saves and then put them in an array, so they can be more efficient to work with */}
      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Armor Class Type</th>
            <th className="whitespace-nowrap w-20">AC</th>
            <th className="whitespace-nowrap w-20">Touch</th>
            <th className="whitespace-nowrap w-20">Flat-Footed</th>
          </tr>
        </thead>
        {editing && (
          <tbody>
            <tr>
              <td>Base</td>
              <td className="text-center font-bold">10</td>
              <td className="text-center font-bold">10</td>
              <td className="text-center font-bold">10</td>
            </tr>
            <tr>
              <td>Armor</td>
              <td className="text-center value">{state.combat.acBonuses.armor}</td>
              <td className="text-center value">-</td>
              <td className="text-center value">{state.combat.acBonuses.armor}</td>
            </tr>
            <tr>
              <td>Shield</td>
              <td className="text-center value">{state.combat.acBonuses.shield}</td>
              <td className="text-center value">-</td>
              <td className="text-center value">{state.combat.acBonuses.shield}</td>
            </tr>
            <tr>
              <td>Dex</td>
              <td className="text-center value">
                {Math.min(state.combat.acBonuses.maxDex, state.abilityBlock.abilities.dex.mod)}
              </td>
              <td className="text-center value">
                {Math.min(state.combat.acBonuses.maxDex, state.abilityBlock.abilities.dex.mod)}
              </td>
              <td className="text-center value">-</td>
            </tr>
            <tr>
              <td>Size</td>
              <td colSpan={3}>
                <InlineInput
                  type="number"
                  value={state.combat.acBonuses.size}
                  onChange={(e) => handleACChange("size", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Dodge</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.acBonuses.dodge}
                  onChange={(e) => handleACChange("dodge", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.acBonuses.dodge}
                  onChange={(e) => handleACChange("dodge", e.target.value)}
                />
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Natural</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.acBonuses.natural}
                  onChange={(e) => handleACChange("natural", e.target.value)}
                />
              </td>
              <td></td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.acBonuses.natural}
                  onChange={(e) => handleACChange("natural", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Deflect</td>
              <td colSpan={3}>
                <InlineInput
                  type="number"
                  value={state.combat.acBonuses.deflect}
                  onChange={(e) => handleACChange("deflect", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Misc</td>
              <td colSpan={3}>
                <InlineInput
                  type="number"
                  value={state.combat.acBonuses.misc}
                  onChange={(e) => handleACChange("misc", e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        )}
        <tfoot>
          <tr>
            <td className="font-bold">Total</td>
            <td className="text-center value">{state.combat.ac}</td>
            <td className="text-center value">{state.combat.touchAC}</td>
            <td className="text-center value">{state.combat.flatFooted}</td>
          </tr>
        </tfoot>
      </table>

      <hr className="my-4" />

      <table className="table table--striped w-full">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Saving Throws</th>
            <th className="whitespace-nowrap w-20">Fortitude</th>
            <th className="whitespace-nowrap w-20">Reflex</th>
            <th className="whitespace-nowrap w-20">Will</th>
          </tr>
        </thead>
        {editing && (
          <tbody>
            <tr>
              <td>Class Base</td>
              <td className="text-center value">{state.classRecorder.totals.fort}</td>
              <td className="text-center value">{state.classRecorder.totals.ref}</td>
              <td className="text-center value">{state.classRecorder.totals.will}</td>
            </tr>
            <tr>
              <td>Ability</td>
              <td className="text-center value">{state.abilityBlock.abilities[state.combat.fort.ability].mod}</td>
              <td className="text-center value">{state.abilityBlock.abilities[state.combat.ref.ability].mod}</td>
              <td className="text-center value">{state.abilityBlock.abilities[state.combat.will.ability].mod}</td>
            </tr>
            <tr>
              <td>Enhance</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.fort.enh}
                  onChange={(e) => handleSaveChange("fort", "enh", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.ref.enh}
                  onChange={(e) => handleSaveChange("ref", "enh", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.will.enh}
                  onChange={(e) => handleSaveChange("will", "enh", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Misc</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.fort.misc}
                  onChange={(e) => handleSaveChange("fort", "misc", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.ref.misc}
                  onChange={(e) => handleSaveChange("ref", "misc", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.will.misc}
                  onChange={(e) => handleSaveChange("will", "misc", e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        )}
        <tfoot>
          <tr>
            <td className="font-bold">Total</td>
            <td className="text-center value">{state.combat.fort.total}</td>
            <td className="text-center value">{state.combat.ref.total}</td>
            <td className="text-center value">{state.combat.will.total}</td>
          </tr>
        </tfoot>
      </table>

      <hr className="my-4" />

      <table className="table table--striped w-full">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Attack</th>
            <th className="whitespace-nowrap w-20">Melee</th>
            <th className="whitespace-nowrap w-20">Ranged</th>
          </tr>
        </thead>
        {editing && (
          <tbody>
            <tr>
              <td>Base Attack Bonus</td>
              <td className="text-center value">{state.classRecorder.totals.bab}</td>
              <td className="text-center value">{state.classRecorder.totals.bab}</td>
            </tr>
            <tr>
              <td>Ability</td>
              <td className="text-center value">{state.abilityBlock.abilities[state.combat.melee.ability].mod}</td>
              <td className="text-center value">{state.abilityBlock.abilities[state.combat.ranged.ability].mod}</td>
            </tr>
            <tr>
              <td>Misc</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.melee.misc}
                  onChange={(e) => handleAttackChange("melee", "misc", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.ranged.misc}
                  onChange={(e) => handleAttackChange("ranged", "misc", e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        )}
        <tfoot>
          <tr>
            <td className="font-bold">Total</td>
            <td className="text-center value">{state.combat.melee.total}</td>
            <td className="text-center value">{state.combat.ranged.total}</td>
          </tr>
        </tfoot>
      </table>

      <hr className="my-4" />

      <table className="table table--striped w-full">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Combat Maneuver</th>
            <th className="whitespace-nowrap w-20">Offense</th>
            <th className="whitespace-nowrap w-20">Defense</th>
          </tr>
        </thead>
        {editing && (
          <tbody>
            <tr>
              <td>CMD base value</td>
              <td></td>
              <td className="text-center value">10</td>
            </tr>
            <tr>
              <td>Base Attack Bonus</td>
              <td className="text-center value">{state.classRecorder.totals.bab}</td>
              <td className="text-center value">{state.classRecorder.totals.bab}</td>
            </tr>
            <tr>
              <td>Ability Type</td>
              <td className="text-center value">{state.combat.combatBonus.ability}</td>
              <td className="text-center value">str & dex</td>
            </tr>
            <tr>
              <td>Ability Bonus</td>
              <td className="text-center value">
                {state.abilityBlock.abilities[state.combat.combatBonus.ability].mod}
              </td>
              <td className="text-center value">
                {state.abilityBlock.abilities.str.mod + state.abilityBlock.abilities.dex.mod}
              </td>
            </tr>
            <tr>
              <td>Dodge and Deflect Bonus</td>
              <td className="text-center value"></td>
              <td className="text-center value">
                {Number(state.combat.acBonuses.dodge) + Number(state.combat.acBonuses.deflect)}
              </td>
            </tr>
            <tr>
              <td>Special Size Modifier</td>
              <td className="text-center value">{SPECIAL_SIZE_MODIFIER[state.bio.size]}</td>
              <td className="text-center value">{SPECIAL_SIZE_MODIFIER[state.bio.size]}</td>
            </tr>
            <tr>
              <td>Misc</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.combatBonus.misc}
                  onChange={(e) => handleManeuverMiscChange("combatBonus", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.combatDefense.misc}
                  onChange={(e) => handleManeuverMiscChange("combatDefense", e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        )}
        <tfoot>
          <tr>
            <td className="font-bold">Total</td>
            <td className="text-center value">{state.combat.combatBonus.total}</td>
            <td className="text-center value">{state.combat.combatDefense.total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
