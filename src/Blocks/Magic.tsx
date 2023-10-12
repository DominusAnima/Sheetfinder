import { MagicBlock } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";

export function MagicBlock({ state }: { state: MagicBlock }) {
  const dispatch = useFormDispatch();

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  function toggleDetail() {
    dispatch(type: "toggleMagicDetail");
  }

  function handleFieldChange(field: "casterClass" | "casterLvl", value: string) {
    dispatch(type: "changeMagicField", payload: {field, value});
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Magic and Spellcasting</h2>
      <button onClick={toggleDetail}>Toggle Detail</button>
      <label>Caster Class: </label>
      <input onChange={(e) => handleFieldChange("casterClass", e.target.value)} value={state.casterClass}/>
      <label>Caster Level: </label>
      <input onChange={(e) => handleFieldChange("casterLvl", e.target.value)} value={state.casterLvl}/>

      <h3>Bloodline / Domain / Patron / Specialty</h3>
      <button onClick={(e) => addSpecialty("mainSpecial")}>Add Main Specialty</button>
      {state.specialty.mainSpecial.map((specialName, i) => {
        return (
          
        )
      })}
    </div>
  )
}
