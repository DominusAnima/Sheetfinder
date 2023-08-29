import { Abilities, Alignment, Blocks, CharacterSize } from "./charSheet";
import { ABILITY_TYPES } from "./constants";

export type ReducerAction = ChangeHPFieldAction | AbilToggleAction | ChangeBioAlignAction | ChangeBioSizeAction | ChangeBioFieldAction | RecalculateAction | ChangeAbilFieldAction

type RecalculateAction = {
  type: "recalculate",
}

type ChangeBioFieldAction = {
  type: 'changeBioField',
  payload: {
    field: 'name' | 'race' | 'gender' | 'height' | 'weight' | 'hair' | 'eyes' | 'skin' | 'age' | 'deity' | 'background' | 'languages',
    value: string
  }
}

type ChangeBioSizeAction = {
  type: 'changeBioSize',
  payload: {
    value: CharacterSize
  }
}

type ChangeBioAlignAction = {
  type: 'changeBioAlign',
  payload: {
    value: Alignment
  }

} 

type ChangeAbilFieldAction = {
  type: 'changeAbilities',
  payload: {
    ability: keyof Abilities,
    field: 'base' | 'enh' | 'size' | 'misc' | 'damage' | 'drain',
    value: string
  }
}

type AbilToggleAction = {
  type: 'abilToggle',
}

type ChangeHPFieldAction = {
  type: 'changeHPField'
  payload: {
    field: 'bonusMaxPoints' | 'currentPoints' | 'tempPoints' | 'nonLethal',
    value: string
  }
}

