import { Blocks, EquipSlot, Item } from "../charSheet";
import { makeEmptyItem } from "../constants";
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

  function toggleItemDescr(entry: Item) {
    dispatch({ type: "toggleEquipItemDescr", payload: { entry } });
  }

  function handleInvChange(
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

  function unequipItem(item: Item) {
    dispatch({ type: "unequipItem", payload: { item } });
  }

  function toggleWornDescr(item: Item) {
    dispatch({ type: "toggleWornDesc", payload: { item } });
  }

  function handleWornChange(
    field: "name" | "hp" | "weight" | "value" | "qtyOrUses" | "description",
    item: Item,
    value: string
  ) {
    dispatch({ type: "changeWornItemField", payload: { field, item, value } });
  }

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Equipment</h2>
      <button onClick={toggleDetail}>Toggle Detail</button>
      <h3>Carried Items</h3>
      <button onClick={addEntry}>Add Entry</button>
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
                  <button onClick={() => toggleItemDescr(entry)}>Toggle</button>
                </td>
                <td>
                  <input value={entry.name} onChange={(e) => handleInvChange("name", i, e.target.value)} />
                </td>
                <td>
                  <input value={entry.qtyOrUses} onChange={(e) => handleInvChange("qtyOrUses", i, e.target.value)} />
                </td>
                {state.equipment.toggleDetail && (
                  <>
                    <td>
                      <input
                        type="number"
                        value={entry.hp}
                        onChange={(e) => handleInvChange("hp", i, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={entry.weight}
                        onChange={(e) => handleInvChange("weight", i, e.target.value)}
                      />
                    </td>
                    <td>
                      <input value={entry.value} onChange={(e) => handleInvChange("value", i, e.target.value)} />
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
                    <input
                      value={entry.description}
                      onChange={(e) => handleInvChange("description", i, e.target.value)}
                    />
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
            <td>Toggle Description</td>
            <td>Slot</td>
            <td>Name</td>
            <td>Qty / Uses</td>
            {state.equipment.toggleDetail && (
              <>
                <td>HP</td>
                <td>Weight</td>
                <td>Value</td>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {Object.values(state.equipment.worn).map((item) => (
            <>
              <tr>
                <td>
                  <button onClick={() => toggleWornDescr(item)}>Toggle</button>
                </td>
                <td>{SLOTS[item.slot]}</td>
                <td>
                  <input value={item.name} onChange={(e) => handleWornChange("name", item, e.target.value)} />
                </td>
                <td>
                  <input value={item.qtyOrUses} onChange={(e) => handleWornChange("qtyOrUses", item, e.target.value)} />
                </td>
                {state.equipment.toggleDetail && (
                  <>
                    <td>
                      <input
                        type="number"
                        value={item.hp}
                        onChange={(e) => handleWornChange("hp", item, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.weight}
                        onChange={(e) => handleWornChange("weight", item, e.target.value)}
                      />
                    </td>
                    <td>
                      <input value={item.value} onChange={(e) => handleWornChange("value", item, e.target.value)} />
                    </td>
                  </>
                )}
                {JSON.stringify(item) !== JSON.stringify(makeEmptyItem(item.slot)) && (
                  <td>
                    <button onClick={() => unequipItem(item)}>Unequip</button>
                  </td>
                )}
              </tr>
              {item.toggleDescr && (
                <tr>
                  <td>
                    <input
                      value={item.description}
                      onChange={(e) => handleWornChange("description", item, e.target.value)}
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
