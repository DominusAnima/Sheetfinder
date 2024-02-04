import { DEFAULT_MAGIC, DEFAULT_STATE, buildClassRecordEntry } from "./DefaultState";
import {
  Abilities,
  ArmorType,
  Bag,
  BioBlock,
  Blocks,
  CasterSpecialEntry,
  CasterSpecialty,
  CharacterSize,
  ClassEntry,
  EquipSlot,
  Feat,
  Item,
  Money,
  Skill,
  SpecialEntry,
  SpeedList,
  Spell,
  SpellSlot,
} from "./charSheet";
import {
  ABILITY_TYPES,
  EmptyCasterSpecialEntry,
  LOADS,
  SPECIAL_SIZE_MODIFIER,
  emptySpell,
  makeEmptyItem,
} from "./constants";

export type ReducerAction =
  | ChangeWeaponFieldAction
  | ChangeArmorTypeAction
  | ChangeArmorFieldAction
  | ChangeCombatFieldAction
  | ChangeSpeedAction
  | RemoveSpellAction
  | AddSpellAction
  | ChangeSpellFieldAction
  | ToggleSpellDescrAction
  | ChangeSpellSlotFieldAction
  | RemoveCasterSpecialAction
  | ChangeCasterSpecialFieldAction
  | AddCasterSpecialAction
  | ChangeMagicFieldAction
  | changeManeuverBonusAction
  | AddBagAction
  | RemoveBagAction
  | ChangeMoneyFieldAction
  | ToggleBagDescrAction
  | ChangeBagFieldAction
  | RemoveWornItemAction
  | ChangeWornItemFieldAction
  | ToggleWornDescrAction
  | unequipItemAction
  | equipItemAction
  | AddInventoryEntryAction
  | RemoveInventoryEntryAction
  | ChangeInventoryEntrySlotAction
  | ChangeInventoryEntryFieldAction
  | ToggleEquipItemDescrAction
  | ChangeFeatEntryFieldAction
  | ToggleFeatDetailAction
  | RemoveFeatEntryAction
  | AddFeatEntryAction
  | RemoveSpecialEntryAction
  | RemoveSkillAction
  | ResetAction
  | changeSkillAbilAction
  | AddSkillAction
  | AddSpecialEntryAction
  | changeSpecialEntryFieldAction
  | toggleSpecialDetailAction
  | changeAttackBonusAction
  | changeSaveBonusAction
  | changeACBonusAction
  | toggleSkillAction
  | ChangeSkillFieldAction
  | ChangeClassEntryFieldAction
  | AddClassEntryAction
  | RemoveClassEntryAction
  | ChangeHPFieldAction
  | ChangeBioAction
  | RecalculateAction
  | ChangeAbilFieldAction
  | ChangeFavClassAction
  | AddMagicBlockAction
  | RemoveMagicBlockAction;

type RecalculateAction = {
  type: "recalculate";
};

type ResetAction = {
  type: "reset";
};

type ChangeBioAction = {
  type: "changeBio";
  payload: Partial<BioBlock>;
};

type ChangeAbilFieldAction = {
  type: "changeAbilities";
  payload: {
    ability: keyof Abilities;
    field: "base" | "enh" | "size" | "misc" | "damage" | "drain";
    value: string;
  };
};

type ChangeHPFieldAction = {
  type: "changeHPField";
  payload: {
    field: "bonusMaxPoints" | "currentPoints" | "tempPoints" | "nonLethal";
    value: string;
  };
};

type ChangeClassEntryFieldAction = {
  type: "changeClassEntryField";
  payload: {
    entryIndex: number;
    field: keyof ClassEntry;
    value: string;
  };
};

type AddClassEntryAction = {
  type: "addClassEntry";
};
type RemoveClassEntryAction = {
  type: "removeClassEntry";
  payload: {
    index: number;
  };
};

type ChangeSkillFieldAction = {
  type: "changeSkillField";
  payload: {
    skillIndex: number;
    field: "name" | "ranks" | "misc";
    value: string;
  };
};

type changeSkillAbilAction = {
  type: "changeSkillAbil";
  payload: {
    index: number;
    value: keyof Abilities;
  };
};

type toggleSkillAction = {
  type: "toggleSkill";
  payload: {
    skillIndex: number;
    field: "classSkill" | "trained";
  };
};

type changeACBonusAction = {
  type: "changeACBonus";
  payload: {
    field: "dodge" | "deflect" | "natural" | "size" | "misc";
    value: string;
  };
};

type changeSaveBonusAction = {
  type: "changeSaveBonus";
  payload: {
    saveType: "fort" | "ref" | "will";
    field: "enh" | "misc";
    value: string;
  };
};

type changeAttackBonusAction = {
  type: "changeAttackBonus";
  payload: {
    attackType: "melee" | "ranged" | "combatDefense" | "combatBonus";
    field: "misc";
    value: string;
  };
};

