const db = require('../config/db');

exports.addToCart = (req, res) => {
    const { userId, productId, quantity } = req.body;

    db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity],
        (err, result) => {
            if(err) return res.status(500).send('error on the server.');
            res.status(201).send({ id: result.insertId, userId, productId, quantity });
    });
};

exports.removeFromCart = (erq, res) => {
    const { id } = req.params;

    db.query('DELETE FROM cart WHERE id = ?', [id],
        (err, result) => {
            if(err) return res.status(500).send('Error on the server.');
            res.status(204).send({ id });
        });
};

exports.viewCart = (req, res) => {
    const { userId } = req.params;

    db.query('SELECT * FROM cart WHERE user_id = ?', [userId],
        (err, result) => {
            if (err) return res.status(500).send('Error on the server.');
            res.status(200).send(result);
    });
};

exports.updateCart = (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id],
        (err, result) => {
            if(err) return res.status(500).send('Error on the server.');
            res.status(200).send({ id, quantity });
    });
};

