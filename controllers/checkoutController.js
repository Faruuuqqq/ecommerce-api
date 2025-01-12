const db = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.checkout = async (req, res) => {
    const { userId } = req.body;

    try {
        // Step 1: Get the user's cart items
        db.query('SELECT * FROM carts WHERE user_id = ?', [userId], async (err, cartItems) => {
            if (err) return res.status(500).send("Error retrieving cart items.");
            if (cartItems.length === 0) return res.status(400).send("Cart is empty.");

            // Step 2: Prepare line items for Stripe
            const lineItems = await Promise.all(cartItems.map(item => {
                return new Promise((resolve, reject) => {
                    db.query('SELECT * FROM products WHERE id = ?', [item.product_id], (err, products) => {
                        if (err) return reject(err);
                        if (products.length === 0) return reject(new Error("Product not found."));
                        
                        const product = products[0];
                        resolve({
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: product.name,
                                },
                                unit_amount: product.price * 100, // Stripe expects the amount in cents
                            },
                            quantity: item.quantity,
                        });
                    });
                });
            }));

            // Step 3: Create a Stripe Checkout session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/success`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            });

            // Step 4: Send the session URL to the client
            res.status(200).send({ url: session.url });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during checkout.");
    }
};