type changeManeuverBonusAction = {
  type: "changeManeuverBonus";
  payload: {
    maneuverType: "combatBonus" | "combatDefense";
    value: string;
  };
};

type toggleSpecialDetailAction = {
  type: "toggleSpecialDetail";
  payload: { index: number };
};

type changeSpecialEntryFieldAction = {
  type: "changeSpecialEntryField";
  payload: {
    field: "name" | "description" | "usesLimit" | "used";
    index: number;
    value: string;
  };
};

type AddSpecialEntryAction = {
  type: "addSpecialEntry";
};

type AddSkillAction = {
  type: "addSkill";
};

type RemoveSkillAction = {
  type: "removeSkill";
  payload: {
    skillIndex: number;
  };
};

type RemoveSpecialEntryAction = {
  type: "removeSpecialEntry";
  payload: {
    entry: SpecialEntry;
  };
};

type AddFeatEntryAction = {
  type: "addFeatEntry";
};

type RemoveFeatEntryAction = {
  type: "removeFeatEntry";
  payload: {
    entry: Feat;
  };
};

type ToggleFeatDetailAction = {
  type: "toggleFeatDetail";
  payload: {
    index: number;
  };
};

type ChangeFeatEntryFieldAction = {
  type: "changeFeatEntryField";
  payload: {
    field: "name" | "description";
    index: number;
    value: string;
  };
};

type ToggleEquipItemDescrAction = {
  type: "toggleEquipItemDescr";
  payload: {
    entry: Item;
  };
};

type ChangeInventoryEntryFieldAction = {
  type: "changeInventoryEntryField";
  payload: {
    field: "name" | "hp" | "weight" | "value" | "qtyOrUses" | "description";
    index: number;
    value: string;
  };
};

type ChangeInventoryEntrySlotAction = {
  type: "changeInventoryEntrySlot";
  payload: {
    index: number;
    value: EquipSlot;
  };
};

type RemoveInventoryEntryAction = {
  type: "removeInventoryEntry";
  payload: {
    entry: Item;
  };
};

type AddInventoryEntryAction = {
  type: "addInventoryEntry";
};

type equipItemAction = {
  type: "equipItem";
  payload: {
    item: Item;
  };
};

type unequipItemAction = {
  type: "unequipItem";
  payload: {
    item: Item;
  };
};

type ToggleWornDescrAction = {
  type: "toggleWornDesc";
  payload: {
    item: Item;
  };
};

type ChangeWornItemFieldAction = {
  type: "changeWornItemField";
  payload: {
    field: "name" | "hp" | "weight" | "value" | "qtyOrUses" | "description";
    item: Item;
    value: string;
  };
};

type RemoveWornItemAction = {
  type: "removeWornItem";
  payload: {
    item: Item;
  };
};

type ChangeBagFieldAction = {
  type: "changeBagField";
  payload: {
    field: "name" | "hp" | "weight" | "value" | "qtyOrUses" | "description" | "capacity";
    bag: Bag;
    value: string;
  };
};

type ToggleBagDescrAction = {
  type: "toggleBagDescr";
  payload: {
    bag: Bag;
  };
};

type ChangeMoneyFieldAction = {
  type: "changeMoneyField";
  payload: {
    field: "amount" | "weight";
    entry: Money;
    value: string;
  };
};

type RemoveBagAction = {
  type: "removeBag";
  payload: {
    bag: Bag;
  };
};

type AddBagAction = {
  type: "addBag";
};

type ChangeMagicFieldAction = {
  type: "changeMagicField";
  payload: {
    field: "casterClass" | "casterLvl";
    value: string;
    index: number;
  };
};

type AddCasterSpecialAction = {
  type: "addCasterSpecial";
  payload: {
    specialType: keyof CasterSpecialty;
    index: number;
  };
};

type ChangeCasterSpecialFieldAction = {
  type: "changeCasterSpecialField";
  payload: {
    specialType: keyof CasterSpecialty;
    entry: CasterSpecialEntry;
    value: string;
    index: number;
  };
};

type RemoveCasterSpecialAction = {
  type: "removeCasterSpecial";
  payload: {
    specialType: keyof CasterSpecialty;
    entry: CasterSpecialEntry;
    index: number;
  };
};

type ChangeSpellSlotFieldAction = {
  type: "changeSpellSlotField";
  payload: {
    slot: SpellSlot;
    field: keyof SpellSlot;
    value: string;
    index: number;
  };
};

type ToggleSpellDescrAction = {
  type: "toggleSpellDescr";
  payload: {
    spell: Spell;
    index: number;
  };
};

