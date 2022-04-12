import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.WASABI_ID,
    secretAccessKey: process.env.WASABI_SECRET,
    region: "us-west-1", //와사비 전용 서버지역 설정
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "ygtube-wasabi/images",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "ygtube-wasabi/videos",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "양튜브";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 1000000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});

export const s3DeleteAvatarMiddleware = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  s3.deleteObject(
    {
      Bucket: `yangtube2022`,
      Key: `images/${req.session.user.avatarURL.split("/")[4]}`,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      console.log(`s3 deleteObject`, data);
    }
  );
  next();
};
