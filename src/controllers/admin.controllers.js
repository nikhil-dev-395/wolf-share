/* controllers/admin.controllers.js  */

const File = require("../models/files.models");

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

/* we are exporting this to show admin page  */
const admin = (req, res) => {
  res.render("admin/admin", {
    title: "admin",
    searchFileAndUSer,
    error: null,
  });
};

module.exports = { admin, searchFileAndUSer };
