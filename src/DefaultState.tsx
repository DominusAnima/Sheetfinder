import { CharacterSize, Alignment, ArmorType, WeaponType, WeaponCategory, Blocks, BioBlock, AbilityBlock, ClassRecordBlock, SkillBlock, HPBlock, CombatBlock, SpecialBlock, MagicBlock, SpellRange, FeatBlock, EquipBlock, MoneyType } from "./charSheet";

const DEFAULT_EQUIP_BLOCK: EquipBlock = {
  inventory: [{name: '-', hp: '0', toggleDescr: true, description: '-', value: '0', weight: '0'}],
  worn: [{name: '-', hp: '0', toggleDescr: true, description: '-', value: '0', weight: '0'}],
  bags: [{name: '-', hp: '0', toggleDescr: true, description: '-', value: '0', weight: '0', capacity: '0'}],
  coinPurse: [{amount: '0', type: MoneyType.GOLD, weight: '0'}],
  weight: {lightLoad: '0', medLoad: '0', heavyLoad: '0', currLoad: 0}
}

const DEFAULT_FEAT_BLOCK: FeatBlock = {
  entries: [{name: '-', toggleDescr: true, description: '-'}]
}

const DEFAULT_MAGIC: Array<MagicBlock> = [
  {casterClass: '-', specialty: {mainSpecial: ['-'], subSpecial: ['-']}, casterLvl: '0', spellSlots: [{saveDC: '0', lvl: '0', total: '0', classAmount: '0', misc: '0'}], closeRange: '0', medRange: '0', longRange: '0', spellsKnown: [{lvl: '0', prepared: '0', name: '0', toggleDescr: true, description: '-', school: '-', duration: '0', range: SpellRange.CLOSE, saveDC: '0'}]}
]

const DEFAULT_SPECIAL_BLOCK: SpecialBlock = {
  entries: [{name: '-', toggleDescr: true, description: '-', usesLimit: '0', used: '0'}]
}

const DEFAULT_COMBAT_BLOCK: CombatBlock = {
  ac: 0,
  touchAC: 0,
  flatFooted: 0,
  acBonuses: {armor: '0', shield: '0', maxDex: 99, deflect: '0', dodge: '0', natural: '0', size: '0', misc: '0'},
  fort: {total: 0, ability: 'con', enh: '0', misc: '0'},
  ref: {total: 0, ability: 'dex', enh: '0', misc: '0'},
  will: {total: 0, ability: 'wis', enh: '0', misc: '0'},
  combatDefense: {total: 0, misc: '0'},
  melee: {total: 0, ability: 'str', misc: '0'},
  ranged: {total: 0, ability: 'dex', misc: '0'},
  combatBonus: {total: 0, ability: 'str', misc: '0'},
  speed: {base: '30', fly: '0', swim: '0', climb: '0'},
  initiative: 0,
  initBonus: '0',
  spellres: '0',
  dmgRed: '0',
  res: '0',
  armorCheckPenalty: 0,
  spellFail: 0,
  equipment: {
    armor: {name: '-', hp: '0', toggleDescr: true, description: '-', weight: '0', value: '0', baseACBonus: '0', maxDex: '99', checkPenalty: '0', armorType: ArmorType.NONE, enh: '0', spellFail: '0'},
    shield: {name: '-', hp: '0', toggleDescr: true, description: '-', weight: '0', value: '0', baseACBonus: '0', enh: '0', maxDex: '0', checkPenalty: '0', spellFail: '0'},
    weapons: [{name: '-', hp: '0', toggleDescr: true, description: '-', weight: '0', value: '0', damage: '-', enh: '0', crit: '-', range: '5', type: WeaponType.SIMPLE, category: WeaponCategory.LIGHT}]
  }
}

