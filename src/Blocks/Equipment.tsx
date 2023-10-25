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
  belt: "Belt",
  body: "Body",
  chest: "Chest",
  eyes: "Eyes",
  feet: "Feet",
  hands: "Hands",
  head: "Head",
  headband: "Headband",
  neck: "Neck",
  ring_1: "Ring 1",
  ring_2: "Ring 2",
  shoulders: "Shoulders",
  wrist: "Wrist",
  none: "-",
};

export function Equipment({ state }: { state: Blocks }) {
  const [editing, setEditing] = useState(false);
  const dispatch = useFormDispatch();

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

  function handleWornChange(
    field: "name" | "hp" | "weight" | "value" | "qtyOrUses" | "description",
    item: Item,
    value: string
  ) {
    dispatch({ type: "changeWornItemField", payload: { field, item, value } });
  }

  function handleBagChange(
    field: "name" | "hp" | "weight" | "value" | "qtyOrUses" | "description" | "capacity",
    bag: Bag,
    value: string
  ) {
    dispatch({ type: "changeBagField", payload: { field, bag, value } });
  }

  function handleMoneyChange(field: "amount" | "weight", entry: Money, value: string) {
    dispatch({ type: "changeMoneyField", payload: { field, entry, value } });
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
        {editing ? (
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
                    <td colSpan={6}>
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
        ) : (
          <tbody>
            {state.equipment.inventory.map((entry) => (
              <>
                <tr>
                  <td>
                    <Button size="small" onClick={() => dispatch({ type: "toggleEquipItemDescr", payload: { entry } })}>
                      Toggle
                    </Button>
                  </td>
                  <td className="text-center">{entry.name}</td>
                  <td className="text-center value">{entry.qtyOrUses}</td>
                  {entry.slot !== EquipSlot.NONE && (
                    <td>
                      <Button size="small" onClick={() => dispatch({ type: "equipItem", payload: { item: entry } })}>
                        Equip
                      </Button>
                    </td>
                  )}
                </tr>
                {entry.toggleDescr && (
                  <tr>
                    <td className="text-center" colSpan={3}>
                      {entry.description}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        )}
      </table>

      <hr className="my-4" />

      <Field label="Worn Magic Item Equipment" />
      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Description</th>
            <th className="whitespace-nowrap">Slot</th>
            <th className="whitespace-nowrap">Name</th>
            <th className="whitespace-nowrap">Uses</th>
            {editing && (
              <>
                <th className="whitespace-nowrap">HP</th>
                <th className="whitespace-nowrap">Weight</th>
                <th className="whitespace-nowrap">Value</th>
              </>
            )}
          </tr>
        </thead>
        {editing ? (
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
                    <InlineInput value={item.value} onChange={(e) => handleWornChange("value", item, e.target.value)} />
                  </td>
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
                    <td colSpan={7}>
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
        ) : (
          <tbody>
            {Object.values(state.equipment.worn).map((item) => (
              <>
                <tr>
                  <td>
                    <Button size="small" onClick={() => dispatch({ type: "toggleWornDesc", payload: { item } })}>
                      Toggle
                    </Button>
                  </td>
                  <td className="text-center font-bold">{SLOTS[item.slot]}</td>
                  <td className="text-center">{item.name}</td>
                  <td className="text-center value">{item.qtyOrUses}</td>
                  {state.equipment.toggleDetail && (
                    <>
                      <td className="text-center">{item.hp}</td>
                      <td className="text-center">{item.weight}</td>
                      <td className="text-center">{item.value}</td>
                    </>
                  )}
                  {JSON.stringify(item) !== JSON.stringify(makeEmptyItem(item.slot)) && (
                    <td>
                      <Button size="small" onClick={() => dispatch({ type: "unequipItem", payload: { item } })}>
                        Unequip
                      </Button>
                    </td>
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
        )}
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
        {editing ? (
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
                    <td colSpan={7}>
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
        ) : (
          <tbody>
            {state.equipment.bags.map((bag) => (
              <>
                <tr>
                  <td className="text-center">
                    <Button size="small" onClick={() => dispatch({ type: "toggleBagDescr", payload: { bag } })}>
                      Toggle
                    </Button>
                  </td>
                  <td className="text-center">{bag.qtyOrUses}</td>
                  <td className="text-center">{bag.name}</td>
                  <td className="text-center value">{bag.capacity}</td>
                </tr>
                {bag.toggleDescr && (
                  <tr>
                    <td className="text-center" colSpan={4}>
                      {bag.description}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        )}
      </table>

      <hr className="my-4" />

      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Currency</th>
            <th className="whitespace-nowrap w-20">Quantity</th>
            {editing && <th className="whitespace-nowrap w-20">Weight per Coin</th>}
          </tr>
        </thead>
        {editing ? (
          <tbody>
            {state.equipment.coinPurse.map((entry) => (
              <tr>
                <td>{entry.type}</td>
                <td>
                  <InlineInput
                    type="number"
                    value={entry.amount}
                    onChange={(e) => handleMoneyChange("amount", entry, e.target.value)}
                  />
                </td>
                <td>
                  <InlineInput
                    type="number"
                    value={entry.weight}
                    onChange={(e) => handleMoneyChange("weight", entry, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            {state.equipment.coinPurse.map((entry) => (
              <tr>
                <td>{entry.type}</td>
                <td className="text-center value">{entry.amount}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      <hr className="my-4" />

      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Carried Weight</th>
            <th className="whitespace-nowrap w-20">lb</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Armor & Weapons</td>
            <td className="text-center value">{combatWeight()}</td>
          </tr>
          <tr>
            <td>Currency</td>
            <td className="text-center value">{currencyWeight()}</td>
          </tr>
          <tr>
            <td>Equipment</td>
            <td className="text-center value">{equipWeight()}</td>
          </tr>
          <tr>
            <td className="font-bold">Total</td>
            <td className="text-center value">{state.equipment.weight.currLoad}</td>
          </tr>
        </tbody>
      </table>

      <hr className="my-4" />

      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Loads & Lift</th>
            <th className="whitespace-nowrap w-20">lb</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Light Load</td>
            <td className="text-center value">{"<=" + state.equipment.weight.lightLoad}</td>
          </tr>
          <tr>
            <td>Medium Load</td>
            <td className="text-center value">{"<=" + state.equipment.weight.medLoad}</td>
          </tr>
          <tr>
            <td>Heavy Load</td>
            <td className="text-center value">{"<=" + state.equipment.weight.heavyLoad}</td>
          </tr>
          <tr>
            <td>Lift above Head</td>
            <td className="text-center value">{state.equipment.weight.heavyLoad}</td>
          </tr>
          <tr>
            <td>Lift off Ground</td>
            <td className="text-center value">{Number(state.equipment.weight.heavyLoad) * 2}</td>
          </tr>
          <tr>
            <td>Drag & Push</td>
            <td className="text-center value">{Number(state.equipment.weight.heavyLoad) * 5}</td>
          </tr>
          <tr>
            <td className="font-bold">Current Load</td>
            <td className="text-center">{getLoadCategory()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
