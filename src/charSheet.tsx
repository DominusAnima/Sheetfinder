export interface Blocks {
  bio: BioBlock;
  abilityBlock: AbilityBlock;
  classRecorder: ClassRecordBlock;
  hitPoints: HPBlock;
  skills: SkillBlock;
  combat: CombatBlock;
  special: SpecialBlock; //active abilities
  magic: Array<MagicBlock>;
  featList: FeatBlock;
  equipment: EquipBlock;
}

export interface BioBlock {
  name: string;
  race: string;
  size: CharacterSize;
  gender: string;
  height: string;
  weight: string;
  hair: string;
  eyes: string;
  skin: string;
  age: string;
  align: Alignment;
  deity: string;
  background: string;
  languages: string;
}

export enum CharacterSize {
  FINE = "fine",
  DIMINUTIVE = "diminutive",
  TINY = "tiny",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  HUGE = "huge",
  GARGANTUAN = "gargantuan",
  COLOSSAL = "colossal",
}

export enum Alignment {
  LG = "lawful good",
  LN = "lawful neutral",
  LE = "lawful evil",
  NG = "neutral good",
  N = "neutral",
  NE = "neutral evil",
  CG = "chaotic good",
  CN = "chaotic neutral",
  CE = "chaotic evil",
}

export interface AbilityBlock {
  abilities: Abilities;
  toggleDetail: boolean;
}

export interface Abilities {
  str: AbilityValues;
  dex: AbilityValues;
  con: AbilityValues;
  int: AbilityValues;
  wis: AbilityValues;
  cha: AbilityValues;
}

export interface AbilityValues {
  total: number;
  mod: number;
  base: string;
  enh: string;
  size: string;
  misc: string;
  damage: string;
  drain: string;
}

export interface ClassRecordBlock {
  entries: Array<ClassEntry>;
  favClass: string;
  totals: ClassStatTotals;
}

export interface ClassEntry {
  hitDie: string;
  name: string;
  bab: string;
  skill: string;
  favClassBonusType: string;
  favClassBonus: string;
  fort: string;
  ref: string;
  will: string;
  levels: string;
  hpGained: Array<string>;
}

//summed up from entries, no ability modifiers
export interface ClassStatTotals {
  bab: number;
  skill: number;
  favClassBonus: number;
  fort: number;
  ref: number;
  will: number;
  levels: number;
}

export interface HPBlock {
  maxPoints: number;
  bonusMaxPoints: string;
  currentPoints: string;
  tempPoints: string;
  nonLethal: string;
}

//pull total skill ranks from ClassrecordBlock.ClassStatTotals.skill
export interface SkillBlock {
  detailToggle: boolean;
  totalRanks: number;
  remainRanks: number;
  skills: Array<Skill>;
}

export interface Skill {
  name: string;
  ability: keyof Abilities;
  classSkill: boolean;
  trained: boolean;
  armorPenalty: boolean;
  totalBonus: number;
  ranks: string;
  misc: string;
  editable: boolean;
}

export interface CombatBlock {
  ac: number;
  touchAC: number;
  flatFooted: number;
  acBonuses: ArmorClass;
  fort: SaveThrow;
  ref: SaveThrow;
  will: SaveThrow;
  combatDefense: ComManDef;
  melee: Attack;
  ranged: Attack;
  combatBonus: ComManOff;
  speed: SpeedList;
  initiative: number;
  initBonus: string;
  spellres: string;
  dmgRed: string;
  res: string;
  spellFail: number;
  armorCheckPenalty: number;
  equipment: CombatEquip;
}

export interface ArmorClass {
  armor: string;
  shield: string;
  maxDex: number;
  dodge: string;
  deflect: string;
  natural: string;
  size: string;
  misc: string;
}

export interface SaveThrow {
  total: number;
  ability: keyof Abilities;
  enh: string;
  misc: string;
}

export interface ComManDef {
  total: number;
  misc: string;
}

