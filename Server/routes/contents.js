import express from 'express';
import contents from '../schemas/contents';
import mongoose from 'mongoose';

let router = express.Router();

router.get('/fetchCollections', function (req, res) {
  contents.find({}, (err, docs) => {
    if (err) return console.log(err);
    res.json(docs);
  });
});

router.get('/fetchCollection/:id', function (req, res) {
  contents.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return console.log(err);
    res.json(doc);
  });
});

router.post('/removeDocument', function (req, res) {
  contents.findOne({ _id: req.body.contentId }, (err, doc) => {
    if (err) return console.log(err);
    doc.data.forEach((entry, index) => {
      if (entry._document_id == req.body.documentId) {
        doc.data.splice(index, 1);
      }
    });
    doc.save(function (err) {
      res.sendStatus(200);
    });
  });
});

router.post('/postDocument/:id', function (req, res) {
  contents.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return console.log(err);
    let obj = req.body.document;
    obj._document_id = mongoose.Types.ObjectId();
    obj._document_parentID = mongoose.Types.ObjectId(req.params.id);
    doc.data.push(obj);
    doc.save(function (err) {
      res.sendStatus(200);
    });
  });
});

router.get('/fetchDocument/:id', function (req, res) {
  contents.findOne({ "data._document_id": mongoose.Types.ObjectId(req.params.id) }, { 'data.$': 1 }, (err, doc) => {
    if (err) return console.log(err);
    res.json(doc);
  });
});

router.post('/updateDocument/:id', function (req, res) {
  contents.findOne({ _id: req.body.doc._document_parentID }, (err, doc) => {
    if (err) return console.log(err);
    doc.data.forEach((data, index) => {
      if (data._document_id == req.body.doc._document_id) {
        req.body.doc._document_id = mongoose.Types.ObjectId(req.body.doc._document_id);
        req.body.doc._document_parentID = mongoose.Types.ObjectId(req.body.doc._document_parentID);
        doc.data.splice(index, 1, req.body.doc);
      }
    });
    doc.save((err, newData) => {
      res.sendStatus(200);
    });
  });
});

router.get('/fetchCollectionStats/:id', function (req, res) {
  var query = contents.findOne({ _id: req.params.id });
  query.select('title forms');
  query.exec(function (err, doc) {
    if (err) return console.log(err);
    res.json(doc);
  });
});


router.post('/insertCollection', function (req, res) {
  let obj = req.body.collection;
  let collection = new contents(obj);
  collection.save().then(() => {
    res.sendStatus(200);
  });
});

router.post('/removeCollection/:id', function (req, res) {
  contents.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err) {
    if (err) return handleError(err);
    res.sendStatus(200);
  });
});

router.post('/updateCollection/:id', function (req, res) {
  contents.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, doc) => {
    if (err) return console.log(err);
    doc.forms = req.body.forms;
    doc.title = req.body.title;
    doc.save((err, newData) => {
      res.sendStatus(200);
    });
  });
});


export default router;