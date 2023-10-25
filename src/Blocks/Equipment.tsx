import { useState } from "react";
import { Bag, Blocks, EquipSlot, Item, Money } from "../charSheet";
import { makeEmptyItem } from "../constants";
import { useFormDispatch } from "../lib/useFormDispatch";
import SectionTitle from "../Components/SectionTitle";
import EditButton from "../Components/EditButton";
import FlatButton from "../Components/FlatButton";
import Field from "../Components/Field";
import { FaPlusCircle } from "react-icons/fa";
import Button from "../Components/Button";
import InlineInput from "../Components/InlineInput";

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
  const [editing, setEditing] = useState(false);
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

  function removeWornItem(item: Item) {
    dispatch({ type: "removeWornItem", payload: { item } });
  }

  function handleBagChange(
    field: "name" | "hp" | "weight" | "value" | "qtyOrUses" | "description" | "capacity",
    bag: Bag,
    value: string
  ) {
    dispatch({ type: "changeBagField", payload: { field, bag, value } });
  }

  function toggleBagDescr(bag: Bag) {
    dispatch({ type: "toggleBagDescr", payload: { bag } });
  }

  function handleMoneyChange(field: "amount" | "weight", entry: Money, value: string) {
    dispatch({ type: "changeMoneyField", payload: { field, entry, value } });
  }

  function removeBag(bag: Bag) {
    dispatch({ type: "removeBag", payload: { bag } });
  }

  function addBag() {
    dispatch({ type: "addBag" });
  }

  const combatWeight = (): number => {
    return (
      Number(state.combat.equipment.armor.weight) +
      Number(state.combat.equipment.shield.weight) +
      Number(state.combat.equipment.mainWeapon.weight) +
      Number(state.combat.equipment.offhand.weight)
    );
  };

  const currencyWeight = (): number => {
    let weight: number = 0;
    state.equipment.coinPurse.forEach((element) => {
      weight += Number(element.weight) * Number(element.amount);
    });

    return weight;
  };

  const equipWeight = (): number => {
    let weight: number = 0;
    state.equipment.inventory.forEach((item) => {
      weight += Number(item.weight);
    });
    Object.values(state.equipment.worn).forEach((item) => {
      weight += Number(item.weight);
    });

    return weight;
  };

  const getLoadCategory = (): string => {
    if (state.equipment.weight.currLoad <= state.equipment.weight.lightLoad) {
      return "Light";
    } else if (state.equipment.weight.currLoad <= state.equipment.weight.medLoad) {
      return "Medium";
    } else if (state.equipment.weight.currLoad <= state.equipment.weight.heavyLoad) {
      return "Heavy";
    } else {
      return "Overloaded";
    }
  };

  return (
    <div className="mt-">
      <SectionTitle title="Equipment">
        <EditButton editing={editing} onClick={() => setEditing((v) => !v)} />
      </SectionTitle>

      <Field label="Carried Items" horizontal>
        <FlatButton onClick={() => dispatch({ type: "addInventoryEntry" })}>
          <FaPlusCircle />
        </FlatButton>
      </Field>
      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Description</th>
            <th className="whitespace-nowrap">Name</th>
            <th className="whitespace-nowrap">Qty / Uses</th>
            {editing && (
              <>
                <th className="whitespace-nowrap">HP</th>
                <th className="whitespace-nowrap">Weight</th>
                <th className="whitespace-nowrap">Value</th>
                <th className="whitespace-nowrap">Slot</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {state.equipment.inventory.map((entry, i) => (
            <>
              <tr>
                <td>
                  <Button size="small" onClick={() => dispatch({ type: "toggleEquipItemDescr", payload: { entry } })}>
                    Toggle
                  </Button>
                </td>
                <td>
                  <InlineInput value={entry.name} onChange={(e) => handleInvChange("name", i, e.target.value)} />
                </td>
                <td>
                  <InlineInput
                    value={entry.qtyOrUses}
                    onChange={(e) => handleInvChange("qtyOrUses", i, e.target.value)}
                  />
                </td>
                {editing && (
                  <>
                    <td>
                      <InlineInput
                        type="number"
                        value={entry.hp}
                        onChange={(e) => handleInvChange("hp", i, e.target.value)}
                      />
                    </td>
                    <td>
                      <InlineInput
                        type="number"
                        value={entry.weight}
                        onChange={(e) => handleInvChange("weight", i, e.target.value)}
                      />
                    </td>
                    <td>
                      <InlineInput value={entry.value} onChange={(e) => handleInvChange("value", i, e.target.value)} />
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
                    <Button size="small" onClick={() => dispatch({ type: "equipItem", payload: { item: entry } })}>
                      Equip
                    </Button>
                  </td>
                )}
                <td>
                  <Button
                    size="small"
                    onClick={() => {
                      if (confirm("Are you sure?")) {
                        dispatch({ type: "unequipItem", payload: { item: entry } });
                      }
                    }}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
              {entry.toggleDescr && (
                <tr>
                  <td>
                    <InlineInput
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

      <hr className="my-4" />

      <Field label="Worn Magic Item Equipment" />
      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Description</th>
            <th className="whitespace-nowrap">Slot</th>
            <th className="whitespace-nowrap">Name</th>
            <th className="whitespace-nowrap">Qty / Uses</th>
            {editing && (
              <>
                <th className="whitespace-nowrap">HP</th>
                <th className="whitespace-nowrap">Weight</th>
                <th className="whitespace-nowrap">Value</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {Object.values(state.equipment.worn).map((item) => (
            <>
              <tr>
                <td>
                  <Button size="small" onClick={() => dispatch({ type: "toggleWornDesc", payload: { item } })}>
                    Toggle
                  </Button>
                </td>
                <td className="text-center">{SLOTS[item.slot]}</td>
                <td>
                  <InlineInput value={item.name} onChange={(e) => handleWornChange("name", item, e.target.value)} />
                </td>
                <td>
                  <InlineInput
                    value={item.qtyOrUses}
                    onChange={(e) => handleWornChange("qtyOrUses", item, e.target.value)}
                  />
                </td>
                {state.equipment.toggleDetail && (
                  <>
                    <td>
                      <InlineInput
                        type="number"
                        value={item.hp}
                        onChange={(e) => handleWornChange("hp", item, e.target.value)}
                      />
                    </td>
                    <td>
                      <InlineInput
                        type="number"
                        value={item.weight}
                        onChange={(e) => handleWornChange("weight", item, e.target.value)}
                      />
                    </td>
                    <td>
                      <InlineInput
                        value={item.value}
                        onChange={(e) => handleWornChange("value", item, e.target.value)}
                      />
                    </td>
                  </>
                )}
                {JSON.stringify(item) !== JSON.stringify(makeEmptyItem(item.slot)) && (
                  <>
                    <td>
                      <Button size="small" onClick={() => dispatch({ type: "unequipItem", payload: { item } })}>
                        Unequip
                      </Button>
                    </td>
                    <td>
                      <Button
                        size="small"
                        onClick={() => {
                          if (confirm("Are you sure?")) {
                            dispatch({ type: "removeWornItem", payload: { item } });
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </td>
                  </>
                )}
              </tr>
              {item.toggleDescr && (
                <tr>
                  <td colSpan={4}>
                    <InlineInput
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

      <hr className="my-4" />

      <Field label="Bags & Containers" horizontal>
        <FlatButton onClick={() => dispatch({ type: "addBag" })}>
          <FaPlusCircle />
        </FlatButton>
      </Field>
      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Description</th>
            <th className="whitespace-nowrap">Quantity</th>
            <th className="whitespace-nowrap">Name</th>
            <th className="whitespace-nowrap">Volume / Weight Limit</th>
            {editing && (
              <>
                <th className="whitespace-nowrap">HP</th>
                <th className="whitespace-nowrap">Weight</th>
                <th className="whitespace-nowrap">Value</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {state.equipment.bags.map((bag) => (
            <>
              <tr>
                <td>
                  <Button size="small" onClick={() => dispatch({ type: "toggleBagDescr", payload: { bag } })}>
                    Toggle
                  </Button>
                </td>
                <td>
                  <InlineInput
                    type="number"
                    value={bag.qtyOrUses}
                    onChange={(e) => handleBagChange("qtyOrUses", bag, e.target.value)}
                  />
                </td>
                <td>
                  <InlineInput value={bag.name} onChange={(e) => handleBagChange("name", bag, e.target.value)} />
                </td>
                <td>
                  <InlineInput
                    value={bag.capacity}
                    onChange={(e) => handleBagChange("capacity", bag, e.target.value)}
                  />
                </td>
                {editing && (
                  <>
                    <td>
                      <InlineInput
                        type="number"
                        value={bag.hp}
                        onChange={(e) => handleBagChange("hp", bag, e.target.value)}
                      />
                    </td>
                    <td>
                      <InlineInput
                        type="number"
                        value={bag.weight}
                        onChange={(e) => handleBagChange("weight", bag, e.target.value)}
                      />
                    </td>
                    <td>
                      <InlineInput value={bag.value} onChange={(e) => handleBagChange("value", bag, e.target.value)} />
                    </td>
                  </>
                )}
                <td>
                  <Button
                    size="small"
                    onClick={() => {
                      if (confirm("Are you sure?")) {
                        dispatch({ type: "removeBag", payload: { bag } });
                      }
                    }}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
              {bag.toggleDescr && (
                <tr>
                  <td>
                    <InlineInput
                      value={bag.description}
                      onChange={(e) => handleBagChange("description", bag, e.target.value)}
                    />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      <hr className="my-4" />

      <Field label="Currency" horizontal />
      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap"></th>
            <th className="whitespace-nowrap">Quantity</th>
            {editing && <th className="whitespace-nowrap">Weight per Coin</th>}
          </tr>
        </thead>
        <tbody>
          {state.equipment.coinPurse.map((entry) => (
            <tr>
              <td className="text-center">{entry.type}</td>
              <td>
                <InlineInput
                  type="number"
                  value={entry.amount}
                  onChange={(e) => handleMoneyChange("amount", entry, e.target.value)}
                />
              </td>
              {editing && (
                <td>
                  <InlineInput
                    type="number"
                    value={entry.weight}
                    onChange={(e) => handleMoneyChange("weight", entry, e.target.value)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="my-4" />

      <Field label="Carried Weight" horizontal />
      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Armor & Weapons</th>
            <th className="whitespace-nowrap">Currency</th>
            <th className="whitespace-nowrap">Equipment</th>
            <th className="whitespace-nowrap">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">{combatWeight()}</td>
            <td className="text-center">{currencyWeight()}</td>
            <td className="text-center">{equipWeight()}</td>
            <td className="text-center">{state.equipment.weight.currLoad}</td>
          </tr>
        </tbody>
      </table>

      <hr className="my-4" />

      <Field label="Loads & Lift" horizontal>
        <p className="flex-1 text-center">Current Load: {getLoadCategory()}</p>
      </Field>
      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Light Load</th>
            <th className="whitespace-nowrap">Medium Load</th>
            <th className="whitespace-nowrap">Heavy Load</th>
            <th className="whitespace-nowrap">Lift above Head</th>
            <th className="whitespace-nowrap">Lift off Ground</th>
            <th className="whitespace-nowrap">Drag & Push</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">{"<=" + state.equipment.weight.lightLoad}</td>
            <td className="text-center">{"<=" + state.equipment.weight.medLoad}</td>
            <td className="text-center">{"<=" + state.equipment.weight.heavyLoad}</td>
            <td className="text-center">{state.equipment.weight.heavyLoad}</td>
            <td className="text-center">{Number(state.equipment.weight.heavyLoad) * 2}</td>
            <td className="text-center">{Number(state.equipment.weight.heavyLoad) * 5}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
