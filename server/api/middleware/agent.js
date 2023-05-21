const express = require('express');
const fs = require('fs').promises;
const path = require('path'); 

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const router = express.Router();

router.post('/reaction', async (req, res) => {
    console.log('Received request at /api/agent/reaction endpoint');
    console.log('Body:', req.body);
    try{
        const { scene_ids } = req.body;

        let arc = '';
        let current_scene = '';
        let action_choice = '';
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
                temp = JSON.parse(file)
                if(i<(scene_ids.length-2)){
                    console.log(temp['scene'])
                    arc += temp['scene'] + '. ';
                }
                if(i<(scene_ids.length-2)){
                    arc += temp['choices'][scene_ids[i+1]] + '. ';
                }
                if(i==(scene_ids.length-2)){
                    current_scene += temp['scene'] + '. ';
                }
                if(i==(scene_ids.length-2)){
                    action_choice += temp['choices'][scene_ids[i+1]];
                }
            } catch(err) {
                console.error(`Error reading file ${filename}.json:`, err);
                continue;
            }
        }

        const story_so_far = arc;

        const prompt_reaction = `Your name is Beemo, you are a Gamer AI, the squire of the player! You interact with the player in their adventure in this interactive multipe choice based game.
        
        You know the STORY, just like the player. 

        You know the story ACTION the player just made.

        React in an extravagant way to the ACTION in the CURRRENT_SCENE the player just made if you were a very engaged narrator that shares the enthusiasm and emotions of the player.

        STORY = ${story_so_far}

        CURRRENT_SCENE = ${current_scene}

        ACTION = ${action_choice}

        Example:
        example STORY = "Our journey began in the tranquil town of Elden, nestled against the Misty Mountains. Explore the hidden forest path instead of the main road. Deep within the forest, we discovered an ancient and mysterious puzzle etched into a stone monument. The player opted to solve the puzzle rather than to ignore it."
        example CURRENT_SCENE = "Solving the puzzle revealed a hidden treasure chest with a majestic golden glow."
        example ACTION = "The player chose to open the treasure chest immediately, revealing an ornate, gleaming sword of legend."
        
        example REACTION: "Oh, by the starry vault of the heavens! The choice made... it is beyond words! The player, our intrepid and daring protagonist, has decided to open the chest on the spot! Oh, this is a glorious moment, friends! And what lies within? A sword, shimmering with the light of countless ages past! Can you feel it? The air thrums with the sheer epic-ness of it all! This is a story we will remember for ages to come. Let's raise a toast, comrades, to the player, who dares to challenge the mysteries of Elden and emerges victorious! Onward to further adventures, filled with more of such thrilling choices and extravagant discoveries!"
        
        Your REACTION:`;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt_reaction,
            max_tokens: 3000,
            temperature: 0.9,
        });

        res_digested = response["data"]["choices"][0]["text"]
        console.log(res_digested)

        // res.send({ message: 'Stuff works', story_so_far: story_so_far, current_scene: current_scene, action_choice: action_choice });
        res.send({ message: 'Success in fetching GPT3 reaction', story_so_far: story_so_far, current_scene: current_scene, action_choice: action_choice, response : res_digested});
    } catch (error) {
        console.error('Something went wrong with the agent:', error);
        res.status(500).send("Something went wrong with the agent");
    }
});

module.exports = router;