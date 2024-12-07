/* controllers/admin.controllers.js  */

const File = require("../models/files.models");
const User = require("../models/user.models.js");

/*  in admin controllers we are handle admin data , like user , download , premium , and memory usage count  && searching a file and user for updating , deleting  , and for a file we are going add sharedLink of dropbox  */

const searchFileAndUSer = async (req, res) => {
  try {
    if (!req.body.originalFileName) {
      res.send("please give me proper file ");
    }

    const findFile = await File.find({
      $or: [
        {
          originalFileName: { $regex: req.body.originalFileName },
        },
      ],
    });

    res.send(findFile);
  } catch (error) {
    res.render("admin/admin", {
      title: "error",
      error: error,
    });
  }
};

/* lets add here admin info  */

// const adminDetails = async () => {
//   try {


//   } catch (error) {
//     console.log(error);
//   }
// };

/* we are exporting this to show admin page  */
const admin = async(req, res) => {

  const adminDetails = await User.findOne(
    { _id: req.user.userId },
    "username email "
  );


  res.render("admin/admin", {
    title: "admin",
    adminDetails,
    searchFileAndUSer,
    error: null,
  });
};

module.exports = { admin, searchFileAndUSer };
