import { useState } from "react";
import EditButton from "../Components/EditButton";
import Field from "../Components/Field";
import InlineInput from "../Components/InlineInput";
import SectionTitle from "../Components/SectionTitle";
import { ArmorType, Blocks, SpeedList } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";
import { SPECIAL_SIZE_MODIFIER } from "../constants";
import Select from "../Components/Select";

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

  function handleCombatFieldChange(field: "initBonus" | "spellres" | "dmgRed" | "res", value: string) {
    dispatch({ type: "changeCombatField", payload: { field, value } });
  }

  function handleArmorChange(
    equipType: "armor" | "shield",
    field: "name" | "baseACBonus" | "maxDex" | "checkPenalty" | "spellFail" | "weight" | "description",
    value: string
  ) {
    dispatch({ type: "changeArmorField", payload: { equipType, field, value } });
  }

  function handleArmorTypeChange(value: ArmorType) {
    dispatch({ type: "changeArmorType", payload: { value } });
  }

  function handleWeaponChange(
    weaponType: "mainWeapon" | "offhand",
    field: "name" | "damage" | "enh" | "crit" | "range" | "weight" | "description",
    value: string
  ) {
    dispatch({ type: "changeWeaponField", payload: { weaponType, field, value } });
  }

  const ARMOR_TYPES: { [K in ArmorType]: string } = {
    none: "",
    light: "Light",
    medium: "Medium",
    heavy: "Heavy",
  };

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
              onChange={(e) => handleCombatFieldChange("initBonus", e.target.value)}
            />
          )}
        </Field>
        <Field label="Speed" horizontal>
          <table className="flex-1 text-center">
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

      <div className="space-y-2 mt-4">
        <Field label="Spell Resistance" horizontal>
          {editing ? (
            <InlineInput
              type="number"
              value={state.combat.spellres}
              onChange={(e) => handleCombatFieldChange("spellres", e.target.value)}
            />
          ) : (
            <p className="flex-1 text-center value">{state.combat.spellres}</p>
          )}
        </Field>
        <Field label="Damage Reduction" horizontal>
          {editing ? (
            <InlineInput
              value={state.combat.dmgRed}
              onChange={(e) => handleCombatFieldChange("dmgRed", e.target.value)}
            />
          ) : (
            <p className="flex-1 text-center value">{state.combat.dmgRed}</p>
          )}
        </Field>
        <Field label="Energy Resistance" horizontal>
          {editing ? (
            <InlineInput value={state.combat.res} onChange={(e) => handleCombatFieldChange("res", e.target.value)} />
          ) : (
            <p className="flex-1 text-center value">{state.combat.res}</p>
          )}
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

      <hr className="my-4" />

      <table className="table table--striped w-full">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Defensive Equipment</th>
            <th className="whitespace-nowrap w-20">Armor</th>
            <th className="whitespace-nowrap w-20">Shield</th>
          </tr>
        </thead>
        {editing ? (
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                <InlineInput
                  value={state.combat.equipment.armor.name}
                  onChange={(e) => handleArmorChange("armor", "name", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  value={state.combat.equipment.shield.name}
                  onChange={(e) => handleArmorChange("shield", "name", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>AC Bonus</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.armor.baseACBonus}
                  onChange={(e) => handleArmorChange("armor", "baseACBonus", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.shield.baseACBonus}
                  onChange={(e) => handleArmorChange("shield", "baseACBonus", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Max Dex</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.armor.maxDex}
                  onChange={(e) => handleArmorChange("armor", "maxDex", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.shield.maxDex}
                  onChange={(e) => handleArmorChange("shield", "maxDex", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Armor Check Penalty</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.armor.checkPenalty}
                  onChange={(e) => handleArmorChange("armor", "checkPenalty", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.shield.checkPenalty}
                  onChange={(e) => handleArmorChange("shield", "checkPenalty", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Spell Fail</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.armor.spellFail}
                  onChange={(e) => handleArmorChange("armor", "spellFail", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.shield.spellFail}
                  onChange={(e) => handleArmorChange("shield", "spellFail", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Type</td>
              <td>
                <Select
                  value={state.combat.equipment.armor.armorType}
                  onChange={(e) => handleArmorTypeChange(e.target.value as ArmorType)}
                >
                  {Object.values(ArmorType).map((type) => (
                    <option key={type} value={type}>
                      {ARMOR_TYPES[type]}
                    </option>
                  ))}
                </Select>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.armor.weight}
                  onChange={(e) => handleArmorChange("armor", "weight", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.shield.weight}
                  onChange={(e) => handleArmorChange("shield", "weight", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>
                <InlineInput
                  value={state.combat.equipment.armor.description}
                  onChange={(e) => handleArmorChange("armor", "description", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  value={state.combat.equipment.shield.description}
                  onChange={(e) => handleArmorChange("shield", "description", e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td>Name</td>
              <td className="text-center value">{state.combat.equipment.armor.name}</td>
              <td className="text-center value">{state.combat.equipment.shield.name}</td>
            </tr>
            <tr>
              <td>Notes</td>
              <td className="text-center value">{state.combat.equipment.armor.description}</td>
              <td className="text-center value">{state.combat.equipment.shield.description}</td>
            </tr>
          </tbody>
        )}
      </table>

      <hr className="my-4" />

      <table className="table table--striped w-full">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Weapons</th>
            <th className="whitespace-nowrap w-20">Main</th>
            <th className="whitespace-nowrap w-20">Offhand</th>
          </tr>
        </thead>
        {editing ? (
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                <InlineInput
                  value={state.combat.equipment.mainWeapon.name}
                  onChange={(e) => handleWeaponChange("mainWeapon", "name", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  value={state.combat.equipment.offhand.name}
                  onChange={(e) => handleWeaponChange("offhand", "name", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Attack Modifier</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.mainWeapon.enh}
                  onChange={(e) => handleWeaponChange("mainWeapon", "enh", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.offhand.enh}
                  onChange={(e) => handleWeaponChange("offhand", "enh", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Damage</td>
              <td>
                <InlineInput
                  value={state.combat.equipment.mainWeapon.damage}
                  onChange={(e) => handleWeaponChange("mainWeapon", "damage", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  value={state.combat.equipment.offhand.damage}
                  onChange={(e) => handleWeaponChange("offhand", "damage", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Critical</td>
              <td>
                <InlineInput
                  value={state.combat.equipment.mainWeapon.crit}
                  onChange={(e) => handleWeaponChange("mainWeapon", "crit", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  value={state.combat.equipment.offhand.crit}
                  onChange={(e) => handleWeaponChange("offhand", "crit", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Range</td>
              <td>
                <InlineInput
                  value={state.combat.equipment.mainWeapon.range}
                  onChange={(e) => handleWeaponChange("mainWeapon", "range", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  value={state.combat.equipment.offhand.range}
                  onChange={(e) => handleWeaponChange("offhand", "range", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.mainWeapon.weight}
                  onChange={(e) => handleWeaponChange("mainWeapon", "weight", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  type="number"
                  value={state.combat.equipment.offhand.weight}
                  onChange={(e) => handleWeaponChange("offhand", "weight", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>
                <InlineInput
                  value={state.combat.equipment.mainWeapon.description}
                  onChange={(e) => handleWeaponChange("mainWeapon", "description", e.target.value)}
                />
              </td>
              <td>
                <InlineInput
                  value={state.combat.equipment.offhand.description}
                  onChange={(e) => handleWeaponChange("offhand", "description", e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td>Name</td>
              <td className="text-center value">{state.combat.equipment.mainWeapon.name}</td>
              <td className="text-center value">{state.combat.equipment.offhand.name}</td>
            </tr>
            <tr>
              <td>Attack Modifiers</td>
              <td className="text-center value">{state.combat.equipment.mainWeapon.enh}</td>
              <td className="text-center value">{state.combat.equipment.offhand.enh}</td>
            </tr>
            <tr>
              <td>Damage</td>
              <td className="text-center value">{state.combat.equipment.mainWeapon.damage}</td>
              <td className="text-center value">{state.combat.equipment.offhand.damage}</td>
            </tr>
            <tr>
              <td>Critical</td>
              <td className="text-center value">{state.combat.equipment.mainWeapon.crit}</td>
              <td className="text-center value">{state.combat.equipment.offhand.crit}</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
