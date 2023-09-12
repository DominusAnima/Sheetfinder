import { Abilities } from "./charSheet";

export const ABILITY_TYPES: Array<keyof Abilities> = ["str", "dex", "con", "int", "wis", "cha"];

export const ABILITY_LABELS: { [key in keyof Abilities]: string } = {
  cha: "Charisma",
  con: "Constitution",
  dex: "Dexterity",
  int: "Intelligence",
  str: "Strength",
  wis: "Wisdom",
};
