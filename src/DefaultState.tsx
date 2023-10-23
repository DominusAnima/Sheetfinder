import {
  CharacterSize,
  Alignment,
  ArmorType,
  WeaponType,
  WeaponCategory,
  Blocks,
  BioBlock,
  AbilityBlock,
  ClassRecordBlock,
  SkillBlock,
  HPBlock,
  CombatBlock,
  SpecialBlock,
  MagicBlock,
  SpellRange,
  FeatBlock,
  EquipBlock,
  MoneyType,
  ClassEntry,
  EquipSlot,
} from "./charSheet";
import { initSpellSlot, makeEmptyItem } from "./constants";

const DEFAULT_EQUIP_BLOCK: EquipBlock = {
  toggleDetail: true,
  inventory: [makeEmptyItem(EquipSlot.NONE)],
  worn: {
    belt: makeEmptyItem(EquipSlot.BELT),
    body: makeEmptyItem(EquipSlot.BODY),
    chest: makeEmptyItem(EquipSlot.CHEST),
    eyes: makeEmptyItem(EquipSlot.EYES),
    feet: makeEmptyItem(EquipSlot.FEET),
    hands: makeEmptyItem(EquipSlot.HANDS),
    head: makeEmptyItem(EquipSlot.HEAD),
    headband: makeEmptyItem(EquipSlot.HEADBAND),
    neck: makeEmptyItem(EquipSlot.NECK),
    ring_1: makeEmptyItem(EquipSlot.RING_1),
    ring_2: makeEmptyItem(EquipSlot.RING_2),
    shoulders: makeEmptyItem(EquipSlot.SHOULDERS),
    wrist: makeEmptyItem(EquipSlot.WRIST),
  },
  bags: [
    {
      ...makeEmptyItem(EquipSlot.NONE),
      capacity: "0",
    },
  ],
  coinPurse: [
    { amount: "0", type: MoneyType.PLATINUM, weight: "0" },
    { amount: "0", type: MoneyType.GOLD, weight: "0" },
    { amount: "0", type: MoneyType.SILVER, weight: "0" },
    { amount: "0", type: MoneyType.COPPER, weight: "0" },
  ],
  weight: { lightLoad: 0, medLoad: 0, heavyLoad: 0, currLoad: 0 },
};

const DEFAULT_FEAT_BLOCK: FeatBlock = {
  entries: [{ name: "-", toggleDescr: true, description: "-" }],
};

const DEFAULT_MAGIC: MagicBlock = {
  detailToggle: true,
  casterClass: "-",
  specialty: { mainSpecial: [{ name: "-" }], subSpecial: [{ name: "-" }] },
  casterLvl: "0",
  spellSlots: [
    initSpellSlot("0"),
    initSpellSlot("1"),
    initSpellSlot("2"),
    initSpellSlot("3"),
    initSpellSlot("4"),
    initSpellSlot("5"),
    initSpellSlot("6"),
    initSpellSlot("7"),
    initSpellSlot("8"),
    initSpellSlot("9"),
  ],
  closeRange: "0",
  medRange: "0",
  longRange: "0",
  spellsKnown: [
    {
      lvl: "0",
      prepared: "0",
      name: "0",
      toggleDescr: true,
      description: "-",
      school: "-",
      duration: "0",
      range: SpellRange.CLOSE,
      saveType: "0",
    },
  ],
};

const DEFAULT_SPECIAL_BLOCK: SpecialBlock = {
  entries: [
    {
      name: "-",
      toggleDescr: true,
      description: "-",
      usesLimit: "0",
      used: "0",
    },
  ],
};

const DEFAULT_COMBAT_BLOCK: CombatBlock = {
  ac: 0,
  touchAC: 0,
  flatFooted: 0,
  acBonuses: {
    armor: "0",
    shield: "0",
    maxDex: 99,
    deflect: "0",
    dodge: "0",
    natural: "0",
    size: "0",
    misc: "0",
  },
  fort: { total: 0, ability: "con", enh: "0", misc: "0" },
  ref: { total: 0, ability: "dex", enh: "0", misc: "0" },
  will: { total: 0, ability: "wis", enh: "0", misc: "0" },
  combatDefense: { total: 0, misc: "0" },
  melee: { total: 0, ability: "str", misc: "0" },
  ranged: { total: 0, ability: "dex", misc: "0" },
  combatBonus: { total: 0, ability: "str", misc: "0" },
  speed: { base: "30", fly: "0", swim: "0", climb: "0" },
  initiative: 0,
  initBonus: "0",
  spellres: "0",
  dmgRed: "0",
  res: "0",
  armorCheckPenalty: 0,
  spellFail: 0,
  equipment: {
    armor: {
      name: "-",
      hp: "0",
      toggleDescr: true,
      description: "-",
      weight: "0",
      value: "0",
      slot: EquipSlot.CHEST,
      baseACBonus: "0",
      maxDex: "99",
      checkPenalty: "0",
      armorType: ArmorType.NONE,
      enh: "0",
      spellFail: "0",
      qtyOrUses: "1",
    },
    shield: {
      name: "-",
      hp: "0",
      toggleDescr: true,
      description: "-",
      weight: "0",
      value: "0",
      slot: EquipSlot.NONE,
      baseACBonus: "0",
      enh: "0",
      maxDex: "0",
      checkPenalty: "0",
      spellFail: "0",
      qtyOrUses: "1",
    },
    weapons: [
      {
        name: "-",
        hp: "0",
        toggleDescr: true,
        description: "-",
        weight: "0",
        value: "0",
        damage: "-",
        enh: "0",
        crit: "-",
        range: "5",
        type: WeaponType.SIMPLE,
        category: WeaponCategory.LIGHT,
        slot: EquipSlot.NONE,
        qtyOrUses: "1",
      },
    ],
  },
};

