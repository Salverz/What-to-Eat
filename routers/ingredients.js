const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Page for entering ingredients
router.get('/', async (req, res) => {
    rows = await db.executeSQL(`SELECT ingredient
                                FROM ingredients
                                WHERE userId = ?`,
                                [req.session.user.id]);
    req.session.user.ingredients = rows;
    res.render('ingredients', { "ingredients": req.session.user.ingredients });
  });

// Add an ingredient to the database
router.post('/add', async (req, res) => {
    const sql = `INSERT INTO ingredients (ingredient, userId)
                 SELECT ?, ?
                 WHERE NOT EXISTS (
                 SELECT * FROM ingredients
                 WHERE ingredient = ? AND userId = ?
                 )`;
    const params = [req.body.ingredient, req.session.user.id, req.body.ingredient, req.session.user.id];
    const rows = await db.executeSQL(sql, params);
    const success = rows.affectedRows;
    res.send({ success: success });
});

// Remove an ingredient from the database
router.post('/remove', async (req, res) => {
    const sql = `DELETE FROM ingredients 
                 WHERE userId = ? AND ingredient = ?`;
    const params = [req.session.user.id, req.body.ingredient];
    const rows = await db.executeSQL(sql, params);
    const success = rows.affectedRows;
    res.send({ success: success });
  });

module.exports = router;