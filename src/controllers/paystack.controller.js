const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');

const crypto = require('crypto');
const StudentCourse = require('../models/student.model');
const sendEmail = require('../emails/email');
const paystack = require('paystack')(process.env.PAYSTACK_MAIN_KEY);


exports.paystackPayment= async(req, res) => {
    const { email } = req.body;
    const existingEmail = await User.findOne({ email });
    if (!existingEmail) {
        return res.status(400).json({
            message: 'Invalid Email, The email does not exist'
            }); 
    }
    // 64d2553bae36cd1aca997a59
    const id = req.params.id
    const course = await Course.findById( id );
    // Create a new order in the database
    const transaction = await Transaction.create({
        reference: crypto.randomBytes(9).toString('hex'),
        amount: course.price,
        title: course.title,
        email: existingEmail.email,
        userId: existingEmail._id       
      });     
  // Use Paystack library to initiate payment
    const paystackPayment = paystack.transaction.initialize({
        amount: transaction.amount * 100, // Paystack accepts amount in kobo (multiply by 100 to convert to kobo)
        email: transaction.email,
        reference: transaction.reference,
        }, 
        (error, response) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred while initializing payment.' });
                } else {
                    return res.json(response.data.authorization_url); // Return the authorization URL to frontend
                }
            }
        )};
        
        // to receive event and Paystack data from convoy webhook
exports.decodePaystack = async (req, res) => {
    try {
        const { event, data } = req.body; 
        if(event === 'charge.success'){
            const { reference } = data;
            const transaction = await Transaction.findOne({ reference });
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            } 
            const existingCourse =   await Course.find({title: transaction.title})
            // console.log({existingCourse})    
            const user = await User.findById(transaction.userId);
            if (user) {
                await User.findOneAndUpdate(
                {
                    _id: user._id
                },
                {
                  $push: {hasPaid: existingCourse._id }
                },
                {
                    new : true,
                });
            }
            // console.log({user})
            await sendEmail({
                email: user.email,
                subject: `Payment Successful`,
                message: `            
  <head></head>

  <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px">
      <tr style="width:100%">
        <td><img alt="DECODE" src="/public/decodelogo.jpeg" width="170" height="50" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" />        
          <p style="font-size:16px;line-height:26px;margin:16px 0">Hello, ${user.firstName} ${user.lastName}, <br>
                        You have successfully made the payment of the one time non-refundable ${transaction.amount} to be member. <br>                       
                        . <br><br><br>
                        Thanks for patronage.</p>
          <table style="text-align:center" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td><a href="#" target="_blank" style="background-color:#5F51E8;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;line-height:100%;max-width:100%;padding:12px 12px"><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#5F51E8;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px">Reference: ${transaction.reference}.</span><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
              </tr>
            </tbody>
          </table>
          <p style="font-size:16px;line-height:26px;margin:16px 0">Best,<br /><br/>The Decode team</p>
          <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0"/>
          <p style="font-size:12px;line-height:24px;margin:16px 0;color:#8898aa"> Lagos, Nigeria </p>
        </td>
      </tr>
    </table>
  </body>
</html>`
});
} 
}catch (error) {        
        return res.status(500).json({ 
            error: 'An error occurred while initializing payment.',
            message: error.message
        });
    }
}
