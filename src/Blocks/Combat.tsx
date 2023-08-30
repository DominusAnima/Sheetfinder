import { Dispatch } from "react";
import { Blocks } from "../charSheet";
import { ReducerAction } from "../reducer";

export function CombatBlock({state, dispatch}: {state: Blocks, dispatch: Dispatch<ReducerAction>}) {

  function handleACChange(field: 'dodge' | 'deflect' | 'natural' | 'size' | 'misc', value: string) {
    dispatch({type: 'changeACBonus', payload: {field, value}})
  }

  function handleSaveChange(saveType: 'fort' | 'ref' | 'will', field: 'enh' | 'misc', value: string) {
    dispatch({type: 'changeSaveBonus', payload: {saveType, field, value}}) 
  }

  function handleAttackChange(attackType: 'melee' | 'ranged', field: 'misc', value: string) {
    dispatch({type: 'changeAttackBonus', payload: {attackType, field, value}})
  }

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Attacks & Defense</h2>
      <label>Armor Check Penalty: {state.combat.armorCheckPenalty}</label>
      <label>Maximum DEX Bonus: {state.combat.acBonuses.maxDex}</label>
      <label>Spell Failure Chance: {state.combat.spellFail}</label>
      <table>
        <thead>
          <tr>
            <td>Armor Class Type</td>
            <td>Total</td>
            <td>Base</td>
            <td>Armor</td>
            <td>Shield</td>
            <td>Dex</td>
            <td>Size</td>
            <td>Dodge</td>
            <td>Natural</td>
            <td>Deflect</td>
            <td>Misc</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* It would be better to change the AC objects into something similar to saves and then put them in an array, so they can be more efficient to work with */}
            <td>AC</td>
            <td>{state.combat.ac}</td>
            <td>= 10</td>
            <td>{state.combat.acBonuses.armor}</td>
            <td>{state.combat.acBonuses.shield}</td>
            <td>{Math.min(state.combat.acBonuses.maxDex, state.abilityBlock.abilities.dex.mod)}</td>
            <td><input value={state.combat.acBonuses.size} onChange={(e) => (handleACChange('size', e.target.value))} /></td>
            <td><input value={state.combat.acBonuses.dodge} onChange={(e) => (handleACChange('dodge', e.target.value))} /></td>
            <td><input value={state.combat.acBonuses.natural} onChange={(e) => (handleACChange('natural', e.target.value))} /></td>
            <td><input value={state.combat.acBonuses.deflect} onChange={(e) => (handleACChange('deflect', e.target.value))} /></td>
            <td><input value={state.combat.acBonuses.misc} onChange={(e) => (handleACChange('misc', e.target.value))} /></td>
          </tr>
          <tr>
            <td>Touch</td>
            <td>{state.combat.touchAC}</td>
            <td>= 10</td>
            <td></td>
            <td></td>
            <td>{Math.min(state.combat.acBonuses.maxDex, state.abilityBlock.abilities.dex.mod)}</td>
            <td><input value={state.combat.acBonuses.size} onChange={(e) => (handleACChange('size', e.target.value))} /></td>
            <td><input value={state.combat.acBonuses.dodge} onChange={(e) => (handleACChange('dodge', e.target.value))} /></td>
            <td></td>
            <td><input value={state.combat.acBonuses.deflect} onChange={(e) => (handleACChange('deflect', e.target.value))} /></td>
            <td><input value={state.combat.acBonuses.misc} onChange={(e) => (handleACChange('misc', e.target.value))} /></td>
          </tr>
          <tr>
            <td>Flat-Footed</td>
            <td>{state.combat.flatFooted}</td>
            <td>= 10</td>
            <td>{state.combat.acBonuses.armor}</td>
            <td>{state.combat.acBonuses.shield}</td>
            <td></td>
            <td><input value={state.combat.acBonuses.size} onChange={(e) => (handleACChange('size', e.target.value))} /></td>
            <td></td>
            <td><input value={state.combat.acBonuses.natural} onChange={(e) => (handleACChange('natural', e.target.value))} /></td>
            <td><input value={state.combat.acBonuses.deflect} onChange={(e) => (handleACChange('deflect', e.target.value))} /></td>
            <td><input value={state.combat.acBonuses.misc} onChange={(e) => (handleACChange('misc', e.target.value))} /></td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <td>Saving Throws</td>
            <td>Total</td>
            <td>Class Base</td>
            <td>Abiity</td>
            <td>Enhance</td>
            <td>Misc</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fortitude</td>
            <td>{state.combat.fort.total}</td>
            <td>{state.classRecorder.totals.fort}</td>
            <td>{state.abilityBlock.abilities[state.combat.fort.ability].mod}</td>
            <td><input value={state.combat.fort.enh} onChange={(e) => (handleSaveChange('fort', 'enh', e.target.value))} /></td>
            <td><input value={state.combat.fort.misc} onChange={(e) => (handleSaveChange('fort', 'misc', e.target.value))} /></td>
          </tr>
          <tr>
            <td>Reflex</td>
            <td>{state.combat.ref.total}</td>
            <td>{state.classRecorder.totals.ref}</td>
            <td>{state.abilityBlock.abilities[state.combat.ref.ability].mod}</td>
            <td><input value={state.combat.ref.enh} onChange={(e) => (handleSaveChange('ref', 'enh', e.target.value))} /></td>
            <td><input value={state.combat.ref.misc} onChange={(e) => (handleSaveChange('ref', 'misc', e.target.value))} /></td>
          </tr>
          <tr>
            <td>Will</td>
            <td>{state.combat.will.total}</td>
            <td>{state.classRecorder.totals.will}</td>
            <td>{state.abilityBlock.abilities[state.combat.will.ability].mod}</td>
            <td><input value={state.combat.will.enh} onChange={(e) => (handleSaveChange('will', 'enh', e.target.value))} /></td>
            <td><input value={state.combat.will.misc} onChange={(e) => (handleSaveChange('will', 'misc', e.target.value))} /></td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <td>Attack</td>
            <td>Total</td>
            <td>Base Attack Bonus</td>
            <td>Ability</td>
            <td>Misc</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Melee</td>
            <td>{state.combat.melee.total}</td>
            <td>{state.classRecorder.totals.bab}</td>
            <td>{state.abilityBlock.abilities[state.combat.melee.ability].mod}</td>
            <td><input value={state.combat.melee.misc} onChange={(e) => (handleAttackChange('melee', 'misc', e.target.value))} /></td>
          </tr>
          <tr>
            <td>Ranged</td>
            <td>{state.combat.ranged.total}</td>
            <td>{state.classRecorder.totals.bab}</td>
            <td>{state.abilityBlock.abilities[state.combat.ranged.ability].mod}</td>
            <td><input value={state.combat.ranged.misc} onChange={(e) => (handleAttackChange('ranged', 'misc', e.target.value))} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}