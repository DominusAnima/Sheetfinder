import Field from "../Components/Field";
import InlineInput from "../Components/InlineInput";
import SectionTitle from "../Components/SectionTitle";
import { HPBlock } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";

export function HitPoints({ state }: { state: HPBlock }) {
  const dispatch = useFormDispatch();
  function handleChange(field: "bonusMaxPoints" | "currentPoints" | "tempPoints" | "nonLethal", value: string) {
    dispatch({ type: "changeHPField", payload: { field, value } });
  }

  return (
    <div className="mt-4">
      <SectionTitle title="Hit Points" />
      <div className="space-y-2 mt-4">
        <Field label="Max HP bonus" horizontal>
          <InlineInput
            type="number"
            value={state.bonusMaxPoints}
            onChange={(e) => handleChange("bonusMaxPoints", e.target.value)}
          />
        </Field>
        <Field label="Total HP:" horizontal>
          <p className="flex-1 text-center value">{state.maxPoints}</p>
        </Field>
        <Field label="Current HP:" horizontal>
          <InlineInput
            type="number"
            value={state.currentPoints}
            onChange={(e) => handleChange("currentPoints", e.target.value)}
          />
        </Field>
        <Field label="Temporary HP:" horizontal>
          <InlineInput
            type="number"
            value={state.tempPoints}
            onChange={(e) => handleChange("tempPoints", e.target.value)}
          />
        </Field>
        <Field label="Nonlethal damage:" horizontal>
          <InlineInput
            type="number"
            value={state.nonLethal}
            onChange={(e) => handleChange("nonLethal", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}
