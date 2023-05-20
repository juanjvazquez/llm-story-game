import openai
import json
import re
import os
import sys

class BibleGenerator:
    def __init__(self, filename, directory):
        self.filename = filename
        self.directory = directory

    def generate(self, story_synopsis):
        print("Generating Bible")
        prompt_create_bible = f"""
            Using the elements of a professional story bible, generate a comprehensive bible for the Story Oveview provided.

            Generate a comprehensive bible for the following Story Overview: {story_synopsis}

            You can create new context for each of the following components, extrapolate from the Story Overview to create all the bible components below:
            
            - Character Descriptions: Craft detailed profiles for the main character, their mentor, their closest allies, and their primary antagonist. This should include appearance, personality, backstory, motivations, and relationships to other characters.
            
            - Setting: Describe the fantastical world this story takes place in, including physical environment, history, important locations, and any special rules of this universe.
            
            - Story Arcs: Detail the main character's narrative arc and the overall story arc that spans the entire plot.
            
            - Art/Design Style: Describe the visual aesthetic of the story world, including the character designs, environments, and colors.
            
            - Tone and Style: Convey the overall tone and style of the story. Is it dark and serious? Light-hearted and humorous? Romantic and dramatic?
            
            - Interactive Elements: Illustrate how the story will incorporate choice-based interactions. How will these choices impact the plot and characters? Please provide some examples.

            Output:
        """

        res_bible_init = openai.Completion.create(
            engine='text-davinci-003',
            prompt=prompt_create_bible,
            max_tokens=2000,
            top_p=1,
            temperature=0.9,
            frequency_penalty=0,
            presence_penalty=0
        )

        res_bible = res_bible_init["choices"][0]["text"].strip()
        print("Bible Generated")
        with open(os.path.join(self.directory, self.filename), 'w') as f:
            f.write(res_bible)
        print("Bible Saved")


class SinglePartGenerator:
    def __init__(self, filename, directory, bible):
        self.filename = filename
        self.directory = directory # Keep story files and prompt files separate
        
        self.bible = bible
        
    def generate(self, story_so_far, user_choice):
        prompt_create_scene = f"""
            You are given the Story Bible and Story Arc of an interactive, choice-based story.
            
            Create an engaging scene that may involve our main character, their allies, the antagonist, the setting and environment or the introduction of new characters. The scene should be in a critical location detailed in the setting of our bible, or a new one. Make sure the scene reflects the tone and style of the story and contributes to the ongoing Story Arc. Make sure that the scene conditions the characters to perform an action as a response.

            Create an Image Prompt for the DALLE-2 image model that depicts in detail an image that describes the current scene, this should be a high level prompt that will capture the scene perfectly, be creative and concise. This Image Prompt should include "Blizzard Concept Artists Styled".

            Create two different action choices that the story could take next based on the Scene. These action choices could be based on:

            - Character Dialogue: The main character, or another character, says something that drastically changes the situation. Example: "The character reveals a secret that alters the dynamics of the group."

            - Environmental Factors: Something changes in the environment that forces the characters to respond. Example: "A sudden volcano eruption."

            - Character Action: The character takes a physical action that has consequences. Example: "The character decides to run into the dangerous forest."

            - New Information: The characters receive new information that changes their understanding of their situation. Example: "They find an old map revealing a shortcut."

            Remember to make these choices impactful, engaging, and meaningful to the progression of the story.

            Story Bible: {self.bible}

            Give your response in the following format:
            Output type: {{"image_prompt": "IMAGE_PROMPT", "scene": "SCENE", "choices":["CHOICE1", "CHOICE2"]}}
            Example Output: {{"image_prompt":"Generate a Blizzard Concept Artists Styled fantasy landscape featuring a radiant apple tree with rune-carved bark. The tree stands amidst dew-dusted hills under a transitional dawn-night sky. Include iridescent, fairy-like creatures, charming woodland animals, and subtle magical particles illuminating this mythical realm, blending AAA game realism with magical enchantment","scene":"An apple has just fallen from the tree. You noticed this but Alice did not", "choices":["You tell Alice the apple fell from the tree", "You run towards the apple and eat it without sharing"]}}

            {"Story so far: " + story_so_far if story_so_far else ""}

            {"The user has been chosen the option: " + user_choice if user_choice else ""}

            Output:
        """

        res_scene_init = openai.Completion.create(
            engine='text-davinci-003',
            prompt=prompt_create_scene,
            max_tokens=2000,
            top_p=1,
            temperature=0.9,
            frequency_penalty=0,
            presence_penalty=0
        )

        res_scene = res_scene_init["choices"][0]["text"]
        with open(os.path.join("logs", self.filename), 'w') as f:
            f.write(res_scene)
        scene = json.loads(res_scene)
        self.save_story(scene)
        return scene

    def save_story(self, json_obj):
        #Save json to file
        with open(os.path.join(self.directory, self.filename), 'w') as f:
            f.write(json.dumps(json_obj))

        
    def get_story_so_far(self):
        story_so_far = ""
        filename = self.filename
        for i in range(len(filename)):
            if filename[i] == "_":
                filename = filename[:i] + ".json"
                with open(os.path.join(self.directory, filename)) as f:
                    story_so_far += f.read()

        return story_so_far


class StoryGenerator:
    def __init__(self, depth, n_choices, filename, directory, settings_dir):
        self.depth = depth
        self.n_choices = n_choices
        self.filename = filename
        self.directory = directory
        self.settings_dir = settings_dir

    def start_story(self, bible_name, story_arc_name):
        bible = ""
        with open(os.path.join(self.settings_dir, bible_name)) as f:
            bible = f.read()

        print("Starting story")

        story_generator = SinglePartGenerator("0.json", self.directory, bible)
        story = story_generator.generate("", "")
        choices = story["choices"]
        print("Story started")
        for i in range(self.n_choices):
            self.recurse_gen(1, story["scene"], choices[i], bible, "0", i)

    def recurse_gen(self, n, story_so_far, user_choice, bible, prev_name, choice_number):
        if n == self.depth:
            print("Recursion depth reached")
            return story_so_far
        print("Generating for " + prev_name + "_" + str(choice_number) + "")
        story_generator = SinglePartGenerator(prev_name + "_" + str(choice_number) + ".json", self.directory, bible)
        story = story_generator.generate(story_so_far, user_choice)
        print("Finished generating for " + prev_name + "_" + str(choice_number) + "")
        scene = story["scene"]
        choices = story["choices"]
        for i in range(self.n_choices):
            self.recurse_gen(n + 1, story_so_far + scene, choices[i], bible, prev_name + "_" + str(choice_number), i)


if __name__ == "__main__":
    openai.organization = ""
    openai.api_key = ""

    # bible_generator = BibleGenerator("bible.txt", "settings")
    # synopsis = "In the fantastical world of Aistris, our story follows the adventures of Elenor, a young witch, and her companion, Asher, an ambitious nobleman. Their mission is to discover the truth behind the mysterious murder of the kingdom's beloved ruler, the King. Following a lead, Elenor and Asher travel to the Kingdom of Millstone. There, they meet a cast of colorful characters, including a magical fox; a wise, old wizard; and a mysterious witch. As the story unfolds, our heroes uncover a web of deception and lies that leads them to an unexpected and shocking revelation. Along the way, they will have to make tough choices that could mean the difference between life and death. Will Elenor and Asher find the truth behind the King's murder, or will they be too late to save the kingdom?"
    # bible_generator.generate(synopsis)

    story_generator = StoryGenerator(3, 2, "story.txt", "story_parts", "settings")
    story_generator.start_story("bible.txt", "story_arc.txt")