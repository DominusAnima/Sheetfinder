import * as functions from 'firebase-functions';
import * as mysql from 'mysql2/promise';
import * as express from 'express';
import * as charSheet from '../../src/charSheet';
import { webUserOptions } from './dbCredentails';

const pool = mysql.createPool( webUserOptions );

const app = express();

app.use(express.json());

app.post('/register-user', async (req, res) => {
  const { email, password } = (req.body as {email: string, password: string});
  console.log(email, password);
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT email FROM users WHERE email = ?`, [email]
    );
    
    if (results.length > 0) {
      res.status(409).send({ error: 'User already exists.' });
      return;
    }

    await connection.query(
      `INSERT INTO users (email, password)
        VALUES (?, ?)`,
        [email, password]
    );

    await connection.commit();
    connection.release();

    res.status(200).send({ message: 'New user registered successfully.'});
  } catch (err) {
    console.error(err);

    if (connection) {
      await connection.rollback();
      connection.release();
    }

    res.status(500).send({ error: 'Failed register new user data.' });
  }
});

app.get('/login-user', async (req, res) => {
    const { email, password } = req.query;
    console.log(email, password);
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query<mysql.RowDataPacket[]>(
            `SELECT email, password FROM users WHERE email = ?`, [email]
        );
        if (results.length === 0) {
            res.status(404).send({ error: 'User not found.' });
        } else if (results[0].password !== password) {
            res.status(401).send({ error: 'Incorrect password.' });
        } else {
            res.status(200).send({ email: results[0].email });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to login user.' });
    } finally {
        connection.release();
    }
});

app.post('/store-new-character', async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const user = req.body.owner as string;
    var sheetId = req.body.sheetId as number;
    console.log(user);
    const { bio, abilityBlock, classRecorder, hitPoints, skills, combat, special, magic, featList, equipment } = (req.body.state as charSheet.Blocks);
    // console.log(bio, abilityBlock, classRecorder, hitPoints, skills, combat, special, magic, featList, equipment);

    sheetId = await createSheetCore(connection, user, sheetId);

    await createBioBlock(connection, bio, sheetId);
    await createAbilityBlock(connection, abilityBlock, sheetId);
    await createClassRecordBlock(connection, classRecorder, sheetId);
    await createHPBlock(connection, hitPoints, sheetId);
    await createSkillBlock(connection, skills, sheetId);
    await createEuipBlock(connection, equipment, sheetId);
    await createCombatBlock(connection, combat, sheetId);
    await createSpecialBlock(connection, special, sheetId);
    await createFeatBlock(connection, featList, sheetId);
    await createMagicBlock(connection, magic, sheetId);

    await connection.commit();
    connection.release();

    res.status(200).send({ result: sheetId });
  } catch (err) {
    console.error(err);

    if (connection) {
      await connection.rollback();
      connection.release();
    }

    res.status(500).send({ error: 'Failed to store new character data.' });
  }
});

async function createSheetCore(connection: mysql.PoolConnection, owner: string, sheetId?: number): Promise<number> {
  if (sheetId) {
    await connection.query(
      `INSERT INTO char_sheet_core (id, owner, create_time) VALUES (?, ?, NOW())`,
      [sheetId, owner]
    );

    return sheetId;
  }
  
  const [result] = await connection.query(
    `INSERT INTO char_sheet_core (owner, create_time) VALUES (?, NOW())`,
    [owner]
  );

  return (result as mysql.ResultSetHeader).insertId;
}

async function createBioBlock(connection: mysql.PoolConnection, bio: charSheet.BioBlock, sheetId: number) {
  const {name, race, size, gender, height, weight, hair, eyes, skin, age, align, deity, background, languages} = bio;
  
  await connection.query(
    `INSERT INTO bioBlock (core_id, name, race, size, gender, height, weight, hair, eyes, skin, age, align, deity, background, languages)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sheetId, name, race, size, gender, height, weight, hair, eyes, skin, age, align, deity, background, languages]
  );
}

async function createAbilityBlock(connection: mysql.PoolConnection, abilityBlock: charSheet.AbilityBlock, sheetId: number) {
  const {str, dex, con, int, wis, cha} = abilityBlock.abilities;

  await connection.query(
    `INSERT INTO ability_values (type, core_id, total, \`mod\`, base, enh, size, misc, damage, drain)
      VALUES ?`,
      [[
        ['str', sheetId, str.total, str.mod, str.base, str.enh, str.size, str.misc, str.damage, str.drain],
        ['dex', sheetId, dex.total, dex.mod, dex.base, dex.enh, dex.size, dex.misc, dex.damage, dex.drain],
        ['con', sheetId, con.total, con.mod, con.base, con.enh, con.size, con.misc, con.damage, con.drain],
        ['int', sheetId, int.total, int.mod, int.base, int.enh, int.size, int.misc, int.damage, int.drain],
        ['wis', sheetId, wis.total, wis.mod, wis.base, wis.enh, wis.size, wis.misc, wis.damage, wis.drain],
        ['cha', sheetId, cha.total, cha.mod, cha.base, cha.enh, cha.size, cha.misc, cha.damage, cha.drain]
      ]]
  );
}

async function createClassRecordBlock(connection: mysql.PoolConnection, classRecorder: charSheet.ClassRecordBlock, sheetId: number) {
  const {entries, favClass, totals} = classRecorder;
  
  await connection.query(
    `INSERT INTO class_record (core_id, favClass, bab, skill, favClassBonus, fort, ref, will, levels)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sheetId, favClass, totals.bab, totals.skill, totals.favClassBonus, totals.fort, totals.ref, totals.will, totals.levels]
  );

  var insertValues = [];
  for (let i = 0; i < entries.length; i++) {
    const {hitDie, name, bab, skill, favClassBonusType, favClassBonus, fort, ref, will, levels}: charSheet.ClassEntry = entries[i];
    insertValues.push([sheetId, hitDie, name, bab, skill, favClassBonus, favClassBonusType, fort, ref, will, levels]);
  }
  await connection.query(
    `INSERT INTO class_entry (class_record_id, hitDie, name, bab, skill, favClassBonus, favClassBonusType, fort, ref, will, levels)
      VALUES ?`,
      [insertValues]
  );
}

async function createHPBlock(connection: mysql.PoolConnection, hpBlock: charSheet.HPBlock, sheetId: number) {
  const {bonusMaxPoints, currentPoints, maxPoints, nonLethal, tempPoints} = hpBlock;

  await connection.query(
    `INSERT INTO hp_block (core_id, max_points, bonus_max_points, current, temp, non_lethal)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [sheetId, maxPoints, bonusMaxPoints, currentPoints, tempPoints, nonLethal]
  );
}

