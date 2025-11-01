const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength:[3, 'Username must be atleast 3 characters long']
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        minlength: [5, 'Password must be atleast 6 characters long']
    }
},{
    timestamps: true
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(this.password,salt);
    this.password = hashedPassword;
    next();
})

userSchema.methods.comparePassword = async function(enterdedPassword){
    return await bcrypt.compare(enterdedPassword,this.password);
}

module.exports = mongoose.model('User', userSchema);