import { useState } from 'react'
import './App.css'
import { ChoiceList, getImageUrl, buildStoryArc, getCurrentStory } from './helper'


function App() {
  return (
    <main>
      <header><h1>GPT Mystery Game</h1></header>
      {/* <div id="text-bg"></div>
      <div id="text-cnt">
        <div id="story-cnt">
          <p className="story-arc">In the quiet and picturesque town of Willowbrook, nestled deep in the countryside, a sinister murder has cast a dark shadow over its idyllic charm. The victim is Amelia Hawthorne, a renowned archaeologist who had recently unearthed a long-lost artifact of immense historical significance. Amelia's body was found in her study, the room ransacked and the artifact missing, leaving a trail of unanswered questions and deep intrigue.</p>
          <p className="story-arc">Amelia was a respected figure in the academic community, known for her expertise in ancient civilizations and her relentless pursuit of archaeological treasures. Her groundbreaking discovery had garnered attention from collectors and scholars alike, raising suspicions that the artifact's value may have triggered a deadly chain of events.</p>
          <p className="story-arc">Amelia was a respected figure in the academic community, known for her expertise in ancient civilizations and her relentless pursuit of archaeological treasures. Her groundbreaking discovery had garnered attention from collectors and scholars alike, raising suspicions that the artifact's value may have triggered a deadly chain of events.</p>
        </div>
        <p id="current-scene">Choose the right path or die in eteranl fire for being stupid degenerate.</p>
        <div id="button-cnt">
          <button type="button" className="choice-btn">Choice One</button>
          <button type="button" className="choice-btn">Choice Two</button>
          <button type="button" className="choice-btn">Choice Three</button>
          <button type="button" className="choice-btn">Choice Four</button>
        </div>
      </div>
      <div id="image-cnt">
        <div id="image"></div>
        <div id="stage"><p>Stage 1</p></div>
      </div> */}

      <div className='container-outer'>
        
        <div className='container-story-choices'>
          <div className='container-story'>
            <div className='container-text'>
              <div className='story-arc'>
                <p className='story-arc'>{buildStoryArc(current_url)}</p>
              </div>
              <div className='story-current'>
                <p className='story-current'>{getCurrentStory(current_url)}</p>
              </div>
            </div>
            <div className='container-choices'>
              {ChoiceList(choices)}
            </div>
          </div>
        </div>

        <div className='container-image'>
          <div className='image'>
            <image src={getImageUrl(current_url)} alt='' className='image'></image>
          </div>
        </div>

      </div>

    </main>
  )
}

export default App
