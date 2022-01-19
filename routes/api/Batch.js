const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const BatchModel = mongoose.model("Batch");

//Get all batches
router.get("/", async (req, res) => {
  BatchModel.find((err, docs) => {
    if (!err) {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json(docs);
    } else {
      return res
        .status(500)
        .json({
          message: "Error collecting documents from collection",
          status: 500,
        });
    }
  })
    .select("-__v")
    .lean();
});

//Get all college and batches available in it
router.get("/college/:college_id", async (req, res) => {
  var college_id = req.params.college_id;
  college_id = mongoose.Types.ObjectId(college_id);

  BatchModel.aggregate(
    [{ $match: { college_id: college_id } }],
    function (err, data) {
      if (err) {
        return res.status(500).json({
          message: "Error aggregating batches",
        });
      }

      return res.status(200).json(data);
    }
  );
});

//Post a batch
router.post("/", (req, res) => {
  var batch = new BatchModel();
  batch.starting_year = req.body.starting_year;
  batch.pass_out_year = req.body.pass_out_year;
  batch.college_id = req.body.college_id;

  res.setHeader("Content-Type", "application/json");
  batch.save((err, doc) => {
    if (!err) {
      return res.status(200).json({ message: "success", status: 200 });
    } else {
      console.log(err);
      return res.status(500).json({ message: "error", status: 500, err: err });
    }
  });
});

//Delete a memeber by id
router.delete("/id/:id", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const result = await BatchModel.findByIdAndDelete({ _id: req.params.id });
    return res
      .status(200)
      .json({ message: "Deleted Successfully", status: 200 });
  } catch {
    return res.status(500).json({ message: "error", status: 500 });
  }
});

module.exports = router;
