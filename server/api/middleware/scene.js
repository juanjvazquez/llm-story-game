const express = require('express');
const fs = require('fs').promises;
const path = require('path'); 

const router = express.Router();

router.post('/all', async (req, res) => {
    console.log('Received request at /api/scene/all endpoint');
    console.log('Body:', req.body);
    try{
        const { scene_ids } = req.body;
        const scene_history = [];
        let filename = '';
        for(let i=0; i<scene_ids.length; i++){
            if(i == 0){
                filename = scene_ids[i].toString();
            } else {
                filename += '_' + scene_ids[i].toString();
            }
            const filePath = path.join( '../../','db', `${filename}.json`);
            console.log(filePath)
            try {
                const file = await fs.readFile(filePath, 'utf8');
                scene_history.push(JSON.parse(file));
            } catch(err) {
                console.error(`Error reading file ${filename}.json:`, err);
                continue;
            }
        }
        res.send({ message: 'All JSON history fetched successfully', scene_history: scene_history});
    } catch (error) {
        console.error('Something went wrong while fetching the story:', error);
        res.status(500).send("Something went wrong while fetching the story");
    }
});

router.post('/necessary', async (req,res) => {
    console.log('Received request at /api/scene/necessary endpoint');
    console.log('Body:', req.body);
    
    try {
        const { scene_ids } = req.body;
        const arc = [];
        const choices = [];
        let filename = '';
        for(let i=0; i<scene_ids.length; i++){
            if(i == 0){
                filename = scene_ids[i].toString();
            } else {
                filename += '_' + scene_ids[i].toString();
            }
            const filePath = path.join( 'story_parts', `${filename}.json`);
            console.log(filePath)
            try {
                const file = await fs.readFile(filePath, 'utf8');
                temp = JSON.parse(file)
                arc.push(temp['scene']);
                if(i<(scene_ids.length-1)){
                    arc.push(temp['choices'][scene_ids[i+1]]);
                }
                if(i==scene_ids.length-1){
                    choices.push(temp['choices'])
                }
            } catch(err) {
                console.error(`Error reading file ${filename}.json:`, err);
                continue;
            }
        }
        res.send({ message: 'Arc and current Choices fetched successfully', arc: arc, choices:choices });
    } catch {
        console.error('Something went wrong while fetching the Arc and Choices:', error);
        res.status(500).send('Something went wrong while fetching the Arc and Choices');
    }
})

router.post('/img', async (req,res) => {
    console.log('Received request at /api/scene/img endpoint');
    console.log('Body:', req.body);
    
    try {
        const { scene_ids } = req.body;
        const filename = scene_ids.join('_');  // Use join to concatenate the scene_ids with '_'

        const imagePath = path.join(__dirname, '..', '..', 'images', `${filename}.png`);
        console.log(`Sending image file: ${imagePath}`);
        res.sendFile(imagePath);
    } catch (error) {
        console.error('Something went wrong while fetching the Arc and Choices:', error);
        res.status(500).send('Something went wrong while fetching the Arc and Choices');
    }
})


module.exports = router;