export interface ComManOff {
  total: number;
  ability: keyof Abilities;
  misc: string;
}

export interface Attack {
  total: number;
  ability: keyof Abilities;
  misc: string;
}

export interface SpeedList {
  base: string;
  fly: string;
  swim: string;
  climb: string;
}

export interface CombatEquip {
  armor: Armor;
  shield: Shield;
  weapons: Array<Weapon>;
}

export interface SpecialBlock {
  entries: Array<SpecialEntry>;
}

export interface SpecialEntry {
  name: string;
  toggleDescr: boolean;
  description: string;
  usesLimit: string;
  used: string;
}

export interface MagicBlock {
  casterClass: string;
  specialty: CasterSpecialty;
  casterLvl: string;
  spellSlots: Array<SpellSlot>;
  closeRange: string;
  medRange: string;
  longRange: string;
  spellsKnown: Array<Spell>;
}

export interface CasterSpecialty {
  mainSpecial: Array<string>;
  subSpecial: Array<string>;
}

export enum SpellRange {
  CLOSE = "close",
  MEDIUM = "medium",
  LONG = "long",
}

export interface SpellSlot {
  saveDC: string;
  lvl: string;
  total: string;
  classAmount: string;
  misc: string;
  available: string;
}

export interface Spell {
  lvl: string;
  prepared: string;
  name: string;
  toggleDescr: boolean;
  description: string;
  school: string;
  duration: string;
  range: SpellRange;
  saveType: string;
}

export interface FeatBlock {
  entries: Array<Feat>;
}

export interface Feat {
  name: string;
  toggleDescr: boolean;
  description: string;
}

export enum EquipSlot {
  BELT = "belt",
  BODY = "body",
  CHEST = "chest",
  EYES = "eyes",
  FEET = "feet",
  HANDS = "hands",
  HEAD = "head",
  HEADBAND = "headband",
  NECK = "neck",
  RING_1 = "ring_1",
  RING_2 = "ring_2",
  SHOULDERS = "shoulders",
  WRIST = "wrist",
  NONE = "none",
}

export interface EquipBlock {
  inventory: Array<Item>;
  worn: Partial<Record<EquipSlot, Item>>;
  bags: Array<Bag>;
  coinPurse: Array<Money>;
  weight: CarriedLoad;
  toggleDetail: boolean;
}

export interface Item {
  name: string;
  hp: string;
  toggleDescr: boolean;
  description: string;
  weight: string;
  value: string;
  slot: EquipSlot;
  qtyOrUses: string;
}

export interface Armor extends Item {
  baseACBonus: string;
  maxDex: string;
  checkPenalty: string;
  armorType: ArmorType;
  enh: string;
  spellFail: string;
}

export enum ArmorType {
  NONE = "none",
  LIGHT = "light",
  MEDIUM = "medium",
  HEAVY = "heavy",
}

export interface Weapon extends Item {
  damage: string;
  enh: string;
  crit: string;
  range: string;
  type: WeaponType;
  category: WeaponCategory;
}

export enum WeaponType {
  SIMPLE = "simple",
  MARTIAL = "martial",
  EXOTIC = "exotic",
}

export enum WeaponCategory {
  LIGHT = "light",
  ONE_HANDED = "one handed",
  TWO_HANDED = "two handed",
  RANGED = "ranged",
  AMMO = "ammo",
}

export interface Shield extends Item {
  baseACBonus: string;
  maxDex: string;
  checkPenalty: string;
  enh: string;
  spellFail: string;
}

export interface Bag extends Item {
  capacity: string;
}

export interface Money {
  type: MoneyType;
  amount: string;
  weight: string;
}

export enum MoneyType {
  COPPER = "copper",
  SILVER = "silver",
  GOLD = "gold",
  PLATINUM = "platinum",
}

export interface CarriedLoad {
  lightLoad: number;
  medLoad: number;
  heavyLoad: number;
  currLoad: number;
}
