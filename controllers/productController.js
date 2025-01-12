const db = require('../config/db');

exports.addProduct = (req, res) => {
    const { name, price, inventory } = req.body;

    db.query('INSERT INTO products (name, price, inventory) VALUES (? ?, ?)',
        [name, price, inventory], (err, result) => {
            if (err) return res.status(500).send('Error on the server.');
            res.status(201).send({ id: result.insertId, name, price, inventory });
    });
};

exports.getProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).send('Error on the server.');
        res.status(200).send(results);
    });
};

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, inventory } = req.body;

    db.query('UPDATE products SET name = ?, price = ?, inventory = ? WHERE id = ?',
        [name, price, inventory, id], (err, result) => {
            if (err) return res.status(500).send('Error on the server.');
            res.status(200).send({ id, name, price, inventory }); 
    });
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send('Error on the server.');
        res.status(204).send({ id });
    });
};