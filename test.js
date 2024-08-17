User = require('./../models/users');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const multer = require('multer');
const secret="this_is_token_secret" 
const expiresInTime="90d"
const cloud = require('../cloudinary')


const Token = id => {
  return jwt.sign({ id }, secret,{
    expiresIn:expiresInTime
  });
};

const createSendToken = (user, statusCode, res ,message) => {
  const token = Token(user._id);
    // Remove password from output
    user.password = undefined;
    data=user
  res.status(statusCode).json({
    status:"success",
    message,
    token,
    data  
    
  });
};

const multerStorage = multer.diskStorage({
  destination: 'public/img/user',
  filename : async(req,file,cb)=>{
    fileName=file.filename =  user-${req.user.id}-${Date.now()}.jpeg
  cb(null,fileName)
  }
})
const multerFilter = (req, file, cb) => {
    cb(null, true);
};


   const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  });
  
      
exports.uploadUserPhoto = upload.single('photo');
exports.uploadUserBackGroundPhoto = upload.single('backGroundPhoto');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj; 
};

exports.signup =catchAsync( async (req, res, next) => { 
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,  
  });
  createSendToken(newUser, 201, res,req.t('createUser'));
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password'); 
  
  if (!user) {
    return next(new AppError(req.t('checkEmail'), 400));
  }
  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError(req.t('checkPassword'), 400));
  }
  user.login=true
  await user.save({ validateBeforeSave: false })
  createSendToken(user, 200, res,req.t('loginSuccess'));
  
});

exports.logout=catchAsync(async (req, res, next) => {
  const user =req.user
  user.login=false
  user.save({ validateBeforeSave: false })
  res.status(200).json({
    status: 'success',
    message: req.t('loginSuccess'),
    token:req.headers.authorization,
    data:user
    });
});

exports.profile =catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  
  res.status(200).json({
    status: 'success',
    message: "null",
    token: req.headers.authorization,
    data: currentUser,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization ) {
    token = req.headers.authorization;
  }
  if (!token) {
    return next(
      new AppError(req.t('noToken'), 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, secret);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  
  if (!currentUser) {
    return next(
      new AppError(
        req.t('faultToken'),
        401
      )
    );
  }
  if(currentUser.login==false){
    return next(new AppError(req.t('expireToken',401)))
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(req.t('tokenChangePassword'), 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(req.t('NoBelongEmail'), 400));
  }
  if(user.role=='google'||user.role=='facebook')return next(new AppError(req.t('noUpdate'), 400));


  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
 
  try {
    await sendEmail({
      name:user.name,
      email: user.email,
      message:resetToken,
      subject: 'Receive your password reset code ',
      fromWhat:'forgot'
    });

    res.status(200).json({
      status: 'success',
      message: req.t('sendCode'),
      data:null
    });
    
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(req.t('errorsendCode')),
      400
    );
  }
});





exports.trueCode = catchAsync(async (req, res, next) => {
        // 1) Get user based on the token
      const hashedToken = crypto
      .createHash('sha256')
      .update(req.body.code)
      .digest('hex');
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
        });
        req.user=user
        next()
    
});

exports.verifyCode = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError(req.t('expireCode'), 400));
    }
    res.status(200).json({
      status: 'success',
      message: req.t('verifyCode'),
      data:null
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  user=req.user
  if (!user) {
    return next(new AppError(req.t('expireToken'), 400));
    }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res,req.t('changePass'));
});

exports.resetPasswordByButton = catchAsync(async (req, res, next) => {

  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError(req.t('expireToken'), 400));
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res,req.t('changePass'));
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  if(req.user.role=='google'||req.user.role=='facebook')return next(new AppError(req.t('noUpdate'), 400));
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(req.t('checkPassword'), 400));
  }

  // 3) If so, update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!
  user.passwordChangedAt=undefined;
  // 4) Log user in, send JWT
  createSendToken(user, 200, res,req.t('changePass'));
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        req.t('updateProfileP'),400
      )
    );
  }
  if(req.user.role=='google'||req.user.role=='facebook')return next(new AppError(req.t('noUpdate'), 400));

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log(req.file)

  if (req.file) {
    const result = await cloud.uploads(req.file.path)
    filteredBody.photo = result.url;
}  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  }); 
  
  res.status(200).json({
    status: 'success', 
    message:req.t('updateProfile'),
    user: updatedUser,
   
  });
});
exports.delete= catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id); 
  res.status(200).json({
    status: 'success',
    message:req.t('deleteUser'),
    data: null
  });
});

exports.restrictTo = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return next(
        new AppError(req.t('noAdmin'), 403)
      );
    }
    req.user=req.user
    next();
};

exports.changeBackGround=catchAsync(async (req, res, next) => {
if(JSON.stringify( req.body)!=='{}')    return next(new AppError(req.t('changebackgrounder'), 400));
if (!req.file)return next(new AppError(req.t('uploadImage'), 400));
const result = await cloud.uploads(req.file.path)
filteredBody={backGroundPhoto : result.url}
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  }); 
  
  res.status(200).json({
    status: 'success', 
    message:req.t('changebackground'),
    user: updatedUser,
   
  });
});
exports.googleLogin=catchAsync(async (req, res, next) => {
  user=req.user
  createSendToken(user, 200, res,req.t('loginSuccess'));

});
exports.facebookLogin=catchAsync(async (req, res, next) => {
  user=req.user
  createSendToken(user, 200, res,req.t('loginSuccess'));

});