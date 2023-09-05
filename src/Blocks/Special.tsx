import { Dispatch } from "react";
import { SpecialBlock } from "../charSheet";
import { ReducerAction } from "../reducer";

export function Special({
  state,
  dispatch,
}: {
  state: SpecialBlock;
  dispatch: Dispatch<ReducerAction>;
}) {
  function handleChange(
    field: "name" | "description" | "usesLimit" | "used",
    index: number,
    value: string
  ) {
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

  return (
    <div onSubmit={handleSubmit}>
      <h2>Special Usable Abilities</h2>
      <button onClick={addEntry}>Add Entry</button>
      <table>
        <thead>
          <tr>
            <td>Toggle Description</td>
            <td>Name</td>
            <td>Uses/Day</td>
            <td>Used</td>
          </tr>
        </thead>
        <tbody>
          {state.entries.map((entry, i) => (
            <>
              <tr>
                <td>
                  <button onClick={() => handleClick(i)}>Toggle</button>
                </td>
                <td>{entry.name}</td>
                <td>
                  <input
                    value={entry.usesLimit}
                    onChange={(e) =>
                      handleChange("usesLimit", i, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    value={entry.used}
                    onChange={(e) => handleChange("used", i, e.target.value)}
                  />
                </td>
              </tr>
              {entry.toggleDescr && (
                <tr>
                  <td>
                    <input
                      value={entry.description}
                      onChange={(e) =>
                        handleChange("description", i, e.target.value)
                      }
                    />
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
