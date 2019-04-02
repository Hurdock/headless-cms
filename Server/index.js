import contentRoutes from './routes/contents';
import filesRoutes from './routes/files';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

mongoose.connect('mongodb://localhost:27017/headless_cms', { useNewUrlParser: true });
let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/public', express.static('public'))
app.use('/public/uploaded', express.static('public'))
app.use('/contents', contentRoutes);
app.use('/files', filesRoutes);

app.listen(8081, () => {
  console.log('* Server is running on port 8081.')
});