async function createSkillBlock(connection: mysql.PoolConnection, skillBlock: charSheet.SkillBlock, sheetId: number) {
  const {remainRanks, skills, totalRanks} = skillBlock;

  await connection.query(
    `INSERT INTO skill_block (core_id, total_ranks, remain_ranks)
      VALUES (?, ?, ?)`,
      [sheetId, totalRanks, remainRanks]
  );

  var insertValues = [];
  for (let i = 0; i < skills.length; i++) {
    const {ability, armorPenalty, classSkill, editable, misc, name, ranks, totalBonus, trained}: charSheet.Skill = skills[i];
    insertValues.push([sheetId, name, ability, classSkill, trained, armorPenalty, totalBonus, ranks, misc, editable]);
  }
  await connection.query(
    `INSERT INTO skill (skill_block_id, name, ability, class_skill, trained, armor_penalty, total_bonus, ranks, misc, editable)
      VALUES ?`,
      [insertValues]
  );
}

async function createEuipBlock(connection: mysql.PoolConnection, equipBlock: charSheet.EquipBlock, sheetId: number) {
  const {bags, coinPurse, inventory, weight, worn} = equipBlock;

  await connection.query(
    `INSERT INTO equip_block (core_id, light_load, med_load, heavy_load, curr_load)
      VALUES (?, ?, ?, ?, ?)`,
      [sheetId, weight.lightLoad, weight.medLoad, weight.heavyLoad, weight.currLoad]
  );

  var insertValues = [];
  for (let i = 0; i < coinPurse.length; i++) {
    const money = coinPurse[i];
    insertValues.push([sheetId, money.type, money.amount, money.weight]);
  }
  await connection.query(
    `INSERT INTO money (core_id, money_type, amount, weight)
      VALUES ?`,
      [insertValues]
  );

  for (let i = 0; i < bags.length; i++) {
    const bag = bags[i];

    const [itemResult] = await connection.query(
      `INSERT INTO item (equip_block_id, name, hp, toggle_descr, description, weight, value, slot, qty_or_uses)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [sheetId, bag.name, bag.hp, bag.toggleDescr, bag.description, bag.weight, bag.value, bag.slot, bag.qtyOrUses]
    );
    const itemResultHeader = itemResult as mysql.ResultSetHeader;

    await connection.query(
      `INSERT INTO bag (item_id, capacity)
        VALUES (?, ?)`,
        [itemResultHeader.insertId, bag.capacity]
    );
  }

  insertValues = [];
  for (let i = 0; i < inventory.length; i++) {
    const item = inventory[i];
    insertValues.push([sheetId, item.name, item.hp, item.toggleDescr, item.description, item.weight, item.value, item.slot, item.qtyOrUses]);
  }
  await connection.query(
    `INSERT INTO item (equip_block_id, name, hp, toggle_descr, description, weight, value, slot, qty_or_uses)
      VALUES ?`,
      [insertValues]
  );

  for (let i = 0; i < Object.values(worn).length; i++) {
    const item = Object.values(worn)[i];

    const [itemResult] = await connection.query(
      `INSERT INTO item (equip_block_id, name, hp, toggle_descr, description, weight, value, slot, qty_or_uses)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [sheetId, item.name, item.hp, item.toggleDescr, item.description, item.weight, item.value, item.slot, item.qtyOrUses]
    );
    const itemResultHeader = itemResult as mysql.ResultSetHeader;

    await connection.query(
      `INSERT INTO equipped_items (equip_slot, item_id)
        VALUES (?, ?)`,
        [item.slot, itemResultHeader.insertId]
    );
  }
}

