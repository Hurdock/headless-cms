import fs from 'fs';
import path from 'path';
import multer from 'multer';
import express from 'express';

let router = express.Router();
let upload = multer({ dest: '/tmp' });

router.get('/fetchFolder/:folder', function (req, res) {
  let responseFiles = [];
  var appDir = path.dirname(require.main.filename);
  let dir = appDir + '/public/uploads/' + req.params.folder;
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      responseFiles.push(file);
    });
    res.json(responseFiles.reverse());
  });
});

router.post('/deleteFile', function (req, res) {
  let file = req.body.file;
  var appDir = path.dirname(require.main.filename); 
  fs.unlinkSync(appDir + '/public/uploads/' + file);
  res.sendStatus(200);  
});

router.post('/uploadFile/:target', upload.single('file'), function (req, res) {
  let date = new Date();
  let y = date.getFullYear(), d = date.getDate(), m = date.getMonth(), mm = date.getMinutes(), h = date.getHours(), s = date.getSeconds();
  var appDir = path.dirname(require.main.filename);
  var file = `${appDir}/public/uploads/${req.params.target}/${y}_${m}_${d}_${h}_${mm}_${s}_${req.file.originalname}`;
  fs.rename(req.file.path, file, function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else { res.sendStatus(200); }
  });
});

export default router;