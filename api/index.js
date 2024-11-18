/* api/index.js */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const path = require("path");
/* FILES */
const connect = require("../src/db/connect.db.js");
const { fileRouter } = require("../src/routes/files.routes.js");
const { userRouter } = require("../src/routes/user.routes.js");
const { webRouter } = require("../src/routes/web.routes.js");
const { showRouter } = require("../src/routes/show.routes.js");
const { pageNotfoundRouter } = require("../src/routes/pageNotfound.routes.js");
const { downloadRouter } = require("../src/routes/download.routes.js");
const authUser = require("../src/middleware/auth.middleware.js");
/* cleanup - means delete the file after 24hrs */
require("../src/utils/cleanup.utils.js");

/* view ejs engine */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
// ROUTES
/* webRouter helps to routing all ejs pages - web route */
// app.use(authUser);
app.use("/", webRouter);
app.use("/api/v1/files", fileRouter);
/* if we don't need then remove this showRouter  & downloadRouter after completing code */
app.use("/files", showRouter);
app.use("/files/download", downloadRouter);
app.use("/api/v1/user", userRouter);
app.use("*", pageNotfoundRouter);

const port = process.env.port || 3000;
(async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log("server is running on  http://localhost:" + port);
    });
  } catch (error) {
    console.log("err occurred at running a server " + error);
  }
})();

module.exports = app;
