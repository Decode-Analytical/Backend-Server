const WalletTransaction = require('../models/walletTransaction.model');
const User = require('../models/user.model');
const Pin = require('../models/pin.models');
const crypto = require('crypto');
const sendEmail = require('../emails/email');
const paystack = require('paystack')(process.env.PAYSTACK_MAIN_KEY);
const axios = require('axios');



exports.makeTransfer = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    if (user.isBlocked === true) {
      return res.status(400).json({ message: 'You are blocked from transferring' });
    }
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
    const confirmPin = await Pin.findOne({ userId: user._id, pin: req.body.pin });
    if (!confirmPin) {
      return res.status(400).json({ message: 'Invalid Pin' });
    }

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
    const accountName = paystackResponse.data.data.details.account_name
    const transferData = paystackResponse.data;

    const transaction = await WalletTransaction.create({
      reference: crypto.randomBytes(9).toString("hex"),
      amount: amount,
      title: "Transfer to bank account",
      email: user.email,
      userId: user._id,
      transfer_code: transferCode,
      account_name: accountName,
      bank_name: getBanks.data.data.find((bank) => bank.code === bankName).name,
      account_number: accountNumber,
      reason: reason,
    });
    await sendEmail({
      email: user.email,
      subject: "Transfer initiated",
      message: `Transfer initiated for NGN${amount} to ${getBanks.data.data.find((bank) => bank.code === bankName).name}. Your reference number is: ${transaction.reference}`,
    })

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


exports.viewTransferTransactions = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    const transactions = await WalletTransaction.find({ userId: user._id });
    return res.status(200).json({
      message: "Transfer transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "An error occurred while retrieving transfer transactions.",
        message: error.message,
        error: error.response.data,
      });
  }
};


// view the balance in user's wallet
exports.viewWalletBalance = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    return res.status(200).json({
      message: "Wallet balance retrieved successfully",
      wallet: user.wallet,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "An error occurred while retrieving wallet balance.",
        message: error.message,
        error: error.response.data,
      });
  }
};

      



