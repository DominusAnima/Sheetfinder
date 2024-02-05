import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import Button from "../Components/Button";
import FlatButton from "../Components/FlatButton";
import ModalInput from "../Components/ModalInput";
import SectionTitle from "../Components/SectionTitle";
import { ClassEntry, ClassRecordBlock } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";
import Field from "../Components/Field";

const fields = ["favClassBonus", "bab", "skill", "fort", "ref", "will", "levels"] as const;

export function ClassRecorder({ state }: { state: ClassRecordBlock }) {
  const dispatch = useFormDispatch();
  function handleChange(entryIndex: number, field: keyof ClassEntry, value: string) {
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
      <ModalInput
        value={state.favClass}
        placeholder="{Favoured Class}"
        onChange={(v) => dispatch({ type: "changeFavClass", payload: { value: v } })}
      />
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
            {entry.name !== "" && state.favClass === entry.name && (
              <>
                {"Favoured Class Bonus Type:"}
                <ModalInput
                  value={entry.favClassBonusType}
                  placeholder="{favClassBonusType}"
                  onChange={(v) => handleChange(i, "favClassBonusType", v)}
                />
              </>
            )}
            {fields.map((field) => (
              <>
                {(state.favClass === entry.name || (state.favClass !== entry.name && field !== "favClassBonus")) && (
                  <div key={field}>
                    {field}:{" "}
                    <ModalInput
                      type="number"
                      value={entry[field]}
                      placeholder={`{${field}}`}
                      onChange={(v) => handleChange(i, field, v)}
                    />
                  </div>
                )}
              </>
            ))}
          </div>
        </React.Fragment>
      ))}

      <hr className="my-4" />

      <React.Fragment>
        <div className="mt-4 flex items-center justify-between">
          <Field label="Totals" />
        </div>
        <div className="flex flex-wrap gap-x-2">
          {fields.map((field) => (
            <div key={field}>
              <Field label={field + ": " + state.totals[field].toString()} />
            </div>
          ))}
        </div>
      </React.Fragment>
    </div>
  );
}
