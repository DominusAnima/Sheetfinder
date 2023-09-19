import { Blocks, EquipSlot, Item } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";

export function Equipment({ state }: { state: Blocks }) {
  const dispatch = useFormDispatch();

  function handleClick(index: number) {
    dispatch({ type: "toggleEquipItemDetail", payload: { index } });
  }

  function handleChange(field: "name" | "hp" | "weight" | "value" | "description", index: number, value: string) {
    dispatch({ type: "changeInventoryEntryField", payload: { field, index, value } });
  }

  function handleSelectChange(index: number, value: keyof EquipSlot) {
    dispatch({ type: "changeInventoryEntrySlot", payload: { index, value } });
  }

  function removeEntry(entry: Item) {
    dispatch({ type: "removeInventoryEntry", payload: { entry } });
  }

  function addEntry() {
    dispatch({ type: "addInventoryEntry" });
  }

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Equipment</h2>
      <h3>Carried Items</h3>
      <button onClick={addEntry}>Add Entry</button>
      <table>
        <thead>
          <tr>
            <td>Toggle Description</td>
            <td>Name</td>
            <td>HP</td>
            <td>Weight</td>
            <td>Value</td>
            <td>Slot</td>
          </tr>
        </thead>
        <tbody>
          {state.equipment.inventory.map((entry, i) => (
            <>
              <tr>
                <td>
                  <button onClick={() => handleClick(i)}>Toggle</button>
                </td>
                <td>
                  <input value={entry.name} onChange={(e) => handleChange("name", i, e.target.value)} />
                </td>
                <td>
                  <input value={entry.hp} onChange={(e) => handleChange("hp", i, e.target.value)} />
                </td>
                <td>
                  <input value={entry.weight} onChange={(e) => handleChange("weight", i, e.target.value)} />
                </td>
                <td>
                  <input value={entry.value} onChange={(e) => handleChange("value", i, e.target.value)} />
                </td>
                <td>
                  <select value={entry.slot} onChange={(e) => handleSelectChange(i, e.target.value as keyof EquipSlot)}>
                    {Object.values(EquipSlot).map((slot) => {
                      return (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      );
                    })}
                  </select>
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
