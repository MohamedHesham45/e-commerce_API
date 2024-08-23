const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.stripe = async (req, res, next) => {
    let items = req.body;
    const nowItems = items.map((item) => {
        return {
            price_data: {
                currency: "egp",
                product_data: {
                    name: item.product.title,
                },
                unit_amount: item.product.price * 100,
            },
            quantity: item.quantity,
        }
    })
    const session = await stripe.checkout.sessions.create({
        line_items: nowItems,
        mode: "payment",
       
        success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/cancel`,
    });
    res.redirect(session.url);
}
exports.completePayment = async (req, res, next) => {
    const session_id = req.query.session_id;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);


        res.render(process.env.SUCCESS_PAGE_URL, { session });
    } catch (error) {
        res.status(500).send('An error occurred during payment.');
    }
};
exports.cancel=(req,res)=>{
    res.render(process.env.CART_PAGE_URL)
}
