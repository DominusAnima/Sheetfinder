import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import Button from "../Components/Button";
import FlatButton from "../Components/FlatButton";
import ModalInput from "../Components/ModalInput";
import SectionTitle from "../Components/SectionTitle";
import { ClassRecordBlock } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";

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
      <SectionTitle title="Class Recorder">
        <FlatButton onClick={() => dispatch({ type: "addClassEntry" })}>
          <FaPlusCircle />
        </FlatButton>
      </SectionTitle>
      {state.entries.map((entry, i) => (
        <React.Fragment key={i}>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs">
              <ModalInput value={entry.hitDie} placeholder="{HD}" onChange={(v) => handleChange(i, "hitDie", v)} />
              {" - "}
              <ModalInput value={entry.name} placeholder="{Class Name}" onChange={(v) => handleChange(i, "name", v)} />
            </div>
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
        </React.Fragment>
      ))}
    </div>
  );
}