const DEFAULT_SKILL_BLOCK: SkillBlock = {
  detailToggle: true,
  totalRanks: 0,
  remainRanks: 0,
  skills: [
    {
      name: "Acrobatics",
      ability: "dex",
      classSkill: false,
      trained: false,
      armorPenalty: true,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Appraise",
      ability: "int",
      classSkill: false,
      trained: false,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Bluff",
      ability: "cha",
      classSkill: false,
      trained: false,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Climb",
      ability: "str",
      classSkill: false,
      trained: false,
      armorPenalty: true,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Diplomacy",
      ability: "cha",
      classSkill: false,
      trained: false,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Disable Device",
      ability: "dex",
      classSkill: false,
      trained: true,
      armorPenalty: true,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Disguise",
      ability: "cha",
      classSkill: false,
      trained: false,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Escape Artist",
      ability: "dex",
      classSkill: false,
      trained: false,
      armorPenalty: true,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Fly",
      ability: "dex",
      classSkill: false,
      trained: false,
      armorPenalty: true,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Handle Animal",
      ability: "cha",
      classSkill: false,
      trained: true,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Heal",
      ability: "wis",
      classSkill: false,
      trained: false,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Intimidate",
      ability: "cha",
      classSkill: false,
      trained: false,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Linguistics",
      ability: "int",
      classSkill: false,
      trained: true,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Perception",
      ability: "wis",
      classSkill: false,
      trained: false,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Ride",
      ability: "dex",
      classSkill: false,
      trained: false,
      armorPenalty: true,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Sense Motive",
      ability: "wis",
      classSkill: false,
      trained: false,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Sleight of Hand",
      ability: "dex",
      classSkill: false,
      trained: true,
      armorPenalty: true,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Spellcraft",
      ability: "int",
      classSkill: false,
      trained: true,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Stealth",
      ability: "dex",
      classSkill: false,
      trained: false,
      armorPenalty: true,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Survival",
      ability: "wis",
      classSkill: false,
      trained: false,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Swim",
      ability: "str",
      classSkill: false,
      trained: false,
      armorPenalty: true,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
    {
      name: "Use Magic Device",
      ability: "cha",
      classSkill: false,
      trained: true,
      armorPenalty: false,
      totalBonus: 0,
      ranks: "0",
      misc: "0",
      editable: false,
    },
  ],
};

const DEFAULT_HP_BLOCK: HPBlock = {
  maxPoints: 0,
  bonusMaxPoints: "0",
  currentPoints: "0",
  tempPoints: "0",
  nonLethal: "0",
};

export const buildClassRecordEntry = (): ClassEntry => {
  return {
    hitDie: "",
    name: "",
    bab: "0",
    skill: "0",
    favClassBonusType: "",
    favClassBonus: "0",
    fort: "0",
    ref: "0",
    will: "0",
    levels: "0",
  };
};

const DEFAULT_RECORD_BLOCK: ClassRecordBlock = {
  entries: [buildClassRecordEntry()],
  favClass: "",
  totals: {
    bab: 0,
    skill: 0,
    favClassBonus: 0,
    fort: 0,
    ref: 0,
    will: 0,
    levels: 0,
  },
};

const DEFAULT_ABILITIES: AbilityBlock = {
  toggleDetail: true,
  abilities: {
    str: {
      total: 0,
      mod: 0,
      base: "0",
      enh: "0",
      size: "0",
      misc: "0",
      damage: "0",
      drain: "0",
    },
    dex: {
      total: 0,
      mod: 0,
      base: "0",
      enh: "0",
      size: "0",
      misc: "0",
      damage: "0",
      drain: "0",
    },
    con: {
      total: 0,
      mod: 0,
      base: "0",
      enh: "0",
      size: "0",
      misc: "0",
      damage: "0",
      drain: "0",
    },
    int: {
      total: 0,
      mod: 0,
      base: "0",
      enh: "0",
      size: "0",
      misc: "0",
      damage: "0",
      drain: "0",
    },
    wis: {
      total: 0,
      mod: 0,
      base: "0",
      enh: "0",
      size: "0",
      misc: "0",
      damage: "0",
      drain: "0",
    },
    cha: {
      total: 0,
      mod: 0,
      base: "0",
      enh: "0",
      size: "0",
      misc: "0",
      damage: "0",
      drain: "0",
    },
  },
};

const DEFAULT_BIO: BioBlock = {
  name: "",
  race: "",
  size: CharacterSize.MEDIUM,
  gender: "",
  height: "",
  weight: "",
  hair: "",
  eyes: "",
  skin: "",
  age: "",
  align: Alignment.N,
  deity: "",
  background: "",
  languages: "",
};

export const DEFAULT_STATE: Blocks = {
  bio: DEFAULT_BIO,
  abilityBlock: DEFAULT_ABILITIES,
  classRecorder: DEFAULT_RECORD_BLOCK,
  hitPoints: DEFAULT_HP_BLOCK,
  skills: DEFAULT_SKILL_BLOCK,
  combat: DEFAULT_COMBAT_BLOCK,
  special: DEFAULT_SPECIAL_BLOCK, //active abilities
  magic: DEFAULT_MAGIC,
  featList: DEFAULT_FEAT_BLOCK,
  equipment: DEFAULT_EQUIP_BLOCK,
};
