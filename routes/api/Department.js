const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const DepartmentModel = mongoose.model("Department");
const CollegeModel = mongoose.model("College");
const BatchModel = mongoose.model("Batch");

//Get all departments
router.get("/", async (req, res) => {
  DepartmentModel.find((err, docs) => {
    if (!err) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(docs);
    } else {
      res
        .status(500)
        .json({
          message: "Error collecting documents from collection",
          status: "500",
        });
    }
  })
    .select("-__v -createdAt -updatedAt")
    .lean();
});

//Get a particular department by id
router.get("/id/:id", async (req, res) => {
  var id = req.params.id;
  DepartmentModel.findById(id, function (err, docs) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error", status: "404" });
    } else {
      res.status(200).json(docs);
    }
  })
    .select("-__v -createdAt -updatedAt")
    .lean();
});

//get department by batch , college id
router.get("/college/:college_id/batch/:batch_id", async (req, res) => {
  var college_id = req.params.college_id;
  college_id = mongoose.Types.ObjectId(college_id);

  var batch_id = req.params.batch_id;
  batch_id = mongoose.Types.ObjectId(batch_id);
  //var years = batch.split('-');
  //var starting_year = years[0];
  //var pass_out_year = years[1];

  DepartmentModel.aggregate(
    [{ $match: { college_id: college_id, batch_id: batch_id } }],
    function (err, data) {
      if (err) {
        res.status(500).json({
          message: "Error aggregating department data",
          err: err,
        });
      }

      //console.log( JSON.stringify( data, undefined, 2 ) );
      res.status(200).json(data);
    }
  );
});

//Get department if the college name exists
router.get("/college_name/:college_name/", async (req, res) => {
  const college_name = req.params.college_name.trim();

  CollegeModel.findOne({ name: college_name }, function (err, doc) {
    if (err) {
      return res.status(500).json({ message: "Error", err: err, status: 500 });
    } else if (!doc || doc.length < 1) {
      return res
        .status(404)
        .json({ message: "College is not found", status: 404 });
    } else {
      const college_id = doc._id;
      DepartmentModel.aggregate(
        [{ $match: { college_id: college_id } }],
        function (err, data) {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error", err: err, status: 500 });
          }

          if (data.length < 1) {
            return res
              .status(404)
              .json({ message: "No departments in the college", status: 404 });
          } else {
            return res.status(500).json(data);
          }
        }
      );
    }
  }).select("-__v -createdAt -updatedAt");
});

//Get department if the college name and batch exists
router.get("/college_name/:college_name/batch/:batch", async (req, res) => {
  const college_name = req.params.college_name.trim();

  const batch = req.params.batch.trim().split("-");
  const starting_year = batch[0];
  const pass_out_year = batch[1];

  CollegeModel.exists({ name: college_name }, function (err, doc) {
    if (err) {
      return res.status(500).json({ message: "Error", err: err, status: 500 });
    } else if (!doc || doc.length < 1) {
      return res
        .status(404)
        .json({ message: "College is not found", status: 404 });
    } else {
      const college_id = doc._id;

      BatchModel.exists(
        { starting_year: starting_year, pass_out_year: pass_out_year },
        function (err, doc) {
          if (err || !doc || doc.length < 1) {
            return res
              .status(404)
              .json({ message: "Batch is not found", status: 404 });
          } else {
            const batch_id = doc._id;

            DepartmentModel.aggregate(
              [{ $match: { college_id: college_id, batch_id: batch_id } }],
              function (err, data) {
                if (err) {
                  return res
                    .status(500)
                    .json({ message: "Error", err: err, status: 500 });
                }

                //console.log( JSON.stringify( data, undefined, 2 ) );
                if (data.length < 1) {
                  return res
                    .status(404)
                    .json({
                      message: "No departments in the college",
                      status: 404,
                    });
                } else {
                  return res
                    .status(200)
                    .json({ message: "success", data: data, status: 200 });
                }
              }
            );
          }
        }
      );
    }
  });
});

//Post a department
router.post("/", (req, res) => {
  var department = new DepartmentModel();
  department.department_name = req.body.department_name;
  department.college_id = req.body.college_id;
  department.batch_id = req.body.batch_id;
  department.sections = req.body.sections;

  res.setHeader("Content-Type", "application/json");
  department.save((err, doc) => {
    if (!err) {
      return res.status(200).json({ message: "success", status: 200 });
    } else {
      console.log(err);
      return res.status(500).json({ message: "error", status: 500, err: err });
    }
  });
});

//Delete a department by id
router.delete("/id/:id", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const result = await DepartmentModel.findByIdAndDelete({
      _id: req.params.id,
    });
    return res
      .status(200)
      .json({ message: "Deleted Successfully", status: 200 });
  } catch {
    return res.status(500).json({ message: "error", status: 500 });
  }
});

module.exports = router;
