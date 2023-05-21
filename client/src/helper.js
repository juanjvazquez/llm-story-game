const fs = require('fs');

export function ChoiceList(choices) {
    const choiceItem = choices.map((choice, index) => {
        return (
            <li key={index}>
                <button onClick={() => this.handleChoice(choice)} className="choicebtn">{choice}</button>
            </li>
        )
        }
    )
    return (
        <ul className="choiceList">
            {choiceItem}
        </ul>
    )
}

export function getImageUrl(current_url) {
    return (
      '/images/' + current_url + '.jpg'
    );
  }
  
export function buildStoryArc(current_url) {
    // url is built like 0_1_4_1_0.json etc, with the story under the 'scene' key. the first file is 0.json, next is 0_1.json, then 0_1_4.json etc
    let url = current_url.split('_');
    let storyArc = '';
    prev_url = '';
    for (let i = 0; i < url.length; i++) {
        new_url = prev_url + '_' + url[i];
        storyArc += getStory(new_url + '.json');
        prev_url = new_url;
    }
    return storyArc;
}

export function getCurrentStory(current_url) {
    let story = getStory(current_url + '.json');
    return story;
}

function getStory(url) {
    let story = '';
    story_dir = '/story_parts/';
    fs.readFile(story_dir + url, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        let story_json = JSON.parse(data);
        story = story_json['scene'];
    }
    );
    return story;
}