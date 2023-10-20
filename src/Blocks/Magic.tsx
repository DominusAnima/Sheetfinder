import { CasterSpecialEntry, CasterSpecialty, MagicBlock, SpellSlot } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";

export function Magic({ state }: { state: MagicBlock }) {
  const dispatch = useFormDispatch();

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  function toggleDetail() {
    dispatch({ type: "toggleMagicDetail" });
  }

  function handleFieldChange(field: "casterClass" | "casterLvl", value: string) {
    dispatch({ type: "changeMagicField", payload: { field, value } });
  }

  function addSpecialty(specialType: keyof CasterSpecialty) {
    dispatch({ type: "addCasterSpecial", payload: { specialType } });
  }

  function handleSpecialChange(specialType: keyof CasterSpecialty, entry: CasterSpecialEntry, value: string) {
    dispatch({ type: "changeCasterSpecialField", payload: { specialType, entry, value } });
  }

  function removeSpecialty(specialType: keyof CasterSpecialty, entry: CasterSpecialEntry) {
    dispatch({ type: "removeCasterSpecial", payload: { specialType, entry } });
  }

  function handleSlotChange(slot: SpellSlot, field: keyof SpellSlot, value: string) {
    dispatch({ type: "changeSpellSlotField", payload: { slot, field, value } });
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Magic and Spellcasting</h2>
      <button onClick={toggleDetail}>Toggle Detail</button>
      <label>Caster Class: </label>
      <input onChange={(e) => handleFieldChange("casterClass", e.target.value)} value={state.casterClass} />
      <label>Caster Level: </label>
      <input type="number" onChange={(e) => handleFieldChange("casterLvl", e.target.value)} value={state.casterLvl} />

      <table>
        <thead>
          <tr>
            <th>
              <h3>Main Magic Specialty</h3>
            </th>
            <td>
              <button onClick={() => addSpecialty("mainSpecial")}>Add Main Specialty</button>
            </td>
          </tr>
        </thead>
        <tbody>
          {state.specialty.mainSpecial.map((specialEntry) => {
            return (
              <tr>
                <td>
                  <input
                    onChange={(e) => handleSpecialChange("mainSpecial", specialEntry, e.target.value)}
                    value={specialEntry.name}
                  />
                </td>
                <td>
                  <button onClick={() => removeSpecialty("mainSpecial", specialEntry)}>Remove</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th>
              <h3>Secondary / Restricted Specialties</h3>
            </th>
            <td>
              <button onClick={() => addSpecialty("subSpecial")}>Add Sub Specialty</button>
            </td>
          </tr>
        </thead>
        <tbody>
          {state.specialty.subSpecial.map((specialEntry) => {
            return (
              <tr>
                <td>
                  <input
                    onChange={(e) => handleSpecialChange("subSpecial", specialEntry, e.target.value)}
                    value={specialEntry.name}
                  />
                </td>
                <td>
                  <button onClick={() => removeSpecialty("subSpecial", specialEntry)}>remove</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3>Spells per Day</h3>
      <table>
        <thead>
          <tr>
            <th>Save DC</th>
            <th>Level</th>
            <th>Total</th>
            <th>Class</th>
            <th>Ability Bonus</th>
            <th>Misc</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {state.spellSlots.map((slot) => {
            return (
              <tr>
                <td>
                  <input
                    type="number"
                    onChange={(e) => handleSlotChange(slot, "saveDC", e.target.value)}
                    value={slot.saveDC}
                  />
                </td>
                <td>{slot.lvl}</td>
                <td>{slot.total}</td>
                <td>
                  <input
                    type="number"
                    onChange={(e) => handleSlotChange(slot, "classAmount", e.target.value)}
                    value={slot.classAmount}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    onChange={(e) => handleSlotChange(slot, "abilityBonus", e.target.value)}
                    value={slot.abilityBonus}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    onChange={(e) => handleSlotChange(slot, "misc", e.target.value)}
                    value={slot.misc}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    onChange={(e) => handleSlotChange(slot, "available", e.target.value)}
                    value={slot.available}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
