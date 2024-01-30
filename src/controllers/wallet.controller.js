const WalletTransaction = require('../models/walletTransaction.model');
const User = require('../models/user.model');
const crypto = require('crypto');
const sendEmail = require('../emails/email');
const paystack = require('paystack')(process.env.PAYSTACK_MAIN_KEY);
const axios = require('axios');



exports.makeTransfer = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    const { amount, accountNumber, bankName, reason } = req.body;
    const getBanks = await axios.get("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_MAIN_KEY}`,
        "Content-Type": "application/json",
      },
    });
       if (!getBanks.data.data.find(bank => bank.code === bankName)) {
        return res.status(400).json({ message: 'Invalid Bank Name' });
       }
    if (user.wallet < amount) {
        return res.status(400).json({ message: 'Insufficient funds' });
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      { $inc: { wallet: -amount } }
    );

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "nuban",
        name: user.firstName + " " + user.lastName,
        account_number: accountNumber,
        source: "balance",
        amount: amount * 100,
        bank_code: getBanks.data.data.find((bank) => bank.code === bankName).code,
        description: reason,
        email: user.email,
        currency: "NGN",
        metadata: {
          custom_fields: {
            display_name: "Bank Name",
            variable_name: "bank_name",
            value: getBanks.data.data.find((bank) => bank.code === bankName).name,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_MAIN_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const transferCode = paystackResponse.data.data.recipient_code;
    const transferData = paystackResponse.data;

    const transaction = await WalletTransaction.create({
      reference: crypto.randomBytes(9).toString("hex"),
      amount: amount,
      title: "Transfer to bank account",
      email: user.email,
      userId: user._id,
      payment_status: "pending",
      transfer_status: "pending",
      transfer_code: transferCode,
      bank_name: getBanks.data.data.find((bank) => bank.code === bankName).name,
      account_number: accountNumber,
      reason: reason,
    });

    return res
      .status(201)
      .json({
        message: "Transfer initiated successfully",
        transaction,
        transferData,
      });
  } catch (error) {
    console.error("Error making transfer:", error.message);
    return res
      .status(500)
      .json({
        error: "An error occurred while making transfer.",
        message: error.message,
        error: error.response.data,
      });
  }
};





exports.updateTransaction = async (req, res) => {
    try {
        const { transfer_code } = req.body;
        const transaction = await WalletTransaction.findOne({ transfer_code });
        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }
        if (transaction.transfer_status === "success") {
            return res.status(400).json({
                message: "Transaction already successful",
            });
        }
        const updateTransaction = await WalletTransaction.findOneAndUpdate(
            { transfer_code },
            {
                $set: {
                    transfer_status: "success",
                    payment_status: "success",
                },
            },
            { new: true }
        );
        const user = await User.findById(transaction.userId);
        await sendEmail({
            email: user.email,
            subject: "Transfer successful",
            html: `
            <h3>Transfer successful</h3>
            <p>Your transfer of ${transaction.amount} to ${transaction.bank_name} was successful</p>
            <p>and Account Name: ${transaction.account_number}</p>
            <p>Your reference number is: ${transaction.reference}</p>
            <p>You can view your transaction history <a href="https://decodeanalytical.herokuapp.com/dashboard/transactions">here</a></p>
            `,
        })
        return res.status(200).json({
            message: "Transaction successful",
            updateTransaction,
        });
    
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while updating transaction.",
            message: error.message,
        });
    }
}



      



