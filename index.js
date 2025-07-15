require('dotenv').config();
const express = require('express');
const cors = require('cors');
const docker = require('./docker');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

app.post('/create', authenticate, async (req, res) => {
  const result = await docker.createContainer(req.body);
  res.json(result);
});

app.post('/stop', authenticate, async (req, res) => {
  const result = await docker.stopContainer(req.body.name);
  res.json(result);
});

app.post('/delete', authenticate, async (req, res) => {
  const result = await docker.deleteContainer(req.body.name);
  res.json(result);
});

app.listen(process.env.PORT || 3000, () =>
  console.log('MC Agent running on port', process.env.PORT)
);