type ChangeSpellFieldAction = {
  type: "changeSpellField";
  payload: {
    field: "lvl" | "prepared" | "name" | "description" | "school" | "duration" | "range" | "saveType" | "spellRes";
    spell: Spell;
    value: string;
    index: number;
  };
};

type AddSpellAction = {
  type: "addSpell";
  payload: {
    index: number;
  };
};

type RemoveSpellAction = {
  type: "removeSpell";
  payload: {
    spell: Spell;
    index: number;
  };
};

type ChangeSpeedAction = {
  type: "changeSpeed";
  payload: {
    speedType: keyof SpeedList;
    value: string;
  };
};

type ChangeCombatFieldAction = {
  type: "changeCombatField";
  payload: {
    field: "initBonus" | "spellres" | "dmgRed" | "res";
    value: string;
  };
};

type ChangeArmorFieldAction = {
  type: "changeArmorField";
  payload: {
    equipType: "armor" | "shield";
    field: "name" | "baseACBonus" | "maxDex" | "checkPenalty" | "spellFail" | "weight" | "description";
    value: string;
  };
};

type ChangeArmorTypeAction = {
  type: "changeArmorType";
  payload: {
    value: ArmorType;
  };
};

type ChangeWeaponFieldAction = {
  type: "changeWeaponField";
  payload: {
    weaponType: "mainWeapon" | "offhand";
    field: "name" | "damage" | "enh" | "crit" | "range" | "weight" | "description";
    value: string;
  };
};

type ChangeFavClassAction = {
  type: "changeFavClass";
  payload: {
    value: string;
  };
};

type AddMagicBlockAction = {
  type: "addMagicBlock";
};

type RemoveMagicBlockAction = {
  type: "removeMagicBlock";
  payload: {
    index: number;
  };
};

