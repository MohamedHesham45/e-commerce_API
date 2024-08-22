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
    default: "https://ik.imagekit.io/7ksxy0uxk/e-commerce/image-66bd20d57bc0778bbe723d3a-1724163754541_D9lZaYMkG.jpeg?updatedAt=1724163756240"
  },
  role: {
    type: String,
    default: "user",
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
  cart: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]
  ,

  favourite: [{ type: Schema.Types.ObjectId, ref: 'Product' }]

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