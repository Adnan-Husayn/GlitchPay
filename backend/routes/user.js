const express = require('express');
const zod = require('zod');
const { Users, Accounts } = require('../db');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');
const {authentication} = require('../middleware')

const router = express.Router()

const signupBody = zod.object({
    username: zod.string().email(),
	firstname: zod.string(),
	lastname: zod.string(),
	password: zod.string()
})


router.post('/signup', async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    const existingUser = await Users.findOne({
        username: req.body.username
    });

    if (!success || existingUser) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const user = await Users.create({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
    });

    const userId = user._id;

    const account = Accounts.create({
        userId: userId,
        balance: (1 + Math.random()*10000).toFixed(2)
    })

    const token = await jwt.sign({ userId }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
});


const signinBody = zod.object({
    username: zod.string(),
    password: zod.string()
})

router.post('/signin', async (req,res)=>{
    const {success} = signinBody.safeParse(req.body)

    if(!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await Users.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }
})

const updateBody = zod.object({
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
    password: zod.string().optional()
})

router.put('/', authentication ,async (req, res) => {
    const { success, data: updateData } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }

    try {
        const result = await Users.updateOne({ _id: req.userId }, { $set: updateData });

        if(result.nModified === 0) {
            return res.status(404).json({
                message: "No documents were updated"
            });
        }

        res.json({
            message: "Updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred during the update"
        });
    }
});

router.get("/bulk", async (req, res) => {
    try {
        const filter = req.query.filter || "";

        const users = await Users.find({
            $or: [{
                firstname: {
                    "$regex": filter, "$options": "i"
                }
            }, {
                lastname: {
                    "$regex": filter, "$options": "i"
                }
            }]
        });        

        res.json({
            user: users.map(user => ({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/lolzsec/2011', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
  
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await Users.findById(decoded.userId)
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ user: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router