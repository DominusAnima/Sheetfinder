import { Abilities, EquipSlot, Item } from "./charSheet";

export const ABILITY_TYPES: Array<keyof Abilities> = ["str", "dex", "con", "int", "wis", "cha"];

export const ABILITY_LABELS: { [key in keyof Abilities]: string } = {
  cha: "Charisma",
  con: "Constitution",
  dex: "Dexterity",
  int: "Intelligence",
  str: "Strength",
  wis: "Wisdom",
};
export const makeEmptyItem = (slot: EquipSlot): Item => {
  return {
    description: "",
    hp: "",
    name: "",
    qtyOrUses: "",
    slot,
    toggleDescr: false,
    value: "",
    weight: "",
  };
};
