import { Abilities, BioBlock, Blocks, Skill, SpecialEntry } from "./charSheet";
import { ABILITY_TYPES } from "./constants";

export type ReducerAction =
  | changeSkillAbilAction
  | AddSkillAction
  | AddSpecialEntryAction
  | changeSpecialEntryFieldAction
  | toggleSpecialDetailAction
  | changeAttackBonusAction
  | changeSaveBonusAction
  | changeACBonusAction
  | toggleSkillDetailAction
  | toggleSkillAction
  | ChangeSkillFieldAction
  | ChangeClassEntryFieldAction
  | ChangeHPFieldAction
  | AbilToggleAction
  | ChangeBioAction
  | RecalculateAction
  | ChangeAbilFieldAction;

type RecalculateAction = {
  type: "recalculate";
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

type AbilToggleAction = {
  type: "abilToggle";
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
    field:
      | "hitDie"
      | "name"
      | "bab"
      | "skill"
      | "favClassBonusType"
      | "favClassBonus"
      | "fort"
      | "ref"
      | "will"
      | "levels";
    value: string;
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

type toggleSkillDetailAction = {
  type: "toggleSkillDetail";
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
      //reset max hp
      const newHP = newState.hitPoints;
      newHP.maxPoints = 0;
      //calculate total bab, skill points, favoured bonus, saves and levels before ability modifiers
      newState.classRecorder.entries.forEach((entry) => {
        newClassRecTot.bab += Number(entry.bab);
        newClassRecTot.favClassBonus += Number(entry.favClassBonus);
        newClassRecTot.fort += Number(entry.fort);
        newClassRecTot.ref += Number(entry.ref);
        newClassRecTot.will += Number(entry.will);
        newClassRecTot.skill += Number(entry.skill) * Number(entry.levels);
        newClassRecTot.levels += Number(entry.levels);
        //calculate max HP
        newHP.maxPoints += Number(entry.levels) * newState.abilityBlock.abilities.con.mod;
        entry.hpGained.forEach((element) => {
          newHP.maxPoints += Number(element);
        });
      });
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
      newCombatBlock.combatBonus.total =
        newState.abilityBlock.abilities[newCombatBlock.combatBonus.ability].mod +
        newClassRecTot.bab +
        Number(newCombatBlock.combatBonus.misc);
      newCombatBlock.combatDefense.total =
        10 +
        newState.abilityBlock.abilities.str.mod +
        newState.abilityBlock.abilities.dex.mod +
        newClassRecTot.bab +
        Number(newCombatBlock.acBonuses.dodge) +
        Number(newCombatBlock.acBonuses.deflect) +
        Number(newCombatBlock.combatDefense.misc);

      //calculate skill rank amounts and skill bonus totals
      newState.skills.totalRanks =
        newClassRecTot.skill + newClassRecTot.levels * newState.abilityBlock.abilities.int.mod;
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
        Number(newCombatBlock.equipment.armor.weight) + Number(newCombatBlock.equipment.shield.weight);
      newCombatBlock.equipment.weapons.forEach((weapon) => (newWeight.currLoad += Number(weapon.weight)));
      newState.equipment.bags.forEach((bag) => (newWeight.currLoad += Number(bag.weight)));
      newState.equipment.coinPurse.forEach(
        (currency) => (newWeight.currLoad += Number(currency.weight) * Number(currency.amount))
      );
      newState.equipment.worn.forEach((element) => (newWeight.currLoad += Number(element.weight)));
      newState.equipment.inventory.forEach((element) => (newWeight.currLoad += Number(element.weight)));

      return newState;
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
    case "abilToggle": {
      const newState: Blocks = {
        ...state,
        abilityBlock: {
          ...state.abilityBlock,
          toggleDetail: !state.abilityBlock.toggleDetail,
        },
      };

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
    case "toggleSkillDetail": {
      const newState: Blocks = {
        ...state,
        skills: {
          ...state.skills,
          detailToggle: !state.skills.detailToggle,
        },
      };

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
    default: {
      throw Error("Unknown action: " + action);
    }
  }
}
