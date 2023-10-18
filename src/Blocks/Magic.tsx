import { CasterSpecialEntry, CasterSpecialty, MagicBlock } from "../charSheet";
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
    </div>
  );
}
