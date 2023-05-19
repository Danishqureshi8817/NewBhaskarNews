const generateToken = require('../utils/generateToken');
const User = require('../models/UserModel');
var crypto = require('crypto');
var mailer = require('../utils/Mailer');



// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public


// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body

//   const user = await User.findOne({ email })

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       avatar: user.avatar,
//       token: generateToken(user._id),
//       favorites: user.favorites,
//     })
//   } else {
//     res.status(401).json({
//       success: false,
//       msg: 'Unauthorized user'
//     })
//   }
// })



// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
    console.log(req.body)

    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        // && userExists.active
        if (userExists ) {
            return res.status(400).json({
                success: false,
                msg: 'Entered email id already registered with us. Login to continue'
            })
        } 
        // else if (userExists && !userExists.active) {
        //     return res.status(400).json({
        //         success: false,
        //         msg: 'Account created but need to active. A link sent with your register mobile no'
        //     })
        // }

        const user = new User({
            name, email, password
        });


        //Generate 20 bit activation code ,crypto is build package of nadejs
        // crypto.randomBytes(20, function (err, buf) {


        //     //Ensure the activation link is unique
        //     user.activeToken = user._id + buf.toString('hex');


        //     //set expiration time is 24 hours
        //     user.activeExpires = Date.now() + 24 * 3600 * 1000;


        //     var link = process.env.NODE_ENV == 'development' ? `http://localhost:${process.env.PORT}/api/users/active/${user.activeToken}`
        //         : `${process.env.api_host}/api/user/active/${user.activeToken}`;

        //     //Sending activation mail
        //     mailer.send({
        //         to: req.body.email,
        //         subject: true,
        //         html: 'Please click <a href="' + link + '">here</a> to activate your account.'

        //     });



            //save user object 
            user.save(function (err, user) {
                if (err) return next(err);
                res.status(201).json({
                    success: true,
                    // msg: 'The activation link has been sent to' + user.email + ',please click the activation link in Spam folder '
                    msg: 'Account Created Successfully. Please log in. '
                })
            })

        // })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Server having some issues'
        })
    }


}

//activation Token
// const activeToken = async (req, res, next) => {
// console.log("activeToken",req.params.activeToken);
//     //find the corresponding user
//     User.findOne({
//         activeToken: req.params.activeToken,
//         // activeExpires: {$gt: Date.now()}
//     }, function (err, user) {
//         if (err) return next(err);


//         //if invalid activation code
//         if (!user) {
//             return res.status(400).json({
//                 success: false,
//                 msg: 'Your activation link is invalid'
//             });
//         }

//         if (user.active == true) {
//             return res.status(200).json({
//                 success: false,
//                 msg: 'Your account already activated go and login to use this app'
//             })
//         }

//         //if not activated actiavte and save
//         user.active = true;
//         user.save(function (err, user) {
//             if (err) return next(err);


//             //Activation success
//             res.json({
//                 success: true,
//                 msg: 'Activation success'
//             });
//         })
//     })
// };

//Login Api
const authUser = async (req,res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)

        })
    } else {
        res.status(401).json({
            success: false,
            msg: 'Unauthorized user'
        })
    }
}


//Fetch Login user profile
const getUserProfile = async (req,res) => {
    const user = await User.findById(req.header._id);

    if(user) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        })
    } else {
        res.status(404).json({
            success: false,
            msg: 'User not found'
        })
    }
}


//update user
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.header._id);

    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar;


        const updatedUser = await user.save();

        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            token: generateToken(updatedUser._id),
    
        })
    } else {
        res.status(404).json({
            success: false,
            msg: 'User not found'
        })
    }

   
}


module.exports = {
    registerUser,
    // activeToken,
    authUser,
    getUserProfile,
    updateUserProfile,
};