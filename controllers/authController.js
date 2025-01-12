const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { result } = require('lodash');

exports.signup = (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword],
        (err, result) => {
            if (err) {
                res.status(500).send('Error on the server.');
            } else {
                res.status(200).send({ id: result.insertId, username });                
            }
        }
    )};

exports.login = (req, res) => {
    const { username,password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username],
        (err, result) => {
            if (err) return res.status(500).send('Error on the server.');
            if (result.length === 0) return res.status(404).send('User not found.');

            const user = result[0];
            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) return res.status(401).send({ auth: false, token: null});

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
            res.status(200).send({ auth: true, token});
        });
};