async function createCombatBlock(connection: mysql.PoolConnection, combatBlock: charSheet.CombatBlock, sheetId: number) {
  const {ac, acBonuses, armorCheckPenalty, combatBonus, combatDefense, dmgRed, equipment, flatFooted, fort, initBonus, initiative, melee, ranged, ref, res, speed, spellFail, spellres, touchAC, will} = combatBlock;
  const armor = equipment.armor;
  const shield = equipment.shield;
  const mainWeapon = equipment.mainWeapon;
  const offhand = equipment.offhand;

  const [armorResult] = await connection.query(
    `INSERT INTO item (equip_block_id, name, hp, toggle_descr, description, weight, value, slot, qty_or_uses)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sheetId, armor.name, armor.hp, armor.toggleDescr, armor.description, armor.weight, armor.value, armor.slot, armor.qtyOrUses]
  );
  const armorResultHeader = armorResult as mysql.ResultSetHeader;

  await connection.query(
    `INSERT INTO armor (item_id, base_ac_bonus, max_dex, check_penalty, armor_type, spell_fail)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [armorResultHeader.insertId, armor.baseACBonus, armor.maxDex, armor.checkPenalty, armor.armorType, armor.spellFail]
  );

  const [shieldResult] = await connection.query(
    `INSERT INTO item (equip_block_id, name, hp, toggle_descr, description, weight, value, slot, qty_or_uses)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sheetId, shield.name, shield.hp, shield.toggleDescr, shield.description, shield.weight, shield.value, shield.slot, shield.qtyOrUses]
  );
  const shieldResultHeader = shieldResult as mysql.ResultSetHeader;

  await connection.query(
    `INSERT INTO shield (item_id, base_ac_bonus, max_dex, check_penalty, enh, spell_fail)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [shieldResultHeader.insertId, shield.baseACBonus, shield.maxDex, shield.checkPenalty, shield.enh, shield.spellFail]
  );

  const [mainWeaponResult] = await connection.query(
    `INSERT INTO item (equip_block_id, name, hp, toggle_descr, description, weight, value, slot, qty_or_uses)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sheetId, mainWeapon.name, mainWeapon.hp, mainWeapon.toggleDescr, mainWeapon.description, mainWeapon.weight, mainWeapon.value, mainWeapon.slot, mainWeapon.qtyOrUses]
  );
  const mainWeaponResultHeader = mainWeaponResult as mysql.ResultSetHeader;

  await connection.query(
    `INSERT INTO weapon (item_id, damage, enh, crit, \`range\`, type, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [mainWeaponResultHeader.insertId, mainWeapon.damage, mainWeapon.enh, mainWeapon.crit, mainWeapon.range, mainWeapon.type, mainWeapon.category]
  );

  const [offhandResult] = await connection.query(
    `INSERT INTO item (equip_block_id, name, hp, toggle_descr, description, weight, value, slot, qty_or_uses)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sheetId, offhand.name, offhand.hp, offhand.toggleDescr, offhand.description, offhand.weight, offhand.value, offhand.slot, offhand.qtyOrUses]
  );
  const offhandResultHeader = offhandResult as mysql.ResultSetHeader;

  await connection.query(
    `INSERT INTO weapon (item_id, damage, enh, crit, \`range\`, type, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [offhandResultHeader.insertId, offhand.damage, offhand.enh, offhand.crit, offhand.range, offhand.type, offhand.category]
  );

  await connection.query(
    `INSERT INTO combat_block (core_id, ac, touch_ac, flat_footed, acb_armor, acb_shield, max_dex, acb_dodge, acb_deflect, acb_natural, acb_size, acb_misc, fort_total, fort_ability, fort_enh, fort_misc, ref_total, ref_ability, ref_enh, ref_misc, will_total, will_ability, will_enh, will_misc, cmd_total, cmd_misc, cmb_total, cmb_ability, cmb_misc, melee_total, melee_ability, melee_misc, ranged_total, ranged_ability, ranged_misc, speed_base, speed_fly, speed_swim, speed_climb, initiative, init_bonus, spell_res, dmg_red, res, spell_fail, ac_penalty, equip_armor, equip_shield, equip_main_weapon, equip_offhand_weapon)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sheetId, ac, touchAC, flatFooted, acBonuses.armor, acBonuses.shield, acBonuses.maxDex, acBonuses.dodge, acBonuses.deflect, acBonuses.natural, acBonuses.size, acBonuses.misc, fort.total, fort.ability, fort.enh, fort.misc, ref.total, ref.ability, ref.enh, ref.misc, will.total, will.ability, will.enh, will.misc, combatDefense.total, combatDefense.misc, combatBonus.total, combatBonus.ability, combatBonus.misc, melee.total, melee.ability, melee.misc, ranged.total, ranged.ability, ranged.misc, speed.base, speed.fly, speed.swim, speed.climb, initiative, initBonus, spellres, dmgRed, res, spellFail, armorCheckPenalty, armorResultHeader.insertId, shieldResultHeader.insertId, mainWeaponResultHeader.insertId, offhandResultHeader.insertId]
  );
}

async function createSpecialBlock(connection: mysql.PoolConnection, specialBlock: charSheet.SpecialBlock, sheetId: number) {
  var insertValues = [];
  for (let i = 0; i < specialBlock.entries.length; i++) {
    const specialEntry = specialBlock.entries[i];
    insertValues.push([sheetId, specialEntry.name, specialEntry.toggleDescr, specialEntry.description, specialEntry.usesLimit, specialEntry.used]);
  }
  await connection.query(
    `INSERT INTO special_entry (core_id, name, toggle_desc, description, uses_limit, used)
      VALUES ?`,
      [insertValues]
  );
}

async function createFeatBlock(connection: mysql.PoolConnection, featBlock: charSheet.FeatBlock, sheetId: number) {
  var insertValues = [];
  for (let i = 0; i < featBlock.entries.length; i++) {
    const featEntry = featBlock.entries[i];
    insertValues.push([sheetId, featEntry.name, featEntry.toggleDescr, featEntry.description]);
  }
  await connection.query(
    `INSERT INTO feat (core_id, name, toggle_descr, description)
      VALUES ?`,
      [insertValues]
  );
}