const DEFAULT_SKILL_BLOCK: SkillBlock = {
  detailToggle: true,
  totalRanks: 0,
  remainRanks: 0,
  skills: [
    {name: 'Acrobatics', ability: 'dex', classSkill: false, trained: false, armorPenalty: true, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Appraise', ability: 'int', classSkill: false, trained: false, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Bluff', ability: 'cha', classSkill: false, trained: false, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Climb', ability: 'str', classSkill: false, trained: false, armorPenalty: true, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Diplomacy', ability: 'cha', classSkill: false, trained: false, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Disable Device', ability: 'dex', classSkill: false, trained: true, armorPenalty: true, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Disguise', ability: 'cha', classSkill: false, trained: false, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Escape Artist', ability: 'dex', classSkill: false, trained: false, armorPenalty: true, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Fly', ability: 'dex', classSkill: false, trained: false, armorPenalty: true, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Handle Animal', ability: 'cha', classSkill: false, trained: true, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Heal', ability: 'wis', classSkill: false, trained: false, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Intimidate', ability: 'cha', classSkill: false, trained: false, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Linguistics', ability: 'int', classSkill: false, trained: true, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Perception', ability: 'wis', classSkill: false, trained: false, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Ride', ability: 'dex', classSkill: false, trained: false, armorPenalty: true, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Sense Motive', ability: 'wis', classSkill: false, trained: false, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Sleight of Hand', ability: 'dex', classSkill: false, trained: true, armorPenalty: true, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Spellcraft', ability: 'int', classSkill: false, trained: true, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Stealth', ability: 'dex', classSkill: false, trained: false, armorPenalty: true, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Survival', ability: 'wis', classSkill: false, trained: false, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Swim', ability: 'str', classSkill: false, trained: false, armorPenalty: true, totalBonus: 0, ranks: '0', misc: '0'},
    {name: 'Use Magic Device', ability: 'cha', classSkill: false, trained: true, armorPenalty: false, totalBonus: 0, ranks: '0', misc: '0'}
  ]
}

const DEFAULT_HP_BLOCK: HPBlock = {
  maxPoints: 0,
  bonusMaxPoints: '0',
  currentPoints: '0',
  tempPoints: '0',
  nonLethal: '0'
}

const DEFAULT_RECORD_BLOCK: ClassRecordBlock = {
  entries: [{hitDie: '', name: '', bab: '0', skill: '0', favClassBonusType: '', favClassBonus: '0', fort: '0', ref: '0', will: '0', levels: '0', hpGained: ['0']}],
  favClass: '',
  totals: {
    bab: 0, 
    skill: 0, 
    favClassBonus: 0, 
    fort: 0, 
    ref: 0, 
    will: 0,
    levels: 0
  }
}

const DEFAULT_ABILITIES: AbilityBlock = {
  toggleDetail: true,
  abilities: {
    str: {total: 0, mod: 0, base: '0', enh: '0', size: '0', misc: '0', damage: '0', drain: '0'},
    dex: {total: 0, mod: 0, base: '0', enh: '0', size: '0', misc: '0', damage: '0', drain: '0'},
    con: {total: 0, mod: 0, base: '0', enh: '0', size: '0', misc: '0', damage: '0', drain: '0'},
    int: {total: 0, mod: 0, base: '0', enh: '0', size: '0', misc: '0', damage: '0', drain: '0'},
    wis: {total: 0, mod: 0, base: '0', enh: '0', size: '0', misc: '0', damage: '0', drain: '0'},
    cha: {total: 0, mod: 0, base: '0', enh: '0', size: '0', misc: '0', damage: '0', drain: '0'},
  }
}

const DEFAULT_BIO: BioBlock = {
  name: '',
  race: '',
  size: CharacterSize.MEDIUM,
  gender: '',
  height: '',
  weight: '',
  hair: '',
  eyes: '',
  skin: '',
  age: '',
  align: Alignment.N,
  deity: '',
  background: '',
  languages: ''
}

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
  equipment: DEFAULT_EQUIP_BLOCK
}

