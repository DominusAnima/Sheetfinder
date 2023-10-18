import { Feat, FeatBlock } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";

export function Feats({ state }: { state: FeatBlock }) {
  const dispatch = useFormDispatch();

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  function addEntry() {
    dispatch({ type: "addFeatEntry" });
  }

  function removeEntry(entry: Feat) {
    dispatch({ type: "removeFeatEntry", payload: { entry } });
  }

  function handleClick(index: number) {
    dispatch({ type: "toggleFeatDetail", payload: { index } });
  }

  function handleChange(field: "name" | "description", index: number, value: string) {
    dispatch({ type: "changeFeatEntryField", payload: { field, index, value } });
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Feats & Features</h2>
      <button onClick={addEntry}>Add Entry</button>
      <table>
        <thead>
          <tr>
            <th>Toggle Description</th>
            <th>Name</th>
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