async function createMagicBlock(connection: mysql.PoolConnection, magicBlock: charSheet.MagicBlock[], sheetId: number) {
  for (let i = 0; i < magicBlock.length; i++) {
    const block = magicBlock[i];
    
    const [blockResult] = await connection.query(
      `INSERT INTO magic_block (core_id, caster_class, caster_lvl, close_range, med_range, long_range)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [sheetId, block.casterClass, block.casterLvl, block.closeRange, block.medRange, block.longRange]
    );
    const resultHeader = blockResult as mysql.ResultSetHeader;

    var insertValues = [];
    for (let j = 0; j < block.specialty.mainSpecial.length; j++) {
      const mainSpecial = block.specialty.mainSpecial[j];
      insertValues.push([resultHeader.insertId, mainSpecial.name]);
    }
    await connection.query(
      `INSERT INTO main_specialty (magic_block_id, name)
        VALUES ?`,
        [insertValues]
    );

    insertValues = [];
    for (let j = 0; j < block.specialty.subSpecial.length; j++) {
      const subSpecial = block.specialty.subSpecial[j];
      insertValues.push([resultHeader.insertId, subSpecial.name]);
    }
    await connection.query(
      `INSERT INTO sub_specialty (magic_block_id, name)
        VALUES ?`,
        [insertValues]
    );

    insertValues = [];
    for (let j = 0; j < block.spellSlots.length; j++) {
      const spellSlot = block.spellSlots[j];
      insertValues.push([spellSlot.lvl, resultHeader.insertId, spellSlot.saveDC, spellSlot.total, spellSlot.classAmount, spellSlot.abilityBonus, spellSlot.misc, spellSlot.available]);
    }
    await connection.query(
      `INSERT INTO spell_slot (lvl, magic_block_id, save_dc, total, class_amount, ability_bonus, misc, available)
        VALUES ?`,
        [insertValues]
    );

    insertValues = [];
    for (let j = 0; j < block.spellsKnown.length; j++) {
      const spell = block.spellsKnown[j];
      insertValues.push([resultHeader.insertId, spell.lvl, spell.prepared, spell.name, spell.toggleDescr, spell.description, spell.school, spell.duration, spell.range, spell.saveType, spell.spellRes]);
    }
    await connection.query(
      `INSERT INTO spell (magic_block_id, lvl, prepared, name, toggle_descr, description, school, duration, \`range\`, save_type, spell_res)
        VALUES ?`,
        [insertValues]
    );
  }
}

// app.post('/update-character', async (req, res) => {
//   const connection = await pool.getConnection();
//   await connection.beginTransaction();
//   try {
//     const { bio, abilityBlock, classRecorder, hitPoints, skills, combat, special, magic, featList, equipment, id } = (req.body as charSheet.Blocks);

//     await updateBioBlock(connection, bio, id);
//     await updateAbilityBlock(connection, abilityBlock, id);
//     await updateClassRecordBlock(connection, classRecorder, id);
//     await updateHPBlock(connection, hitPoints, id);
//     await updateSkillBlock(connection, skills, id);
//     await updateEuipBlock(connection, equipment, id);
//     await updateCombatBlock(connection, combat, id);
//     await updateSpecialBlock(connection, special, id);
//     await updateFeatBlock(connection, featList, id);
//     await updateMagicBlock(connection, magic, id);

//     await connection.commit();
//     connection.release();

//     res.status(200).send({ message: 'Character data updated successfully.'});
//   } catch (err) {
//     console.error(err);

//     if (connection) {
//       await connection.rollback();
//       connection.release();
//     }

//     res.status(500).send({ error: 'Failed to update character data.' });
//   }
// });

// async function updateBioBlock(connection: mysql.PoolConnection, bio: charSheet.BioBlock, sheetId: number) {
//   const {age, align, background, deity, eyes, gender, hair, height, languages, name, race, size, skin, weight} = bio;

//   await connection.query(
//     `UPDATE bioBlock
//       SET name = ?, race = ?, size = ?, gender = ?, height = ?, weight = ?, hair = ?, eyes = ?, skin = ?, age = ?, align = ?, deity = ?, background = ?, languages = ?
//       WHERE core_id = ?`,
//       [name, race, size, gender, height, weight, hair, eyes, skin, age, align, deity, background, languages, sheetId]
//   );
// }

// async function updateAbilityBlock(connection: mysql.PoolConnection, abilityBlock: charSheet.AbilityBlock, sheetId: number) {
//   const {str, dex, con, int, wis, cha} = abilityBlock.abilities;

//   await connection.query(
//     `UPDATE ability_values
//       SET total = ?, mod = ?, base = ?, enh = ?, size = ?, misc = ?, damage = ?, drain = ?
//       WHERE core_id = ? AND type = ?`,
//       [str.total, str.mod, str.base, str.enh, str.size, str.misc, str.damage, str.drain, sheetId, 'str']
//   );

//   await connection.query(
//     `UPDATE ability_values
//       SET total = ?, mod = ?, base = ?, enh = ?, size = ?, misc = ?, damage = ?, drain = ?
//       WHERE core_id = ? AND type = ?`,
//       [dex.total, dex.mod, dex.base, dex.enh, dex.size, dex.misc, dex.damage, dex.drain, sheetId, 'dex']
//   );

//   await connection.query(
//     `UPDATE ability_values
//       SET total = ?, mod = ?, base = ?, enh = ?, size = ?, misc = ?, damage = ?, drain = ?
//       WHERE core_id = ? AND type = ?`,
//       [con.total, con.mod, con.base, con.enh, con.size, con.misc, con.damage, con.drain, sheetId, 'con']
//   );

//   await connection.query(
//     `UPDATE ability_values
//       SET total = ?, mod = ?, base = ?, enh = ?, size = ?, misc = ?, damage = ?, drain = ?
//       WHERE core_id = ? AND type = ?`,
//       [int.total, int.mod, int.base, int.enh, int.size, int.misc, int.damage, int.drain, sheetId, 'int']
//   );

//   await connection.query(
//     `UPDATE ability_values
//       SET total = ?, mod = ?, base = ?, enh = ?, size = ?, misc = ?, damage = ?, drain = ?
//       WHERE core_id = ? AND type = ?`,
//       [wis.total, wis.mod, wis.base, wis.enh, wis.size, wis.misc, wis.damage, wis.drain, sheetId, 'wis']
//   );

//   await connection.query(
//     `UPDATE ability_values
//       SET total = ?, mod = ?, base = ?, enh = ?, size = ?, misc = ?, damage = ?, drain = ?
//       WHERE core_id = ? AND type = ?`,
//       [cha.total, cha.mod, cha.base, cha.enh, cha.size, cha.misc, cha.damage, cha.drain, sheetId, 'cha']
//   );
// }

// async function updateClassRecordBlock(connection: mysql.PoolConnection, classRecorder: charSheet.ClassRecordBlock, sheetId: number) {
//   const {entries, favClass, totals} = classRecorder;

//   await connection.query(
//     `UPDATE class_record
//       SET favClass = ?, bab = ?, skill = ?, favClassBonus = ?, fort = ?, ref = ?, will = ?, levels = ?
//       WHERE core_id = ?`,
//       [favClass, totals.bab, totals.skill, totals.favClassBonus, totals.fort, totals.ref, totals.will, totals.levels, sheetId]
//   );

//   for (let i = 0; i < entries.length; i++) {
//     const {hitDie, name, bab, skill, favClassBonusType, favClassBonus, fort, ref, will, levels, id}: charSheet.ClassEntry = entries[i];
    
//     await connection.query(
//       `UPDATE class_entry
//         SET hitDie = ?, name = ?, bab = ?, skill = ?, favClassBonus = ?, favClassBonusType = ?, fort = ?, ref = ?, will = ?, levels = ?
//         WHERE class_record_id = ? AND id = ?`,
//         [hitDie, name, bab, skill, favClassBonus, favClassBonusType, fort, ref, will, levels, sheetId, id]
//     );
//   }
// }

// async function updateHPBlock(connection: mysql.PoolConnection, hpBlock: charSheet.HPBlock, sheetId: number) {
//   const {bonusMaxPoints, currentPoints, maxPoints, nonLethal, tempPoints} = hpBlock;

//   await connection.query(
//     `UPDATE hp_block
//       SET max_points = ?, bonus_max_points = ?, current = ?, temp = ?, non_lethal = ?
//       WHERE core_id = ?`,
//       [maxPoints, bonusMaxPoints, currentPoints, tempPoints, nonLethal, sheetId]
//   );
// }

// async function updateSkillBlock(connection: mysql.PoolConnection, skillBlock: charSheet.SkillBlock, sheetId: number) {
//   const {remainRanks, skills, totalRanks} = skillBlock;

//   await connection.query(
//     `UPDATE skill_block
//       SET total_ranks = ?, remain_ranks = ?
//       WHERE core_id = ?`,
//       [totalRanks, remainRanks, sheetId]
//   );

//   for (let i = 0; i < skills.length; i++) {
//     const {ability, armorPenalty, classSkill, editable, misc, name, ranks, totalBonus, trained, id}: charSheet.Skill = skills[i];
    
//     await connection.query(
//       `UPDATE skill
//         SET name = ?, ability = ?, armor_penalty = ?, class_skill = ?, trained = ?, total_bonus = ?, ranks = ?, misc = ?, editable = ?
//         WHERE skill_block_id = ? AND id = ?`,
//         [name ,ability, armorPenalty, classSkill, trained, totalBonus, ranks, misc, editable, sheetId, id]
//     );
//   }
// }

// // TODO: Implement updateCombatBlock
// async function updateEuipBlock(connection: mysql.PoolConnection, equipBlock: charSheet.EquipBlock, sheetId: number) {
//   const {bags, coinPurse, inventory, weight, worn} = equipBlock;

//   await connection.query(
//     `UPDATE equip_block
//       SET light_load = ?, med_load = ?, heavy_load = ?, curr_load = ?
//       WHERE core_id = ?`,
//       [weight.lightLoad, weight.medLoad, weight.heavyLoad, weight.currLoad, sheetId]
//   );

//   for (let i = 0; i < coinPurse.length; i++) {
//     const money = coinPurse[i];
//     await connection.query(
//       `UPDATE money
//         SET amount = ?, weight = ?
//         WHERE core_id = ? AND money_type = ?`,
//         [money.amount, money.weight, sheetId, money.type]
//     );
//   }

//   for (let i = 0; i < bags.length; i++) {
//     const bag = bags[i];

//     await connection.query(
//       `UPDATE item
//         SET name = ?, hp = ?, toggle_descr = ?, description = ?, weight = ?, value = ?, slot = ?, qty_or_uses = ?
//         WHERE equip_block_id = ? AND id = ?`,
//         [bag.name, bag.hp, bag.toggleDescr, bag.description, bag.weight, bag.value, bag.slot, bag.qtyOrUses, sheetId, bag.id]
//     );

//     await connection.query(
//       `UPDATE bag
//         SET capacity = ?
//         WHERE item_id = ?`,
//         [bag.capacity, bag.id]
//     );
//   }

//   for (let i = 0; i < inventory.length; i++) {
//     const item = inventory[i];

//     await connection.query(
//       `UPDATE item
//         SET name = ?, hp = ?, toggle_descr = ?, description = ?, weight = ?, value = ?, slot = ?, qty_or_uses = ?
//         WHERE equip_block_id = ? AND id = ?`,
//         [item.name, item.hp, item.toggleDescr, item.description, item.weight, item.value, item.slot, item.qtyOrUses, sheetId, item.id]
//     );
//   }

//   for (let i = 0; i < Object.values(worn).length; i++) {
//     const item = Object.values(worn)[i];
//   }

// }

app.post('/delete-character', async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const { sheetId } = (req.body as {sheetId: number});

    // mySQL is set up to cascade upon deletion of a char_sheet_core row
    await connection.query(
      `DELETE FROM char_sheet_core
        WHERE id = ?`,
        [sheetId]
    );

    await connection.commit();
    connection.release();

    res.status(200).send({ message: 'Character data deleted successfully.'});
  } catch (err) {
    console.error(err);

    if (connection) {
      await connection.rollback();
      connection.release();
    }

    res.status(500).send({ error: 'Failed to delete character data.' });
  }
});

