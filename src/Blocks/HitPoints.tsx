import { HPBlock } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";

export function HitPoints({ state }: { state: HPBlock }) {
  const dispatch = useFormDispatch();
  function handleChange(field: "bonusMaxPoints" | "currentPoints" | "tempPoints" | "nonLethal", value: string) {
    dispatch({ type: "changeHPField", payload: { field, value } });
  }

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Hit Points</h2>
      <label>
        Max HP bonus:
        <input
          type="number"
          value={state.bonusMaxPoints}
          onChange={(e) => handleChange("bonusMaxPoints", e.target.value)}
        />
      </label>
      <label>Total HP: {state.maxPoints}</label>
      <label>
        Current HP:
        <input
          type="number"
          value={state.currentPoints}
          onChange={(e) => handleChange("currentPoints", e.target.value)}
        />
      </label>
      <label>
        Temporary HP:
        <input type="number" value={state.tempPoints} onChange={(e) => handleChange("tempPoints", e.target.value)} />
      </label>
      <label>
        Nonlethal damage:{" "}
        <input type="number" value={state.nonLethal} onChange={(e) => handleChange("nonLethal", e.target.value)} />
      </label>
    </div>
  );
}
