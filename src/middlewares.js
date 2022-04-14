import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const S3 = require("aws-sdk/clients/s3");
const wasabiEndpoint = new aws.Endpoint("s3.us-west-1.wasabisys.com");

const s3 = new S3({
  endpoint: wasabiEndpoint,
  region: "us-west-1",
  accessKeyId: process.env.WASABI_ID,
  secretAccessKey: process.env.WASABI_SECRET,
});

const wasabiUpload = s3.putObject(
  {
    Bucket: "ygtube-wasabi",
  },
  (err, data) => {
    if (err) {
      console.log(err);
    }
  }
);

/* const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
}); */

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "yangtube2022/images",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "yangtube2022/videos",
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

const isHeroku = process.env.NODE_ENV === "production";

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
  storage: isHeroku ? wasabiUpload : undefined,
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
