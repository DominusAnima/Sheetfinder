import { Abilities, CasterSpecialEntry, CharacterSize, EquipSlot, Item } from "./charSheet";

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

export const EmptyCasterSpecialEntry = (): CasterSpecialEntry => {
  return {
    name: "-",
  };
};

//Pathfinder uses a table to determine carrying capacity of each character based on their strength.
//These values sadly can't be calculated using a function.
//The index represents strength and starts at 0.
//So if you want to get the light load of a str 10 character, look at index 10 in key "light".
export const LOADS: Record<string, number[]> = {
  light: [
    0, 3, 6, 10, 13, 16, 20, 23, 26, 30, 33, 38, 43, 50, 58, 66, 76, 86, 100, 116, 133, 153, 173, 200, 233, 266, 306,
    346, 400, 466,
  ],
  medium: [
    0, 6, 13, 20, 26, 33, 40, 46, 53, 60, 66, 76, 86, 100, 116, 134, 153, 173, 200, 233, 266, 306, 346, 400, 466, 533,
    613, 693, 800, 933,
  ],
  heavy: [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 115, 130, 150, 175, 200, 230, 260, 300, 350, 400, 460, 520, 600, 700,
    800, 920, 1040, 1200, 1400,
  ],
};

export const SPECIAL_SIZE_MODIFIER: Record<CharacterSize, number> = {
  fine: -8,
  diminutive: -4,
  tiny: -2,
  small: -1,
  medium: 0,
  large: 1,
  huge: 2,
  gargantuan: 4,
  colossal: 8,
};
