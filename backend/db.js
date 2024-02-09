const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://adnanhusayn:gLPK2bMv6fpPU7J@eren1000-7.ldsc5ok.mongodb.net/GlitchPay')

const userSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    password: String
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const Users = mongoose.model('user', userSchema)
const Accounts = mongoose.model('account', accountSchema)

module.exports = {
    Users,
    Accounts
}