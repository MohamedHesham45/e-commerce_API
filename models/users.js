const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  image: {
    type: String,
    default: "./user/avatar.png"
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: Array,
  },
  favourite:{
    type:Array,
  }
},
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  }
)
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = model("User", userSchema);


module.exports = User;