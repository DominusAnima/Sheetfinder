import { SpecialBlock, SpecialEntry } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";

export function Special({ state }: { state: SpecialBlock }) {
  const dispatch = useFormDispatch();
  function handleChange(field: "name" | "description" | "usesLimit" | "used", index: number, value: string) {
    dispatch({
      type: "changeSpecialEntryField",
      payload: { field, index, value },
    });
  }

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  function handleClick(index: number) {
    dispatch({ type: "toggleSpecialDetail", payload: { index } });
  }

  function addEntry() {
    dispatch({ type: "addSpecialEntry" });
  }

  function removeEntry(entry: SpecialEntry) {
    dispatch({ type: "removeSpecialEntry", payload: { entry } });
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Special Usable Abilities</h2>
      <button onClick={addEntry}>Add Entry</button>
      <table>
        <thead>
          <tr>
            <th>Toggle Description</th>
            <th>Name</th>
            <th>Uses/Day</th>
            <th>Used</th>
          </tr>
        </thead>
        <tbody>
          {state.entries.map((entry, i) => (
            <>
              <tr>
                <td>
                  <button onClick={() => handleClick(i)}>Toggle</button>
                </td>
                <td>
                  <input value={entry.name} onChange={(e) => handleChange("name", i, e.target.value)} />
                </td>
                <td>
                  <input value={entry.usesLimit} onChange={(e) => handleChange("usesLimit", i, e.target.value)} />
                </td>
                <td>
                  <input value={entry.used} onChange={(e) => handleChange("used", i, e.target.value)} />
                </td>
                <td>
                  <button onClick={() => removeEntry(entry)}>Remove</button>
                </td>
              </tr>
              {entry.toggleDescr && (
                <tr>
                  <td>
                    <input value={entry.description} onChange={(e) => handleChange("description", i, e.target.value)} />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