export function reducer(state: Blocks, action: ReducerAction): Blocks {
  switch (action.type) {
    case "recalculate": {
      const newState: Blocks = state;

      //calculate ability score total and modifier
      ABILITY_TYPES.map((ability) => {
        const newAbility = newState.abilityBlock.abilities[ability];
        newAbility.total =
          Number(newAbility.base) +
          Number(newAbility.enh) +
          Number(newAbility.size) +
          Number(newAbility.misc) -
          Number(newAbility.damage) -
          Number(newAbility.drain);
        newAbility.mod = Math.floor((Number(newAbility.total) - 10) / 2);
      });

      //reset totals on class recorder block
      const newClassRecTot = newState.classRecorder.totals;
      newClassRecTot.bab = 0;
      newClassRecTot.favClassBonus = 0;
      newClassRecTot.fort = 0;
      newClassRecTot.ref = 0;
      newClassRecTot.will = 0;
      newClassRecTot.skill = 0;
      newClassRecTot.levels = 0;
      newState.skills.totalRanks = 0;
      //reset max hp
      const newHP = newState.hitPoints;
      newHP.maxPoints = 0;
      //calculate total bab, skill points, favoured bonus, saves and levels before ability modifiers
      newState.classRecorder.entries.forEach((entry) => {
        newClassRecTot.bab += Number(entry.bab);
        newClassRecTot.favClassBonus += Number(entry.favClassBonus) * Number(entry.levels);
        newClassRecTot.fort += Number(entry.fort);
        newClassRecTot.ref += Number(entry.ref);
        newClassRecTot.will += Number(entry.will);
        newClassRecTot.skill += Number(entry.skill) * Number(entry.levels);
        newClassRecTot.levels += Number(entry.levels);
        //calculate max HP
        let classHP = entry.hitDie.match(/(\d+)/); //extracts numbers from a string
        if (classHP && Number(entry.levels) > 0) {
          newHP.maxPoints += Number(classHP[0]) + (Math.floor(Number(classHP[0]) / 2) + 1) * (Number(entry.levels) - 1);
        }
        //check if this is the favoured class and if the favoured bonus is hp or skill point
        if (newState.classRecorder.favClass === entry.name) {
          if (entry.favClassBonusType.localeCompare("hp", undefined, { sensitivity: "accent" }) === 0) {
            newHP.maxPoints += Number(entry.favClassBonus) * Number(entry.levels);
          } else if (entry.favClassBonusType.localeCompare("skill point", undefined, { sensitivity: "accent" }) === 0) {
            newState.skills.totalRanks = Number(entry.favClassBonus) * Number(entry.levels);
          }
        }
      });
      newHP.maxPoints += Number(newState.classRecorder.totals.levels * newState.abilityBlock.abilities.con.mod);
      newHP.maxPoints += Number(newState.hitPoints.bonusMaxPoints);

      //calculate armor classes
      const combatBonuses = newState.combat.acBonuses;
      const newCombatBlock = newState.combat;
      newCombatBlock.ac =
        10 +
        Number(combatBonuses.armor) +
        Number(combatBonuses.shield) +
        Math.min(Number(combatBonuses.maxDex), Number(newState.abilityBlock.abilities.dex.mod)) +
        Number(combatBonuses.size) +
        Number(combatBonuses.dodge) +
        Number(combatBonuses.natural) +
        Number(combatBonuses.deflect) +
        Number(combatBonuses.misc);
      newCombatBlock.touchAC =
        10 +
        Math.min(Number(combatBonuses.maxDex), Number(newState.abilityBlock.abilities.dex.mod)) +
        Number(combatBonuses.size) +
        Number(combatBonuses.dodge) +
        Number(combatBonuses.deflect) +
        Number(combatBonuses.misc);
      newCombatBlock.flatFooted =
        10 +
        Number(combatBonuses.armor) +
        Number(combatBonuses.shield) +
        Number(combatBonuses.size) +
        Number(combatBonuses.natural) +
        Number(combatBonuses.deflect) +
        Number(combatBonuses.misc);

      //set penalties in combat block
      newCombatBlock.armorCheckPenalty =
        Number(newCombatBlock.equipment.armor.checkPenalty) + Number(newCombatBlock.equipment.shield.checkPenalty);
      newCombatBlock.acBonuses.maxDex = Math.min(
        Number(newCombatBlock.equipment.armor.maxDex),
        Number(newCombatBlock.equipment.shield.maxDex)
      );
      newCombatBlock.spellFail =
        Number(newCombatBlock.equipment.armor.spellFail) + Number(newCombatBlock.equipment.shield.spellFail);

      //set initiative
      newCombatBlock.initiative = newState.abilityBlock.abilities.dex.mod + Number(newCombatBlock.initBonus);

      //calculate saving throws
      newCombatBlock.fort.total =
        newClassRecTot.fort +
        newState.abilityBlock.abilities[newCombatBlock.fort.ability].mod +
        Number(newCombatBlock.fort.enh) +
        Number(newCombatBlock.fort.misc);
      newCombatBlock.ref.total =
        newClassRecTot.ref +
        newState.abilityBlock.abilities[newCombatBlock.ref.ability].mod +
        Number(newCombatBlock.ref.enh) +
        Number(newCombatBlock.ref.misc);
      newCombatBlock.will.total =
        newClassRecTot.will +
        newState.abilityBlock.abilities[newCombatBlock.will.ability].mod +
        Number(newCombatBlock.will.enh) +
        Number(newCombatBlock.will.misc);

      //calculate attack bonuses
      newCombatBlock.melee.total =
        newState.abilityBlock.abilities[newCombatBlock.melee.ability].mod +
        newClassRecTot.bab +
        Number(newCombatBlock.melee.misc);
      newCombatBlock.ranged.total =
        newState.abilityBlock.abilities[newCombatBlock.ranged.ability].mod +
        newClassRecTot.bab +
        Number(newCombatBlock.ranged.misc);

      //calculate combat manuevers
      if (
        newState.bio.size === CharacterSize.TINY ||
        newState.bio.size === CharacterSize.DIMINUTIVE ||
        newState.bio.size === CharacterSize.FINE
      ) {
        newCombatBlock.combatBonus.ability = "dex";
      } else {
        newCombatBlock.combatBonus.ability = "str";
      }
      newCombatBlock.combatBonus.total =
        newState.abilityBlock.abilities[newCombatBlock.combatBonus.ability].mod +
        newClassRecTot.bab +
        Number(newCombatBlock.combatBonus.misc) +
        SPECIAL_SIZE_MODIFIER[newState.bio.size];
      newCombatBlock.combatDefense.total =
        10 +
        newState.abilityBlock.abilities.str.mod +
        newState.abilityBlock.abilities.dex.mod +
        newClassRecTot.bab +
        Number(newCombatBlock.acBonuses.dodge) +
        Number(newCombatBlock.acBonuses.deflect) +
        Number(newCombatBlock.combatDefense.misc) +
        SPECIAL_SIZE_MODIFIER[newState.bio.size];

      //calculate skill rank amounts and skill bonus totals
      newState.skills.totalRanks = Math.max(
        0,
        newState.skills.totalRanks +
          newClassRecTot.skill +
          newClassRecTot.levels * newState.abilityBlock.abilities.int.mod
      );
      newState.skills.remainRanks = newState.skills.totalRanks;
      newState.skills.skills.forEach((element) => {
        newState.skills.remainRanks -= Number(element.ranks);
        element.totalBonus = Number(element.ranks) + newState.abilityBlock.abilities[element.ability].mod;
        if (Number(element.ranks) > 0 && element.classSkill) element.totalBonus += 3;
        if (element.armorPenalty) element.totalBonus -= newCombatBlock.armorCheckPenalty;
        element.totalBonus += Number(element.misc);
      });

      //calculate weight
      const newWeight = newState.equipment.weight;
      newWeight.currLoad =
        Number(newCombatBlock.equipment.armor.weight) +
        Number(newCombatBlock.equipment.shield.weight) +
        Number(newCombatBlock.equipment.mainWeapon.weight) +
        Number(newCombatBlock.equipment.offhand.weight);
      newState.equipment.bags.forEach((bag) => (newWeight.currLoad += Number(bag.weight)));
      newState.equipment.coinPurse.forEach(
        (currency) => (newWeight.currLoad += Number(currency.weight) * Number(currency.amount))
      );
      Array.from(Object.values(newState.equipment.worn)).forEach(
        (element) => (newWeight.currLoad += Number(element.weight))
      );
      newState.equipment.inventory.forEach((element) => (newWeight.currLoad += Number(element.weight)));

      //calculate loads
      newState.equipment.weight.lightLoad = LOADS["light"][Math.min(newState.abilityBlock.abilities.str.total, 30)];
      newState.equipment.weight.medLoad = LOADS["medium"][Math.min(newState.abilityBlock.abilities.str.total, 30)];
      newState.equipment.weight.heavyLoad = LOADS["heavy"][Math.min(newState.abilityBlock.abilities.str.total, 30)];

      newState.magic.forEach((e) => {
        //calculate total spell slots and limit available spell slots
        e.spellSlots.forEach(
          (slot) => (
            (slot.total = String(Number(slot.classAmount) + Number(slot.abilityBonus) + Number(slot.misc))),
            (slot.available = String(Math.min(Number(slot.available), Number(slot.total))))
          )
        );

        //claculate spell ranges
        e.closeRange = String(25 + Math.floor(Number(e.casterLvl) / 2) * 5);
        e.medRange = String(100 + Number(e.casterLvl) * 10);
        e.longRange = String(400 + Number(e.casterLvl) * 40);
      });

      return newState;
    }
    case "reset": {
      return reducer(DEFAULT_STATE, { type: "recalculate" });
    }
    case "changeBio": {
      const newState: Blocks = {
        ...state,
        bio: {
          ...state.bio,
          ...action.payload,
        },
      };

      return newState;
    }
    case "changeAbilities": {
      const newState: Blocks = {
        ...state,
        abilityBlock: {
          ...state.abilityBlock,
          abilities: {
            ...state.abilityBlock.abilities,
            [action.payload.ability]: {
              ...state.abilityBlock.abilities[action.payload.ability],
              [action.payload.field]: action.payload.value,
            },
          },
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "changeHPField": {
      const newState: Blocks = {
        ...state,
        hitPoints: {
          ...state.hitPoints,
          [action.payload.field]: action.payload.value,
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "changeClassEntryField": {
      const newState: Blocks = {
        ...state,
        classRecorder: {
          ...state.classRecorder,
          entries: [
            ...state.classRecorder.entries.map((e, i) => {
              if (i === action.payload.entryIndex) {
                return {
                  ...e,
                  [action.payload.field]: action.payload.value,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }

    case "addClassEntry": {
      const newState: Blocks = {
        ...state,
        classRecorder: {
          ...state.classRecorder,
          entries: [...state.classRecorder.entries, buildClassRecordEntry()],
        },
      };
      return newState;
    }

    case "removeClassEntry": {
      const newState: Blocks = {
        ...state,
        classRecorder: {
          ...state.classRecorder,
          entries: state.classRecorder.entries.filter((_e, i) => i !== action.payload.index),
        },
      };
      reducer(newState, { type: "recalculate" });
      return newState;
    }

    case "changeSkillField": {
      const newState: Blocks = {
        ...state,
        skills: {
          ...state.skills,
          skills: [
            ...state.skills.skills.map((e, i) => {
              if (i === action.payload.skillIndex) {
                return {
                  ...e,
                  [action.payload.field]: action.payload.value,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "toggleSkill": {
      const newState: Blocks = {
        ...state,
        skills: {
          ...state.skills,
          skills: [
            ...state.skills.skills.map((e, i) => {
              if (i === action.payload.skillIndex) {
                return {
                  ...e,
                  [action.payload.field]: !state.skills.skills[i][action.payload.field],
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "changeACBonus": {
      const newState: Blocks = {
        ...state,
        combat: {
          ...state.combat,
          acBonuses: {
            ...state.combat.acBonuses,
            [action.payload.field]: action.payload.value,
          },
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "changeSaveBonus": {
      const newState: Blocks = {
        ...state,
        combat: {
          ...state.combat,
          [action.payload.saveType]: {
            ...state.combat[action.payload.saveType],
            [action.payload.field]: action.payload.value,
          },
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "changeAttackBonus": {
      const newState: Blocks = {
        ...state,
        combat: {
          ...state.combat,
          [action.payload.attackType]: {
            ...state.combat[action.payload.attackType],
            [action.payload.field]: action.payload.value,
          },
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "changeManeuverBonus": {
      const newState: Blocks = {
        ...state,
        combat: {
          ...state.combat,
          [action.payload.maneuverType]: {
            ...state.combat[action.payload.maneuverType],
            misc: action.payload.value,
          },
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "toggleSpecialDetail": {
      const newState: Blocks = {
        ...state,
        special: {
          ...state.special,
          entries: [
            ...state.special.entries.map((e, i) => {
              if (i === action.payload.index) {
                return {
                  ...e,
                  toggleDescr: !state.special.entries[i].toggleDescr,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      return newState;
    }
    case "changeSpecialEntryField": {
      const newState: Blocks = {
        ...state,
        special: {
          ...state.special,
          entries: [
            ...state.special.entries.map((e, i) => {
              if (i === action.payload.index) {
                return {
                  ...e,
                  [action.payload.field]: action.payload.value,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      return newState;
    }
    case "addSpecialEntry": {
      const newEntry: SpecialEntry = {
        toggleDescr: true,
        name: "-",
        description: "-",
        usesLimit: "0",
        used: "0",
      };

      const newState: Blocks = {
        ...state,
        special: {
          ...state.special,
          entries: [...state.special.entries, newEntry],
        },
      };

      return newState;
    }
    case "addSkill": {
      const newSkill: Skill = {
        trained: true,
        classSkill: false,
        armorPenalty: false,
        name: "New Skill",
        ability: "int",
        totalBonus: 0,
        ranks: "0",
        misc: "0",
        editable: true,
      };

      const newState: Blocks = {
        ...state,
        skills: {
          ...state.skills,
          skills: [...state.skills.skills, newSkill],
        },
      };

      return newState;
    }
    case "changeSkillAbil": {
      const newState: Blocks = {
        ...state,
        skills: {
          ...state.skills,
          skills: [
            ...state.skills.skills.map((e, i) => {
              if (i === action.payload.index) {
                return {
                  ...e,
                  ability: action.payload.value,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "removeSkill": {
      const newState: Blocks = {
        ...state,
        skills: {
          ...state.skills,
          skills: [...state.skills.skills.filter((skill) => skill !== state.skills.skills[action.payload.skillIndex])],
        },
      };
      reducer(newState, { type: "recalculate" });
      return newState;
    }
    case "removeSpecialEntry": {
      const newState: Blocks = {
        ...state,
        special: {
          ...state.special,
          entries: [...state.special.entries.filter((entry) => entry !== action.payload.entry)],
        },
      };

      return newState;
    }
    case "addFeatEntry": {
      const newFeat: Feat = {
        toggleDescr: true,
        description: "-",
        name: "-",
      };

      const newState: Blocks = {
        ...state,
        featList: {
          ...state.featList,
          entries: [...state.featList.entries, newFeat],
        },
      };

      return newState;
    }
    case "removeFeatEntry": {
      const newState: Blocks = {
        ...state,
        featList: {
          ...state.featList,
          entries: [...state.featList.entries.filter((entry) => entry !== action.payload.entry)],
        },
      };

      return newState;
    }
    case "changeFeatEntryField": {
      const newState: Blocks = {
        ...state,
        featList: {
          ...state.featList,
          entries: [
            ...state.featList.entries.map((e, i) => {
              if (i === action.payload.index) {
                return {
                  ...e,
                  [action.payload.field]: action.payload.value,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      return newState;
    }
    case "toggleFeatDetail": {
      const newState: Blocks = {
        ...state,
        featList: {
          ...state.featList,
          entries: [
            ...state.featList.entries.map((e, i) => {
              if (i === action.payload.index) {
                return {
                  ...e,
                  toggleDescr: !state.featList.entries[i].toggleDescr,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      return newState;
    }
    case "addInventoryEntry": {
      const newEntry: Item = {
        description: "-",
        hp: "-",
        name: "New Item",
        slot: EquipSlot.NONE,
        toggleDescr: true,
        value: "0",
        weight: "0",
        qtyOrUses: "1",
      };

      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          inventory: [...state.equipment.inventory, newEntry],
        },
      };

      return newState;
    }
    case "changeInventoryEntryField": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          inventory: [
            ...state.equipment.inventory.map((e, i) => {
              if (i === action.payload.index) {
                return {
                  ...e,
                  [action.payload.field]: action.payload.value,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "changeInventoryEntrySlot": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          inventory: [
            ...state.equipment.inventory.map((e, i) => {
              if (i === action.payload.index) {
                return {
                  ...e,
                  slot: action.payload.value,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      return newState;
    }
    case "removeInventoryEntry": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          inventory: [...state.equipment.inventory.filter((entry) => entry !== action.payload.entry)],
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "toggleEquipItemDescr": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          inventory: [
            ...state.equipment.inventory.map((e) => {
              if (e === action.payload.entry) {
                return {
                  ...e,
                  toggleDescr: !action.payload.entry.toggleDescr,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      return newState;
    }
    case "equipItem": {
      if (
        JSON.stringify(state.equipment.worn[action.payload.item.slot] as Item) !==
        JSON.stringify(makeEmptyItem(action.payload.item.slot))
      ) {
        const newState: Blocks = {
          ...state,
          equipment: {
            ...state.equipment,
            worn: {
              ...state.equipment.worn,
              [action.payload.item.slot]: action.payload.item,
            },
            inventory: [
              ...state.equipment.inventory.filter((entry) => entry !== action.payload.item),
              state.equipment.worn[action.payload.item.slot] as Item,
            ],
          },
        };

        return newState;
      } else {
        const newState: Blocks = {
          ...state,
          equipment: {
            ...state.equipment,
            worn: {
              ...state.equipment.worn,
              [action.payload.item.slot]: action.payload.item,
            },
            inventory: [...state.equipment.inventory.filter((entry) => entry !== action.payload.item)],
          },
        };

        return newState;
      }
    }
    case "unequipItem": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          worn: {
            ...state.equipment.worn,
            [action.payload.item.slot]: makeEmptyItem(action.payload.item.slot),
          },
          inventory: [...state.equipment.inventory, action.payload.item],
        },
      };

      return newState;
    }
    case "changeWornItemField": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          worn: {
            ...state.equipment.worn,
            [action.payload.item.slot]: {
              ...action.payload.item,
              [action.payload.field]: action.payload.value,
            },
          },
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "toggleWornDesc": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          worn: {
            ...state.equipment.worn,
            [action.payload.item.slot]: {
              ...action.payload.item,
              toggleDescr: !action.payload.item.toggleDescr,
            },
          },
        },
      };

      return newState;
    }
    case "removeWornItem": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          worn: {
            ...state.equipment.worn,
            [action.payload.item.slot]: makeEmptyItem(action.payload.item.slot),
          },
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "changeBagField": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          bags: [
            ...state.equipment.bags.map((e) => {
              if (e === action.payload.bag) {
                return {
                  ...e,
                  [action.payload.field]: action.payload.value,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "toggleBagDescr": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          bags: [
            ...state.equipment.bags.map((e) => {
              if (e === action.payload.bag) {
                return {
                  ...e,
                  toggleDescr: !action.payload.bag.toggleDescr,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      return newState;
    }
    case "changeMoneyField": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          coinPurse: [
            ...state.equipment.coinPurse.map((e) => {
              if (e === action.payload.entry) {
                return {
                  ...e,
                  [action.payload.field]: action.payload.value,
                };
              } else {
                return e;
              }
            }),
          ],
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "removeBag": {
      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          bags: [...state.equipment.bags.filter((entry) => entry !== action.payload.bag)],
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "addBag": {
      const newBag: Bag = {
        ...makeEmptyItem(EquipSlot.NONE),
        capacity: "0",
      };

      const newState: Blocks = {
        ...state,
        equipment: {
          ...state.equipment,
          bags: [...state.equipment.bags, newBag],
        },
      };

      return newState;
    }
    case "addCasterSpecial": {
      const newState: Blocks = {
        ...state,
        magic: [
          ...state.magic.map((e, i) => {
            if (i === action.payload.index) {
              return {
                ...e,
                specialty: {
                  ...e.specialty,
                  [action.payload.specialType]: [...e.specialty[action.payload.specialType], EmptyCasterSpecialEntry()],
                },
              };
            } else {
              return e;
            }
          }),
        ],
      };

      return newState;
    }
    case "changeCasterSpecialField": {
      const newState: Blocks = {
        ...state,
        magic: [
          ...state.magic.map((e, i) => {
            if (i === action.payload.index) {
              return {
                ...e,
                specialty: {
                  ...e.specialty,
                  [action.payload.specialType]: [
                    ...e.specialty[action.payload.specialType].map((e) => {
                      if (e === action.payload.entry) {
                        return {
                          ...e,
                          name: action.payload.value,
                        };
                      } else {
                        return e;
                      }
                    }),
                  ],
                },
              };
            } else {
              return e;
            }
          }),
        ],
      };

      return newState;
    }
    case "changeMagicField": {
      const newState: Blocks = {
        ...state,
        magic: [
          ...state.magic.map((e, i) => {
            if (i === action.payload.index) {
              return { ...e, [action.payload.field]: action.payload.value };
            } else {
              return e;
            }
          }),
        ],
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "removeCasterSpecial": {
      const newState: Blocks = {
        ...state,
        magic: [
          ...state.magic.map((e, i) => {
            if (i === action.payload.index) {
              return {
                ...e,
                specialty: {
                  ...e.specialty,
                  [action.payload.specialType]: [
                    ...e.specialty[action.payload.specialType].filter((entry) => entry !== action.payload.entry),
                  ],
                },
              };
            } else {
              return e;
            }
          }),
        ],
      };

      return newState;
    }
    case "changeSpellSlotField": {
      const newState: Blocks = {
        ...state,
        magic: [
          ...state.magic.map((e, i) => {
            if (i === action.payload.index) {
              return {
                ...e,
                spellSlots: [
                  ...e.spellSlots.map((slot) => {
                    if (slot === action.payload.slot) {
                      return {
                        ...slot,
                        [action.payload.field]: action.payload.value,
                      };
                    } else {
                      return slot;
                    }
                  }),
                ],
              };
            } else {
              return e;
            }
          }),
        ],
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "toggleSpellDescr": {
      const newState: Blocks = {
        ...state,
        magic: [
          ...state.magic.map((e, i) => {
            if (i === action.payload.index) {
              return {
                ...e,
                spellsKnown: [
                  ...e.spellsKnown.map((spell) => {
                    if (spell === action.payload.spell) {
                      return {
                        ...spell,
                        toggleDescr: !spell.toggleDescr,
                      };
                    } else {
                      return spell;
                    }
                  }),
                ],
              };
            } else {
              return e;
            }
          }),
        ],
      };

      return newState;
    }
    case "changeSpellField": {
      const newState: Blocks = {
        ...state,
        magic: [
          ...state.magic.map((e, i) => {
            if (i === action.payload.index) {
              return {
                ...e,
                spellsKnown: [
                  ...e.spellsKnown.map((spell) => {
                    if (spell === action.payload.spell) {
                      return {
                        ...spell,
                        [action.payload.field]: action.payload.value,
                      };
                    } else {
                      return spell;
                    }
                  }),
                ],
              };
            } else {
              return e;
            }
          }),
        ],
      };

      return newState;
    }
    case "addSpell": {
      const newState: Blocks = {
        ...state,
        magic: [
          ...state.magic.map((e, i) => {
            if (i === action.payload.index) {
              return {
                ...e,
                spellsKnown: [...e.spellsKnown, emptySpell()],
              };
            } else {
              return e;
            }
          }),
        ],
      };

      return newState;
    }
    case "removeSpell": {
      const newState: Blocks = {
        ...state,
        magic: [
          ...state.magic.map((e, i) => {
            if (i === action.payload.index) {
              return {
                ...e,
                spellsKnown: e.spellsKnown.filter((spell) => spell !== action.payload.spell),
              };
            } else {
              return e;
            }
          }),
        ],
      };

      return newState;
    }
    case "changeSpeed": {
      const newState: Blocks = {
        ...state,
        combat: {
          ...state.combat,
          speed: {
            ...state.combat.speed,
            [action.payload.speedType]: action.payload.value,
          },
        },
      };

      return newState;
    }
    case "changeCombatField": {
      const newState: Blocks = {
        ...state,
        combat: {
          ...state.combat,
          [action.payload.field]: action.payload.value,
        },
      };

      return newState;
    }
    case "changeArmorField": {
      const newState: Blocks = {
        ...state,
        combat: {
          ...state.combat,
          equipment: {
            ...state.combat.equipment,
            [action.payload.equipType]: {
              ...state.combat.equipment[action.payload.equipType],
              [action.payload.field]: action.payload.value,
            },
          },
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "changeArmorType": {
      const newState: Blocks = {
        ...state,
        combat: {
          ...state.combat,
          equipment: {
            ...state.combat.equipment,
            armor: {
              ...state.combat.equipment.armor,
              armorType: action.payload.value,
            },
          },
        },
      };

      return newState;
    }
    case "changeWeaponField": {
      const newState: Blocks = {
        ...state,
        combat: {
          ...state.combat,
          equipment: {
            ...state.combat.equipment,
            [action.payload.weaponType]: {
              ...state.combat.equipment[action.payload.weaponType],
              [action.payload.field]: action.payload.value,
            },
          },
        },
      };

      reducer(newState, { type: "recalculate" });

      return newState;
    }
    case "changeFavClass": {
      const newState: Blocks = {
        ...state,
        classRecorder: {
          ...state.classRecorder,
          favClass: action.payload.value,
        },
      };

      return newState;
    }
    case "addMagicBlock": {
      const newState: Blocks = {
        ...state,
        magic: [...state.magic, DEFAULT_MAGIC],
      };

      return newState;
    }
    case "removeMagicBlock": {
      const newState: Blocks = {
        ...state,
        magic: state.magic.filter((_block, i) => i !== action.payload.index),
      };

      return newState;
    }
    default: {
      throw Error("Unknown action: " + action);
    }
  }
}
