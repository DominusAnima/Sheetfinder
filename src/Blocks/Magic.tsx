import { useState } from "react";
import { CasterSpecialEntry, CasterSpecialty, MagicBlock, Spell, SpellSlot } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";
import SectionTitle from "../Components/SectionTitle";
import EditButton from "../Components/EditButton";
import Field from "../Components/Field";
import InlineInput from "../Components/InlineInput";
import Button from "../Components/Button";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import FlatButton from "../Components/FlatButton";
import Textarea from "../Components/Textarea";

function SingleBlock({ state, index, editing }: { state: MagicBlock; index: number; editing: boolean }) {
  const dispatch = useFormDispatch();

  function handleFieldChange(field: "casterClass" | "casterLvl", value: string, index: number) {
    dispatch({ type: "changeMagicField", payload: { field, value, index } });
  }

  function addSpecialty(specialType: keyof CasterSpecialty, index: number) {
    dispatch({ type: "addCasterSpecial", payload: { specialType, index } });
  }

  function handleSpecialChange(
    specialType: keyof CasterSpecialty,
    entry: CasterSpecialEntry,
    value: string,
    index: number
  ) {
    dispatch({ type: "changeCasterSpecialField", payload: { specialType, entry, value, index } });
  }

  function removeSpecialty(specialType: keyof CasterSpecialty, entry: CasterSpecialEntry, index: number) {
    dispatch({ type: "removeCasterSpecial", payload: { specialType, entry, index } });
  }

  function handleSlotChange(slot: SpellSlot, field: keyof SpellSlot, value: string, index: number) {
    dispatch({ type: "changeSpellSlotField", payload: { slot, field, value, index } });
  }

  function toggleSpellDescr(spell: Spell, index: number) {
    dispatch({ type: "toggleSpellDescr", payload: { spell, index } });
  }

  function handleSpellChange(
    field: "lvl" | "prepared" | "name" | "description" | "school" | "duration" | "range" | "saveType" | "spellRes",
    spell: Spell,
    value: string,
    index: number
  ) {
    dispatch({ type: "changeSpellField", payload: { field, spell, value, index } });
  }

  function removeSpell(spell: Spell, index: number) {
    dispatch({ type: "removeSpell", payload: { spell, index } });
  }

  return (
    <div className="mt-4">
      <Field label={"Magic Sheet " + (index + 1)} horizontal>
        <FlatButton
          onClick={() => {
            if (confirm("Are you sure you want to delete this Magic Block?"))
              dispatch({ type: "removeMagicBlock", payload: { index } });
          }}
        >
          <FaMinusCircle />
        </FlatButton>
      </Field>

      <hr className="my-4" />

      <div className="space-y-2 mt-4">
        {editing ? (
          <>
            <Field label="Caster Class" horizontal>
              <InlineInput
                onChange={(e) => handleFieldChange("casterClass", e.target.value, index)}
                value={state.casterClass}
              />
            </Field>
            <Field label="Caster Level" horizontal>
              <InlineInput
                type="number"
                onChange={(e) => handleFieldChange("casterLvl", e.target.value, index)}
                value={state.casterLvl}
              />
            </Field>
          </>
        ) : (
          <>
            <Field label="Caster Class" horizontal>
              <p className="flex-1 text-center">{state.casterClass}</p>
            </Field>
            <Field label="Caster Level" horizontal>
              <p className="flex-1 text-center value"> {state.casterLvl} </p>
            </Field>
          </>
        )}
      </div>

      <hr className="my-4" />

      <div className="space-y-2 mt-4">
        <Field label="Spells per Day" />
        <table className="table table--striped w-full mt-4">
          <thead>
            <tr>
              <th className="whitespace-nowrap">Level</th>
              <th className="whitespace-nowrap">DC</th>
              <th className="whitespace-nowrap">Total</th>
              {editing && (
                <>
                  <th className="whitespace-nowrap">Class</th>
                  <th className="whitespace-nowrap">Ability</th>
                  <th className="whitespace-nowrap">Misc</th>
                </>
              )}
              <th className="whitespace-nowrap">Available</th>
            </tr>
          </thead>
          {editing ? (
            <tbody>
              {state.spellSlots.map((slot) => {
                return (
                  <tr>
                    <td className="value">{slot.lvl}</td>
                    <td>
                      <InlineInput
                        type="number"
                        onChange={(e) => handleSlotChange(slot, "saveDC", e.target.value, index)}
                        value={slot.saveDC}
                      />
                    </td>
                    <td className="text-center value">{slot.total}</td>
                    <td>
                      <InlineInput
                        type="number"
                        onChange={(e) => handleSlotChange(slot, "classAmount", e.target.value, index)}
                        value={slot.classAmount}
                      />
                    </td>
                    <td>
                      <InlineInput
                        type="number"
                        onChange={(e) => handleSlotChange(slot, "abilityBonus", e.target.value, index)}
                        value={slot.abilityBonus}
                      />
                    </td>
                    <td>
                      <InlineInput
                        type="number"
                        onChange={(e) => handleSlotChange(slot, "misc", e.target.value, index)}
                        value={slot.misc}
                      />
                    </td>
                    <td>
                      <InlineInput
                        type="number"
                        onChange={(e) => handleSlotChange(slot, "available", e.target.value, index)}
                        value={slot.available}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              {state.spellSlots.map((slot) => {
                return (
                  <tr>
                    <td className="value">{slot.lvl}</td>
                    <td className="text-center value">{slot.saveDC}</td>
                    <td className="text-center value">{slot.total}</td>
                    <td>
                      <InlineInput
                        type="number"
                        onChange={(e) => handleSlotChange(slot, "available", e.target.value, index)}
                        value={slot.available}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      <hr className="my-4" />

      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Spell Ranges</th>
            <th className="whitespace-nowrap w-20">ft</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Close</td>
            <td className="text-center value">{state.closeRange}</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td className="text-center value">{state.medRange}</td>
          </tr>
          <tr>
            <td>Long</td>
            <td className="text-center value">{state.longRange}</td>
          </tr>
        </tbody>
      </table>

      <hr className="my-4" />

      <div className="space-y-2 mt-4">
        <table className="table table--striped w-full mt-4">
          <thead>
            <tr>
              <th className="whitespace-nowrap">Main Magic Specialty</th>
              {editing && (
                <td>
                  <FlatButton onClick={() => addSpecialty("mainSpecial", index)}>
                    <FaPlusCircle />
                  </FlatButton>
                </td>
              )}
            </tr>
          </thead>
          {editing ? (
            <tbody>
              {state.specialty.mainSpecial.map((specialEntry) => {
                return (
                  <tr>
                    <td>
                      <InlineInput
                        onChange={(e) => handleSpecialChange("mainSpecial", specialEntry, e.target.value, index)}
                        value={specialEntry.name}
                      />
                    </td>
                    <td>
                      <Button size="small" onClick={() => removeSpecialty("mainSpecial", specialEntry, index)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              {state.specialty.mainSpecial.map((specialEntry) => {
                return (
                  <tr>
                    <td className="text-center">{specialEntry.name}</td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        <table className="table table--striped w-full mt-4">
          <thead>
            <tr>
              <th className="whitespace-nowrap">Secondary / Restricted Specialties</th>
              {editing && (
                <td>
                  <FlatButton onClick={() => addSpecialty("subSpecial", index)}>
                    <FaPlusCircle />
                  </FlatButton>
                </td>
              )}
            </tr>
          </thead>
          {editing ? (
            <tbody>
              {state.specialty.subSpecial.map((specialEntry) => {
                return (
                  <tr>
                    <td>
                      <InlineInput
                        onChange={(e) => handleSpecialChange("subSpecial", specialEntry, e.target.value, index)}
                        value={specialEntry.name}
                      />
                    </td>
                    <td>
                      <Button size="small" onClick={() => removeSpecialty("subSpecial", specialEntry, index)}>
                        remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              {state.specialty.subSpecial.map((specialEntry) => {
                return (
                  <tr>
                    <td className="text-center">{specialEntry.name}</td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      <hr className="my-4" />

      <div className="space-y-2 mt-4">
        <Field label="Spells" horizontal>
          <FlatButton onClick={() => dispatch({ type: "addSpell", payload: { index } })}>
            <FaPlusCircle />
          </FlatButton>
        </Field>
        <table className="table table--striped w-full mt-4">
          <thead>
            <tr>
              <th className="whitespace-nowrap">Description</th>
              <th className="whitespace-nowrap">lvl</th>
              <th className="whitespace-nowrap">Prepared</th>
              <th className="whitespace-nowrap">Name</th>
              {editing && (
                <>
                  <th className="whitespace-nowrap">School</th>
                  <th className="whitespace-nowrap">Duration</th>
                  <th className="whitespace-nowrap">Range</th>
                  <th className="whitespace-nowrap">Save</th>
                  <th className="whitespace-nowrap">Spell Resistance</th>
                </>
              )}
            </tr>
          </thead>
          {editing ? (
            <tbody>
              {state.spellsKnown.map((spell) => {
                return (
                  <>
                    <tr>
                      <td>
                        <Button size="small" onClick={() => toggleSpellDescr(spell, index)}>
                          Toggle
                        </Button>
                      </td>
                      <td>
                        <InlineInput
                          type="number"
                          onChange={(e) => handleSpellChange("lvl", spell, e.target.value, index)}
                          value={spell.lvl}
                        />
                      </td>
                      <td>
                        <InlineInput
                          type="number"
                          onChange={(e) => handleSpellChange("prepared", spell, e.target.value, index)}
                          value={spell.prepared}
                        />
                      </td>
                      <td>
                        <InlineInput
                          onChange={(e) => handleSpellChange("name", spell, e.target.value, index)}
                          value={spell.name}
                        />
                      </td>
                      <td>
                        <InlineInput
                          onChange={(e) => handleSpellChange("school", spell, e.target.value, index)}
                          value={spell.school}
                        />
                      </td>
                      <td>
                        <InlineInput
                          onChange={(e) => handleSpellChange("duration", spell, e.target.value, index)}
                          value={spell.duration}
                        />
                      </td>
                      <td>
                        <InlineInput
                          onChange={(e) => handleSpellChange("range", spell, e.target.value, index)}
                          value={spell.range}
                        />
                      </td>
                      <td>
                        <InlineInput
                          onChange={(e) => handleSpellChange("saveType", spell, e.target.value, index)}
                          value={spell.saveType}
                        />
                      </td>
                      <td>
                        <InlineInput
                          onChange={(e) => handleSpellChange("spellRes", spell, e.target.value, index)}
                          value={spell.spellRes}
                        />
                      </td>
                      <td>
                        <Button size="small" onClick={() => removeSpell(spell, index)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                    {spell.toggleDescr && (
                      <tr>
                        <td colSpan={9}>
                          <Textarea
                            onChange={(e) => handleSpellChange("description", spell, e.target.value, index)}
                            value={spell.description}
                            rows={1}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              {state.spellsKnown.map((spell) => {
                return (
                  <>
                    <tr>
                      <td>
                        <Button size="small" onClick={() => toggleSpellDescr(spell, index)}>
                          Toggle
                        </Button>
                      </td>
                      <td className="text-center value">{spell.lvl}</td>
                      <td>
                        <InlineInput
                          type="number"
                          onChange={(e) => handleSpellChange("prepared", spell, e.target.value, index)}
                          value={spell.prepared}
                        />
                      </td>
                      <td className="text-center">{spell.name}</td>
                    </tr>
                    {spell.toggleDescr && (
                      <tr>
                        <td colSpan={4} className="text-center">
                          {spell.description.trim()}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      <hr className="my-4" />
    </div>
  );
}

export function Magic({ state }: { state: MagicBlock[] }) {
  const [editing, setEditing] = useState(false);
  const dispatch = useFormDispatch();

  return (
    <div className="mt-4">
      <SectionTitle title="Magic & Spellcasting">
        <EditButton editing={editing} onClick={() => setEditing((v) => !v)} />
        <FlatButton onClick={() => dispatch({ type: "addMagicBlock" })}>
          <FaPlusCircle />
        </FlatButton>
      </SectionTitle>
      {state.map((e, i) => (
        <SingleBlock state={e} index={i} editing={editing} />
      ))}
    </div>
  );
}
