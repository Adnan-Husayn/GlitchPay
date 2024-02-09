const express = require('express');
const { authentication } = require('../middleware');
const jwt  = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { Accounts } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router()

router.get('/balance', authentication , async (req, res)=>{
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, JWT_SECRET)

    const account = await Accounts.findOne({userId: decodedToken.userId})

    res.json({
        balance: account.balance
    })

})

router.post('/transfer', authentication, async (req, res)=>{
    
    const session = await mongoose.startSession()
    session.startTransaction()

    const { to , amount} = req.body

    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, JWT_SECRET)

    const account = await Accounts.findOne({userId: decodedToken.userId}).session(session)

    if(!account || account.balance < amount){
        await session.abortTransaction()
        return res.status(411).json({
            message: "Insufficient balance"
        })
    }

    const toAccount = await Accounts.findOne({userId: to}).session(session)

    if(!toAccount){
        await session.abortTransaction()
        return res.status(411).json({
            message: "Invalid Account"
        })
    }

    await Accounts.updateOne({userId: decodedToken.userId}, {$inc:{balance: -amount}}).session(session)
    await Accounts.updateOne({userId: to}, {$inc:{balance: amount}}).session(session)

    await session.commitTransaction()
    res.status(200).json({
        message: "Transfer Successful"
    })

})



module.exports = router