/// shuld return a list containing the id, create_time, and name of each character owned by the user
/// returns: [{id: number, create_time: string, name: string}, ...]
app.get('/get-character-list', async (req, res) => {
  const user: string = (req.query.owner as string);
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT id, create_time, name
       FROM char_sheet_core JOIN bioBlock ON char_sheet_core.id = bioBlock.core_id
       WHERE owner = ?`, [user]
    );
    console.log(results);
    res.status(200).send({ results: results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to retrieve character list.' });
  } finally {
    connection.release();
  }
});

app.get('/get-character', async (req, res) => {
  const connection = await pool.getConnection();
  const sheetId = parseInt(req.query.sheetId as string, 10);

  try {
    const result: charSheet.Blocks = {
      bio: await fetchBioBlock(sheetId, connection),
      abilityBlock: await fetchAbilityBlock(sheetId, connection),
      classRecorder: await fetchClassRecordBlock(sheetId, connection),
      combat: await fetchCombatBlock(sheetId, connection),
      equipment: await fetchEquipBlock(sheetId, connection),
      featList: await fetchFeatBlock(sheetId, connection),
      hitPoints: await fetchHPBlock(sheetId, connection),
      magic: await fetchMagicBlocks(sheetId, connection),
      skills: await fetchSkillBlock(sheetId, connection),
      special: await fetchSpecialBlock(sheetId, connection)
    };

    connection.release();
    connection.destroy();
    res.status(200).send({result: result});
  } catch (err) {
    console.error(err);
    connection.release();
    res.status(500).send({ error: 'Failed to retrieve character data.' });
  }
});

async function fetchBioBlock(sheetId: number, connection: mysql.PoolConnection): Promise<charSheet.BioBlock> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT name, race, size, gender, height, weight, hair, eyes, skin, age, align, deity, background, languages
       FROM bioBlock
       WHERE core_id = ?`, [sheetId]
    );

    return {
      name: results[0].name,
      race: results[0].race,
      size: results[0].size, // potentially need a conversion from string to enum
      gender: results[0].gender,
      height: results[0].height,
      weight: results[0].weight,
      hair: results[0].hair,
      eyes: results[0].eyes,
      skin: results[0].skin,
      age: results[0].age,
      align: results[0].align, // potentially need a conversion from string to enum
      deity: results[0].deity,
      background: results[0].background,
      languages: results[0].languages
    };
  } catch (error) {
    throw error;
  }
}