export function reducer(state: Blocks, action: ReducerAction): Blocks {
  switch (action.type) {
    case 'recalculate': {
      const newState: Blocks = state;

      //calculate ability score total and modifier
      ABILITY_TYPES.map((ability) => {
        const newAbility = newState.abilityBlock.abilities[ability]
        newAbility.total = 
          Number(newAbility.base)
          + Number(newAbility.enh) 
          + Number(newAbility.size) 
          + Number(newAbility.misc) 
          - Number(newAbility.damage)
          - Number(newAbility.drain);
        newAbility.mod = Math.floor((Number(newAbility.total) - 10)/2)
      })

      //reset totals on class recorder block
      const newClassRecTot = newState.classRecorder.totals
      newClassRecTot.bab = 0
      newClassRecTot.favClassBonus = 0
      newClassRecTot.fort = 0
      newClassRecTot.ref = 0
      newClassRecTot.will = 0
      newClassRecTot.skill = 0
      newClassRecTot.levels = 0
      //reset max hp
      const newHP = newState.hitPoints
      newHP.maxPoints = 0
      //calculate total bab, skill points, favoured bonus, saves and levels before ability modifiers
      newState.classRecorder.entries.forEach(entry => {
        newClassRecTot.bab += Number(entry.bab)
        newClassRecTot.favClassBonus += Number(entry.favClassBonus)
        newClassRecTot.fort += Number(entry.fort)
        newClassRecTot.ref += Number(entry.ref)
        newClassRecTot.will += Number(entry.will)
        newClassRecTot.skill += Number(entry.skill) * Number(entry.levels)
        newClassRecTot.levels += Number(entry.levels)
        //calculate max HP
        entry.hpGained.forEach(element => {
          newHP.maxPoints += Number(element) + Number(newState.abilityBlock.abilities.con.mod)
        })
      });
      newHP.maxPoints += Number(newState.hitPoints.bonusMaxPoints)

      //calculate armor classes
      const combatBonuses = newState.combat.acBonuses
      const newCombatBlock = newState.combat
        newCombatBlock.ac = 
          Number(combatBonuses.armor) 
          + Number(combatBonuses.shield)
          + Math.min(Number(combatBonuses.maxDex), Number(newState.abilityBlock.abilities.dex.mod))
          + Number(combatBonuses.size)
          + Number(combatBonuses.dodge)
          + Number(combatBonuses.natural)
          + Number(combatBonuses.deflect)
          + Number(combatBonuses.misc);
      newCombatBlock.touchAC =
        + Math.min(Number(combatBonuses.maxDex), Number(newState.abilityBlock.abilities.dex.mod))
        + Number(combatBonuses.size)
        + Number(combatBonuses.dodge)
        + Number(combatBonuses.deflect)
        + Number(combatBonuses.misc);
      newCombatBlock.flatFooted =
        Number(combatBonuses.armor)
        + Number(combatBonuses.shield)
        + Number(combatBonuses.size)
        + Number(combatBonuses.natural)
        + Number(combatBonuses.deflect)
        + Number(combatBonuses.misc);

      //set penalties in combat block
      newCombatBlock.armorCheckPenalty =
        Number(newCombatBlock.equipment.armor.checkPenalty)
        + Number(newCombatBlock.equipment.shield.checkPenalty);
      newCombatBlock.acBonuses.maxDex = Math.min(Number(newCombatBlock.equipment.armor.maxDex), Number(newCombatBlock.equipment.shield.maxDex))
      newCombatBlock.spellFail =
        Number(newCombatBlock.equipment.armor.spellFail)
        + Number(newCombatBlock.equipment.shield.spellFail);

      //set initiative
      newCombatBlock.initiative = newState.abilityBlock.abilities.dex.mod + Number(newCombatBlock.initBonus)

      //calculate saving throws
      newCombatBlock.fort.total =
        newClassRecTot.fort
        + newState.abilityBlock.abilities[newCombatBlock.fort.ability].mod
        + Number(newCombatBlock.fort.enh)
        + Number(newCombatBlock.fort.misc);
      newCombatBlock.ref.total =
        newClassRecTot.ref
        + newState.abilityBlock.abilities[newCombatBlock.ref.ability].mod
        + Number(newCombatBlock.ref.enh)
        + Number(newCombatBlock.ref.misc);
      newCombatBlock.will.total =
        newClassRecTot.will
        + newState.abilityBlock.abilities[newCombatBlock.will.ability].mod
        + Number(newCombatBlock.will.enh)
        + Number(newCombatBlock.will.misc);

      //calculate attack bonuses
      newCombatBlock.melee.total =
        newState.abilityBlock.abilities[newCombatBlock.melee.ability].mod
        + newClassRecTot.bab
        + Number(newCombatBlock.melee.misc);
      newCombatBlock.ranged.total =
        newState.abilityBlock.abilities[newCombatBlock.ranged.ability].mod
        + newClassRecTot.bab
        + Number(newCombatBlock.ranged.misc);

      //calculate combat manuevers
      newCombatBlock.combatBonus.total =
        newState.abilityBlock.abilities[newCombatBlock.combatBonus.ability].mod
        + newClassRecTot.bab
        + Number(newCombatBlock.combatBonus.misc);
      newCombatBlock.combatDefense.total =
        10
        + newState.abilityBlock.abilities.str.mod
        + newState.abilityBlock.abilities.dex.mod
        + newClassRecTot.bab
        + Number(newCombatBlock.acBonuses.dodge)
        + Number(newCombatBlock.acBonuses.deflect)
        + Number(newCombatBlock.combatDefense.misc);

      //calculate skill rank amounts and skill bonus totals
      newState.skills.totalRanks = newClassRecTot.skill + newClassRecTot.levels * newState.abilityBlock.abilities.int.mod;
      newState.skills.remainRanks = newState.skills.totalRanks;
      newState.skills.skills.forEach(element => {
        newState.skills.remainRanks -= Number(element.ranks);
        element.totalBonus = Number(element.ranks) + newState.abilityBlock.abilities[element.ability].mod;
        if (Number(element.ranks) > 0 && element.classSkill) 
          element.totalBonus += 3;
        if (element.armorPenalty) 
          element.totalBonus -= newCombatBlock.armorCheckPenalty;
        element.totalBonus += Number(element.misc);
      })

      //calculate weight
      const newWeight = newState.equipment.weight;
      newWeight.currLoad = Number(newCombatBlock.equipment.armor.weight) + Number(newCombatBlock.equipment.shield.weight);
      newCombatBlock.equipment.weapons.forEach(weapon => 
        newWeight.currLoad += Number(weapon.weight));
      newState.equipment.bags.forEach(bag => 
        newWeight.currLoad += Number(bag.weight));
      newState.equipment.coinPurse.forEach(currency => 
        newWeight.currLoad += Number(currency.weight) * Number(currency.amount));
      newState.equipment.worn.forEach(element =>
        newWeight.currLoad += Number(element.weight));
      newState.equipment.inventory.forEach(element =>
        newWeight.currLoad += Number(element.weight));

      return newState;
    }
    case 'changeBioField': {
      console.log('trying to set ' + state.bio[action.payload.field] + ' to ' + action.payload.value + ' in field ' + action.payload.field)

      const newState: Blocks = state;
      newState.bio[action.payload.field] = action.payload.value;

      return newState;
    }
    case 'changeBioSize': {
      const newState: Blocks = state;

      newState.bio.size = action.payload.value;
      console.log('Changed field size to ' + newState.bio.size)

      return newState;
    }
    case 'changeBioAlign': {
      const newState: Blocks = state;

      newState.bio.align = action.payload.value;
      console.log('Changed field size to ' + newState.bio.size)

      return newState;
    }
    case 'changeAbilities': {
      console.log('trying to set ' + state.abilityBlock.abilities[action.payload.ability][action.payload.field] + ' to ' + action.payload.value + ' in field ' + action.payload.field)

      const newState: Blocks = state;
      newState.abilityBlock.abilities[action.payload.ability][action.payload.field] = action.payload.value;
      return newState;
    }
    case 'abilToggle': {
      const newState: Blocks = state;
      newState.abilityBlock.toggleDetail = !newState.abilityBlock.toggleDetail;

      console.log('Toggling ability details to ' + newState.abilityBlock.toggleDetail)

      return newState;
    }
    case 'changeHPField': {
      console.log('trying to set ' + state.hitPoints[action.payload.field] + ' to ' + action.payload.value + ' in field ' + action.payload.field)

      const newState: Blocks = state;
      newState.hitPoints[action.payload.field] = action.payload.value;

      return newState;
    }
    default: {
      throw Error('Unknown action: ' + action)
    }
  }
}