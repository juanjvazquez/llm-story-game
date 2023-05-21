const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const myEnv = dotenv.config({ path: '.env' });
dotenvExpand.expand(myEnv)

const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;

const sceneRouter = require('./middleware/scene');
const agentRouter = require('./middleware/agent');


app.use('/api/scene', sceneRouter);

app.use('/api/agent', agentRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});