async function fetchAbilityBlock(sheetId: number, connection: mysql.PoolConnection): Promise<charSheet.AbilityBlock> {
  try {
    const abilityBlock: charSheet.AbilityBlock = {
      abilities: {
        str: await fetchAbilityValues(sheetId, 'str', connection),
        dex: await fetchAbilityValues(sheetId, 'dex', connection),
        con: await fetchAbilityValues(sheetId, 'con', connection),
        int: await fetchAbilityValues(sheetId, 'int', connection),
        wis: await fetchAbilityValues(sheetId, 'wis', connection),
        cha: await fetchAbilityValues(sheetId, 'cha', connection)
      }
    };
    return abilityBlock;
  } catch (error) {
    throw error;
  }
}

async function fetchAbilityValues(sheetId: number, abilityType: string, connection: mysql.PoolConnection): Promise<charSheet.AbilityValues> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT total, \`mod\`, base, enh, size, misc, damage, drain
       FROM ability_values
       WHERE core_id = ? AND type = ?`, [sheetId, abilityType]
    );

    return {
      total: results[0].total,
      mod: results[0].mod,
      base: results[0].base,
      enh: results[0].enh,
      size: results[0].size,
      misc: results[0].misc,
      damage: results[0].damage,
      drain: results[0].drain
    };
  } catch (error) {
    throw error;
  }
}

async function fetchClassRecordBlock(sheetId: number, connection: mysql.PoolConnection): Promise<charSheet.ClassRecordBlock> {
  try {
    const [recordResults] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT favClass, bab, skill, favClassBonus, fort, ref, will, levels
       FROM class_record
       WHERE core_id = ?`, [sheetId]
    );

    const [entries] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT hitDie, name, bab, skill, favClassBonusType, favClassBonus, fort, ref, will, levels
       FROM class_entry
       WHERE class_record_id = ?`, [sheetId]
    );

    return {
      favClass: recordResults[0].favClass,
      totals: {
        bab: recordResults[0].bab,
        skill: recordResults[0].skill,
        favClassBonus: recordResults[0].favClassBonus,
        fort: recordResults[0].fort,
        ref: recordResults[0].ref,
        will: recordResults[0].will,
        levels: recordResults[0].levels
      },
      entries: entries.map((entry: any) => {
        return {
          hitDie: entry.hitDie,
          name: entry.name,
          bab: entry.bab,
          skill: entry.skill,
          favClassBonusType: entry.favClassBonusType,
          favClassBonus: entry.favClassBonus,
          fort: entry.fort,
          ref: entry.ref,
          will: entry.will,
          levels: entry.levels
        } as charSheet.ClassEntry;
      })
    };
  } catch (error) {
    throw error;
  }
}

async function fetchCombatBlock(sheetId: number, connection: mysql.PoolConnection): Promise<charSheet.CombatBlock> {
  try {
    const [combatResults] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT ac, touch_ac, flat_footed, acb_armor, acb_shield, max_dex, acb_dodge, acb_deflect, acb_natural, acb_size, acb_misc, fort_total, fort_ability, fort_enh, fort_misc, ref_total, ref_ability, ref_enh, ref_misc, will_total, will_ability, will_enh, will_misc, cmd_total, cmd_misc, cmb_total, cmb_ability, cmb_misc, melee_total, melee_ability, melee_misc, ranged_total, ranged_ability, ranged_misc, speed_base, speed_fly, speed_swim, speed_climb, initiative, init_bonus, spell_res, dmg_red, res, spell_fail, ac_penalty, equip_armor, equip_shield, equip_main_weapon, equip_offhand_weapon
       FROM combat_block
       WHERE core_id = ?`, [sheetId]
    );

    const [armor] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT name, hp, toggle_descr, description, weight, value, slot, qty_or_uses, base_ac_bonus, max_dex, check_penalty, armor_type, spell_fail
       FROM item JOIN armor ON item.id = armor.item_id
       WHERE equip_block_id = ? AND item.id = ?`, [sheetId, combatResults[0].equip_armor]
    );

    const [shield] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT name, hp, toggle_descr, description, weight, value, slot, qty_or_uses, base_ac_bonus, max_dex, check_penalty, enh, spell_fail
       FROM item JOIN shield ON item.id = shield.item_id
       WHERE equip_block_id = ? AND item.id = ?`, [sheetId, combatResults[0].equip_shield]
    );

    const [mainWeapon] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT name, hp, toggle_descr, description, weight, value, slot, qty_or_uses, damage, enh, crit, \`range\`, type, category
       FROM item JOIN weapon ON item.id = weapon.item_id
       WHERE equip_block_id = ? AND item.id = ?`, [sheetId, combatResults[0].equip_main_weapon]
    );

    const [offhand] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT name, hp, toggle_descr, description, weight, value, slot, qty_or_uses, damage, enh, crit, \`range\`, type, category
       FROM item JOIN weapon ON item.id = weapon.item_id
       WHERE equip_block_id = ? AND item.id = ?`, [sheetId, combatResults[0].equip_offhand_weapon]
    );

    return {
      ac: combatResults[0].ac,
      acBonuses: {
        armor: combatResults[0].acb_armor,
        shield: combatResults[0].acb_shield,
        maxDex: combatResults[0].max_dex,
        dodge: combatResults[0].acb_dodge,
        deflect: combatResults[0].acb_deflect,
        natural: combatResults[0].acb_natural,
        size: combatResults[0].acb_size,
        misc: combatResults[0].acb_misc
      },
      fort: {
        total: combatResults[0].fort_total,
        ability: combatResults[0].fort_ability, // potentially need to convert to enum
        enh: combatResults[0].fort_enh,
        misc: combatResults[0].fort_misc
      },
      ref: {
        total: combatResults[0].ref_total,
        ability: combatResults[0].ref_ability, // potentially need to convert to enum
        enh: combatResults[0].ref_enh,
        misc: combatResults[0].ref_misc
      },
      will: {
        total: combatResults[0].will_total,
        ability: combatResults[0].will_ability, // potentially need to convert to enum
        enh: combatResults[0].will_enh,
        misc: combatResults[0].will_misc
      },
      combatDefense: {
        total: combatResults[0].cmd_total,
        misc: combatResults[0].cmd_misc
      },
      combatBonus: {
        total: combatResults[0].cmb_total,
        ability: combatResults[0].cmb_ability, // potentially need to convert to enum
        misc: combatResults[0].cmb_misc
      },
      melee: {
        total: combatResults[0].melee_total,
        ability: combatResults[0].melee_ability, // potentially need to convert to enum
        misc: combatResults[0].melee_misc
      },
      ranged: {
        total: combatResults[0].ranged_total,
        ability: combatResults[0].ranged_ability, // potentially need to convert to enum
        misc: combatResults[0].ranged_misc
      },
      speed: {
        base: combatResults[0].speed_base,
        fly: combatResults[0].speed_fly,
        swim: combatResults[0].speed_swim,
        climb: combatResults[0].speed_climb
      },
      initiative: combatResults[0].initiative,
      initBonus: combatResults[0].init_bonus,
      spellres: combatResults[0].spell_res,
      dmgRed: combatResults[0].dmg_red,
      res: combatResults[0].res,
      spellFail: combatResults[0].spell_fail,
      touchAC: combatResults[0].touch_ac,
      flatFooted: combatResults[0].flat_footed,
      armorCheckPenalty: combatResults[0].ac_penalty,
      equipment: {
        armor: {
          name: armor[0].name,
          hp: armor[0].hp,
          toggleDescr: armor[0].toggle_descr,
          description: armor[0].description,
          weight: armor[0].weight,
          value: armor[0].value,
          slot: armor[0].slot, // potentially need to convert to enum
          qtyOrUses: armor[0].qty_or_uses,
          baseACBonus: armor[0].base_ac_bonus,
          maxDex: armor[0].max_dex,
          checkPenalty: armor[0].check_penalty,
          armorType: armor[0].armor_type, // potentially need to convert to enum
          spellFail: armor[0].spell_fail
        },
        shield: {
          name: shield[0].name,
          hp: shield[0].hp,
          toggleDescr: shield[0].toggle_descr,
          description: shield[0].description,
          weight: shield[0].weight,
          value: shield[0].value,
          slot: shield[0].slot, // potentially need to convert to enum
          qtyOrUses: shield[0].qty_or_uses,
          baseACBonus: shield[0].base_ac_bonus,
          maxDex: shield[0].max_dex,
          checkPenalty: shield[0].check_penalty,
          enh: shield[0].enh,
          spellFail: shield[0].spell_fail
        },
        mainWeapon: {
          name: mainWeapon[0].name,
          hp: mainWeapon[0].hp,
          toggleDescr: mainWeapon[0].toggle_descr,
          description: mainWeapon[0].description,
          weight: mainWeapon[0].weight,
          value: mainWeapon[0].value,
          slot: mainWeapon[0].slot, // potentially need to convert to enum
          qtyOrUses: mainWeapon[0].qty_or_uses,
          damage: mainWeapon[0].damage,
          enh: mainWeapon[0].enh,
          crit: mainWeapon[0].crit,
          range: mainWeapon[0].range,
          type: mainWeapon[0].type, // potentially need to convert to enum
          category: mainWeapon[0].category // potentially need to convert to enum
        },
        offhand: {
          name: offhand[0].name,
          hp: offhand[0].hp,
          toggleDescr: offhand[0].toggle_descr,
          description: offhand[0].description,
          weight: offhand[0].weight,
          value: offhand[0].value,
          slot: offhand[0].slot, // potentially need to convert to enum
          qtyOrUses: offhand[0].qty_or_uses,
          damage: offhand[0].damage,
          enh: offhand[0].enh,
          crit: offhand[0].crit,
          range: offhand[0].range,
          type: offhand[0].type, // potentially need to convert to enum
          category: offhand[0].category // potentially need to convert to enum
        }
      }
    };
  } catch (error) {
    throw error;
  }
}

