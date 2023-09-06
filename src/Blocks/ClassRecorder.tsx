import React from "react";
import SectionTitle from "../Components/SectionTitle";
import { ClassRecordBlock } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";
import ModalInput from "../Components/ModalInput";
import Button from "../Components/Button";

const fields = ["bab", "skill", "favClassBonusType", "favClassBonus", "fort", "ref", "will", "levels"] as const;

export function ClassRecorder({ state }: { state: ClassRecordBlock }) {
  const dispatch = useFormDispatch();
  function handleChange(
    entryIndex: number,
    field:
      | "hitDie"
      | "name"
      | "bab"
      | "skill"
      | "favClassBonusType"
      | "favClassBonus"
      | "fort"
      | "ref"
      | "will"
      | "levels",
    value: string
  ) {
    dispatch({
      type: "changeClassEntryField",
      payload: { entryIndex, field, value },
    });
  }

  return (
    <div className="mt-4">
      <SectionTitle title="Class Recorder" />
      {state.entries.map((entry, i) => (
        <React.Fragment key={i}>
          <div className="text-xs mt-4">
            <ModalInput value={entry.hitDie} placeholder="{HD}" onChange={(v) => handleChange(i, "hitDie", v)} />
            {" - "}
            <ModalInput value={entry.name} placeholder="{Class Name}" onChange={(v) => handleChange(i, "name", v)} />
          </div>
          <div className="flex flex-wrap gap-x-2">
            {fields.map((field) => (
              <div key={field}>
                {field}:{" "}
                <ModalInput
                  type="number"
                  value={entry[field]}
                  placeholder={`{${field}}`}
                  onChange={(v) => handleChange(i, field, v)}
                />
              </div>
            ))}
          </div>
          <div className="text-right">
            <Button
              size="small"
              onClick={() => {
                if (confirm("Are you sure?")) {
                  dispatch({ type: "removeClassEntry", payload: { index: i } });
                }
              }}
            >
              Remove
            </Button>
          </div>
        </React.Fragment>
      ))}
      <Button className="mt-2" block onClick={() => dispatch({ type: "addClassEntry" })}>
        Add entry
      </Button>
    </div>
  );
}
