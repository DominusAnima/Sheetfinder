import React, { InputHTMLAttributes, useState } from "react";
import EditButton from "../Components/EditButton";
import Field from "../Components/Field";
import Input from "../Components/Input";
import SectionTitle from "../Components/SectionTitle";
import Select from "../Components/Select";
import Textarea from "../Components/Textarea";
import { Alignment, BioBlock, CharacterSize } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";

const LABELS: { [K in keyof BioBlock]: string } = {
  age: "Age",
  align: "Alignment",
  background: "Homeland & background occupation",
  deity: "Deity",
  eyes: "Eyes",
  gender: "Gender",
  hair: "Hair",
  height: "Height",
  languages: "Languages",
  name: "Name",
  race: "Race",
  size: "Size",
  skin: "Skin",
  weight: "Weight",
};

const SIZES: { [K in CharacterSize]: string } = {
  colossal: "Colossal",
  diminutive: "Diminutive",
  fine: "Fine",
  gargantuan: "Gargantuan",
  huge: "Huge",
  large: "Large",
  medium: "Medium",
  small: "Small",
  tiny: "Tiny",
};

const ALIGNMENTS: { [K in Alignment]: string } = {
  "chaotic evil": "Chaotic evil",
  "chaotic good": "Chaotic good",
  "chaotic neutral": "Chaotic neutral",
  "lawful evil": "Lawful evil",
  "lawful good": "Lawful good",
  "lawful neutral": "Lawful neutral",
  "neutral evil": "Neutral evil",
  "neutral good": "Neutral good",
  neutral: "Neutral",
};

const BioForm = ({ state }: { state: BioBlock }) => {
  const dispatch = useFormDispatch();
  const handleChange = <T extends keyof BioBlock>(field: T, value: BioBlock[T]) => {
    dispatch({
      type: "changeBio",
      payload: {
        [field]: value,
      },
    });
  };

  const textField = (key: keyof BioBlock, props?: InputHTMLAttributes<HTMLInputElement>) => (
    <Field className="flex-1" label={LABELS[key]}>
      <Input value={state[key]} onChange={(e) => handleChange(key, e.target.value)} {...props} />
    </Field>
  );

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="">{textField("name")}</div>
      <div className="flex gap-4">
        {textField("age", { type: "number" })}
        {textField("race")}
        {textField("gender")}
      </div>
      <div className="flex gap-4">
        {textField("height")}
        {textField("weight")}
        <Field className="flex-1" label={LABELS.size}>
          <Select value={state.size} onChange={(e) => handleChange("size", e.target.value as CharacterSize)}>
            {Object.values(CharacterSize).map((size) => (
              <option key={size} value={size}>
                {SIZES[size]}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="flex gap-4">
        {textField("hair")}
        {textField("eyes")}
        {textField("skin")}
      </div>
      <div className="flex gap-4">
        <Field className="flex-1" label={LABELS.align}>
          <Select value={state.align} onChange={(e) => handleChange("align", e.target.value as Alignment)}>
            {Object.values(Alignment).map((align) => {
              return (
                <option key={align} value={align}>
                  {ALIGNMENTS[align]}
                </option>
              );
            })}
          </Select>
        </Field>
        {textField("deity")}
      </div>
      <div className="">
        <Field className="flex-1" label={LABELS.background}>
          <Textarea value={state.background} onChange={(e) => handleChange("background", e.target.value)} rows={3} />
        </Field>
      </div>
      <div className="">{textField("languages")}</div>
    </div>
  );
};

interface Props {
  state: BioBlock;
}

const BioSummary: React.FC<Props> = ({ state }) => {
  const value = (v: string, suffix?: string) => (
    <span className="value">
      {v ?? "??"}
      {suffix && ` ${suffix}`}
    </span>
  );
  return (
    <div className="mt-4">
      <div className="text-xl value">{state.name}</div>
      <div className="">
        {value(state.age)} years old {value(state.race)} {value(state.gender)}.{" "}
      </div>
      <div className="text-sm">
        {value(state.weight, "kg")}, {value(state.height, "cm")} with {value(state.hair)}&nbsp;hair, {value(state.eyes)}
        &nbsp;eyes and {value(state.skin)}&nbsp;skin.
      </div>
      <div className="text-sm">
        {value(ALIGNMENTS[state.align])} follower of {value(state.deity)}.
      </div>
      <div className="text-sm">Speaks {value(state.languages)}.</div>
      {state.background.trim() && <div className="text-sm">{state.background}</div>}
    </div>
  );
};

const Bio: React.FC<Props> = ({ state }) => {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <SectionTitle title="Character Info">
        <EditButton editing={editing} onClick={() => setEditing((v) => !v)} />
      </SectionTitle>
      {editing ? <BioForm state={state} /> : <BioSummary state={state} />}
    </div>
  );
};

export default Bio;