async function fetchEquipBlock(sheetId: number, connection: mysql.PoolConnection): Promise<charSheet.EquipBlock> {
  try {
    const [weightResults] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT light_load, med_load, heavy_load, curr_load
       FROM equip_block
       WHERE core_id = ?`, [sheetId]
    );

    const [moneyResults] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT amount, weight, money_type
       FROM money
       WHERE core_id = ?`, [sheetId]
    );

    const [bagResults] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT id, name, hp, toggle_descr, description, weight, value, slot, qty_or_uses, capacity
       FROM item JOIN bag ON item.id = bag.item_id
       WHERE equip_block_id = ?`, [sheetId]
    );

    const [itemResults] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT id, name, hp, toggle_descr, description, weight, value, slot, qty_or_uses
       FROM item
       WHERE equip_block_id = ? 
        AND id NOT IN (SELECT item_id FROM bag) 
        AND id NOT IN (SELECT item_id FROM equipped_items) 
        AND id NOT IN (SELECT equip_armor FROM combat_block)
        AND id NOT IN (SELECT equip_shield FROM combat_block)
        AND id NOT IN (SELECT equip_main_weapon FROM combat_block)
        AND id NOT IN (SELECT equip_offhand_weapon FROM combat_block)`, [sheetId]
    );

    const [wornResults] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT id, name, hp, toggle_descr, description, weight, value, slot, qty_or_uses
       FROM item
       WHERE equip_block_id = ? AND id IN (SELECT item_id FROM equipped_items)`, [sheetId]
    );

    return {
      bags: bagResults.map((bag: any) => {
        return {
          id: bag.id,
          name: bag.name,
          hp: bag.hp,
          toggleDescr: bag.toggle_descr,
          description: bag.description,
          weight: bag.weight,
          value: bag.value,
          slot: bag.slot, // potentially need to convert to enum
          qtyOrUses: bag.qty_or_uses,
          capacity: bag.capacity
        } as charSheet.Bag;
      }),
      coinPurse: moneyResults.map((money: any) => {
        return {
          amount: money.amount,
          weight: money.weight,
          type: money.money_type // potentially need to convert to enum
        } as charSheet.Money;
      }),
      inventory: itemResults.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          hp: item.hp,
          toggleDescr: item.toggle_descr,
          description: item.description,
          weight: item.weight,
          value: item.value,
          slot: item.slot, // potentially need to convert to enum
          qtyOrUses: item.qty_or_uses
        } as charSheet.Item;
      }),
      weight: {
        lightLoad: weightResults[0].light_load,
        medLoad: weightResults[0].med_load,
        heavyLoad: weightResults[0].heavy_load,
        currLoad: weightResults[0].curr_load
      },
      worn: wornResults.reduce((acc: Partial<Record<charSheet.EquipSlot, charSheet.Item>>, item: any) => {
        acc[item.slot as charSheet.EquipSlot] = {
          id: item.id,
          name: item.name,
          hp: item.hp,
          toggleDescr: item.toggle_descr,
          description: item.description,
          weight: item.weight,
          value: item.value,
          slot: item.slot, // potentially need to convert to enum
          qtyOrUses: item.qty_or_uses
        } as charSheet.Item;
        return acc;
      }, {})
    };
  } catch (error) {
    throw error;
  }
}

async function fetchFeatBlock(sheetId: number, connection: mysql.PoolConnection): Promise<charSheet.FeatBlock> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT name, toggle_descr, description
       FROM feat
       WHERE core_id = ?`, [sheetId]
    );

    return {
      entries: results.map((entry: any) => {
        return {
          name: entry.name,
          toggleDescr: entry.toggle_descr,
          description: entry.description
        } as charSheet.Feat;
      })
    };
  } catch (error) {
    throw error;
  }
}

