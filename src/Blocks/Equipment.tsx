import { Blocks, EquipSlot, Item } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";

const SLOTS: { [K in EquipSlot]: string } = {
  belt: "belt",
  body: "body",
  chest: "chest",
  eyes: "eyes",
  feet: "feet",
  hands: "hands",
  head: "head",
  headband: "headband",
  neck: "neck",
  ring_1: "ring 1",
  ring_2: "ring 2",
  shoulders: "shoulders",
  wrist: "wrist",
  none: "-",
};

export function Equipment({ state }: { state: Blocks }) {
  const dispatch = useFormDispatch();

  function handleClick(entry: Item | undefined) {
    if (entry != undefined) {
      dispatch({ type: "toggleEquipItemDescr", payload: { entry } });
    }
  }

  function handleChange(
    field: "name" | "hp" | "weight" | "value" | "qtyOrUses" | "description",
    index: number,
    value: string
  ) {
    dispatch({ type: "changeInventoryEntryField", payload: { field, index, value } });
  }

  function handleSelectChange(index: number, value: EquipSlot) {
    dispatch({ type: "changeInventoryEntrySlot", payload: { index, value } });
  }

  function removeEntry(entry: Item) {
    dispatch({ type: "removeInventoryEntry", payload: { entry } });
  }

  function addEntry() {
    dispatch({ type: "addInventoryEntry" });
  }

  function toggleDetail() {
    dispatch({ type: "toggleEquipDetail" });
  }

  function equipItem(item: Item) {
    dispatch({ type: "equipItem", payload: { item } });
  }

  function unequipItem(slot: EquipSlot) {
    dispatch({ type: "unequipItem", payload: { slot } });
  }

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Equipment</h2>
      <h3>Carried Items</h3>
      <button onClick={addEntry}>Add Entry</button>
      <button onClick={toggleDetail}>Toggle Detail</button>
      <table>
        <thead>
          <tr>
            <td>Toggle Description</td>
            <td>Name</td>
            <td>Qty / Uses</td>
            {state.equipment.toggleDetail && (
              <>
                <td>HP</td>
                <td>Weight</td>
                <td>Value</td>
                <td>Slot</td>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {state.equipment.inventory.map((entry, i) => (
            <>
              <tr>
                <td>
                  <button onClick={() => handleClick(entry)}>Toggle</button>
                </td>
                <td>
                  <input value={entry.name} onChange={(e) => handleChange("name", i, e.target.value)} />
                </td>
                <td>
                  <input value={entry.qtyOrUses} onChange={(e) => handleChange("qtyOrUses", i, e.target.value)} />
                </td>
                {state.equipment.toggleDetail && (
                  <>
                    <td>
                      <input type="number" value={entry.hp} onChange={(e) => handleChange("hp", i, e.target.value)} />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={entry.weight}
                        onChange={(e) => handleChange("weight", i, e.target.value)}
                      />
                    </td>
                    <td>
                      <input value={entry.value} onChange={(e) => handleChange("value", i, e.target.value)} />
                    </td>
                    <td>
                      <select value={entry.slot} onChange={(e) => handleSelectChange(i, e.target.value as EquipSlot)}>
                        {Object.values(EquipSlot).map((slot) => {
                          return (
                            <option key={slot} value={slot}>
                              {SLOTS[slot]}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  </>
                )}
                {entry.slot !== EquipSlot.NONE && (
                  <td>
                    <button onClick={() => equipItem(entry)}>Equip</button>
                  </td>
                )}
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
      <h3>Worn Magic Item Equipment</h3>
      <table>
        <thead>
          <tr>
            <td>Slot</td>
            <td>Toggle Description</td>
            <td>Name</td>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(state.equipment.worn) as Array<EquipSlot>).map((slot) => (
            <>
              <tr>
                <td>{SLOTS[slot]}</td>
                <td>
                  <button onClick={() => handleClick(state.equipment.worn[slot])}>Toggle</button>
                </td>
                <td>{state.equipment.worn[slot]?.name}</td>
                <td>
                  <button onClick={() => unequipItem(slot)}>Unequip</button>
                </td>
              </tr>
              {state.equipment.worn[slot]?.toggleDescr && (
                <tr>
                  <td>{state.equipment.worn[slot]?.description}</td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
