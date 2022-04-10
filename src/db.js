import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  /*useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  위 네줄은 몽구스 버전 6.0 이상이라면 쓰면안된다*/
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);