async function fetchHPBlock(sheetId: number, connection: mysql.PoolConnection): Promise<charSheet.HPBlock> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT max_points, bonus_max_points, current, temp, non_lethal
       FROM hp_block
       WHERE core_id = ?`, [sheetId]
    );

    return {
      maxPoints: results[0].max_points,
      bonusMaxPoints: results[0].bonus_max_points,
      currentPoints: results[0].current,
      tempPoints: results[0].temp,
      nonLethal: results[0].non_lethal
    };
  } catch (error) {
    throw error;
  }
}

async function fetchSkillBlock(sheetId: number, connection: mysql.PoolConnection): Promise<charSheet.SkillBlock> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT total_ranks, remain_ranks
       FROM skill_block
       WHERE core_id = ?`, [sheetId]
    );

    const [skillResults] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT name, ability, armor_penalty, class_skill, trained, total_bonus, ranks, misc, editable
       FROM skill
       WHERE skill_block_id = ?`, [sheetId]
    );

    return {
      totalRanks: results[0].total_ranks,
      remainRanks: results[0].remain_ranks,
      skills: skillResults.map((skill: any) => {
        return {
          name: skill.name,
          ability: skill.ability, // potentially need to convert to enum
          armorPenalty: skill.armor_penalty,
          classSkill: skill.class_skill,
          trained: skill.trained,
          totalBonus: skill.total_bonus,
          ranks: skill.ranks,
          misc: skill.misc,
          editable: skill.editable
        } as charSheet.Skill;
      })
    };
  } catch (error) {
    throw error;
  }
}

async function fetchSpecialBlock(sheetId: number, connection: mysql.PoolConnection): Promise<charSheet.SpecialBlock> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT name, toggle_desc, description, uses_limit, used
       FROM special_entry
       WHERE core_id = ?`, [sheetId]
    );

    return {
      entries: results.map((entry: any) => {
        return {
          name: entry.name,
          toggleDescr: entry.toggle_desc,
          description: entry.description,
          usesLimit: entry.uses_limit,
          used: entry.used
        } as charSheet.SpecialEntry;
      })
    };
  } catch (error) {
    throw error;
  }
}

async function fetchMagicBlocks(sheetId: number, connection: mysql.PoolConnection): Promise<charSheet.MagicBlock[]> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT id, caster_class, caster_lvl, close_range, med_range, long_range
       FROM magic_block
       WHERE core_id = ?`, [sheetId]
    );

    const magicBlocks = await Promise.all(results.map(async (magic: any) => {
      return {
        casterClass: magic.caster_class,
        specialty: {
          mainSpecial: await fetchMainMagicSpecialties(sheetId, connection, magic.id),
          subSpecial: await fetchSubMagicSpecialties(sheetId, connection, magic.id)
        },
        casterLvl: magic.caster_lvl,
        closeRange: magic.close_range,
        medRange: magic.med_range,
        longRange: magic.long_range,
        spellsKnown: await fetchSpellsKnown(sheetId, connection, magic.id),
        spellSlots: await fetchSpellSlots(sheetId, connection, magic.id)
      } as charSheet.MagicBlock;
    }));

    return magicBlocks;
  } catch (error) {
    throw error;
  }
}

async function fetchMainMagicSpecialties(sheetId: number, connection: mysql.PoolConnection, magicId: number): Promise<charSheet.CasterSpecialEntry[]> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT name
       FROM main_specialty
       WHERE magic_block_id = ?`, [magicId]
    );

    return results.map((specialty: any) => {
      return {
        name: specialty.name
      } as charSheet.CasterSpecialEntry;
    });
  } catch (error) {
    throw error;
  }
}

async function fetchSubMagicSpecialties(sheetId: number, connection: mysql.PoolConnection, magicId: number): Promise<charSheet.CasterSpecialEntry[]> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT name
       FROM sub_specialty
       WHERE magic_block_id = ?`, [magicId]
    );

    return results.map((specialty: any) => {
      return {
        name: specialty.name
      } as charSheet.CasterSpecialEntry;
    });
  } catch (error) {
    throw error;
  }
}

async function fetchSpellsKnown(sheetId: number, connection: mysql.PoolConnection, magicId: number): Promise<charSheet.Spell[]> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT lvl, prepared, name, toggle_descr, description, school, duration, \`range\`, save_type, spell_res
       FROM spell
       WHERE magic_block_id = ?`, [magicId]
    );

    return results.map((spell: any) => {
      return {
        lvl: spell.lvl,
        prepared: spell.prepared,
        name: spell.name,
        toggleDescr: spell.toggle_descr,
        description: spell.description,
        school: spell.school,
        duration: spell.duration,
        range: spell.range,
        saveType: spell.save_type,
        spellRes: spell.spell_res
      } as charSheet.Spell;
    });
  } catch (error) {
    throw error;
  }
}

async function fetchSpellSlots(sheetId: number, connection: mysql.PoolConnection, magicId: number): Promise<charSheet.SpellSlot[]> {
  try {
    const [results] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT lvl, save_dc, total, class_amount, ability_bonus, misc, available
       FROM spell_slot
       WHERE magic_block_id = ?`, [magicId]
    );

    return results.map((slot: any) => {
      return {
        lvl: slot.lvl,
        saveDC: slot.save_dc,
        total: slot.total,
        classAmount: slot.class_amount,
        abilityBonus: slot.ability_bonus,
        misc: slot.misc,
        available: slot.available
      } as charSheet.SpellSlot;
    });
  } catch (error) {
    throw error;
  }
}

exports.api = functions.https.onRequest(app);