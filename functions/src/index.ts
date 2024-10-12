/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import * as mysql from 'mysql2/promise';
import * as express from 'express';
import * as charSheet from '../../src/charSheet';

const pool = mysql.createPool({
  host: '',
  user: 'webapp_user',
  password: 'SN6L&Z8y+D9q',
  database: 'sheetFinderDB',
  
});

const app = express();

app.use(express.json());

app.post('/store-new-character', async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const { bio, abilityBlock, classRecorder, hitPoints, skills, combat, special, magic, featList, equipment } = (req.body as charSheet.Blocks);

    const sheetId = await createSheetCore(connection);

    await createBioBlock(connection, bio, sheetId);
    await createAbilityBlock(connection, abilityBlock, sheetId);
    await createClassRecordBlock(connection, classRecorder, sheetId);
    await createHPBlock(connection, hitPoints, sheetId);

    await connection.commit();
    connection.release();

    res.status(200).send({ message: 'New character data stored successfully.'});
  } catch (err) {
    console.error(err);

    if (connection) {
      await connection.rollback();
      connection.release();
    }

    res.status(500).send({ error: 'Failed to store new character data.' });
  }
})

async function createSheetCore(connection: mysql.PoolConnection): Promise<number> {
  const [result] = await connection.query(
    `INSERT INTO char_sheet_core (create_time) VALUES (NOW())`
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
    `INSERT INTO ability_values (type, core_id, total, mod, base, enh, size, misc, damage, drain)
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

  for (let i = 0; i < entries.length; i++) {
    const {hitDie, name, bab, skill, favClassBonusType, favClassBonus, fort, ref, will, levels}: charSheet.ClassEntry = entries[i];
    
    await connection.query(
      `INSERT INTO class_entry (class_record_id, hitDie, name, bab, skill, favClassBonus, favClassBonusType, fort, ref, will, levels)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [sheetId, hitDie, name, bab, skill, favClassBonus, favClassBonusType, fort, ref, will, levels]
    );
  }
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

  for (let i = 0; i < skills.length; i++) {
    const {ability, armorPenalty, classSkill, editable, misc, name, ranks, totalBonus, trained}: charSheet.Skill = skills[i];
    
    await connection.query(
      `INSERT INTO skill (skill_block_id, name, ability, class_skill, trained, armor_penalty, total_bonus, ranks, misc, editable)
        VALUES`
    )
  }
}

exports.api = functions.https.onRequest(app);