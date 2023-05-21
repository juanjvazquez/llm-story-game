import { useState, useRef} from 'react'
import './App.css'
import { useEffect } from 'react';
import { handleFetchNecessarySceneData, handleFetchNecessarySceneImage } from './utils/handleRequests';

function App() {
  const [sceneIds, setSceneIds] = useState([0]);
  const [arc, setArc] = useState([]);
  const [choices, setChoices] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  const depth = 5

  const handleArcUpdate = (arct) => {
    setArc(arct);
  };

  const handleChoicesUpdate = (choicest) => {
    setChoices(choicest[0]);
  };

  const handleFetchData = async () => {
    try {
      const response = await handleFetchNecessarySceneData({ scene_ids : sceneIds });
      console.log("Response data:", response.message);
      handleArcUpdate(response.arc);
      handleChoicesUpdate(response.choices);
    } catch (error) {
      console.error("Error status:", error.status);
      console.error("Error message:", error.message);
    }
  }

  const handleFetchImage = async () => {
    try {
      const imageUrl = await handleFetchNecessarySceneImage({ scene_ids : sceneIds });
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Error status:", error.status);
      console.error("Error message:", error.message);
    }
  }

  const handleChoiceClick = async (number) => {
    if(sceneIds.length<depth) {
      setSceneIds(prevSceneIds => [...prevSceneIds, number]);
      console.log(arc)
    } else {
      console.log("We have reached the endgame")
      // ADD "THE END SCREEN HERE THAT SAYS THE END AT THE TOP, ALL THE STORY AT THE BOTTM AND BELOW THE 8 IMAGES FROM YOUR STORY IN A STRIP THAT SAY "CHAPTER 1" ETC
    }
  }

  useEffect(() => {
    handleFetchData();
    handleFetchImage();
  }, [sceneIds]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [arc]);

  return (
    <div className="main-container">
            <div className="left-container">
                <div ref={scrollRef} className="top-container">
                <div className="lorem-text">
                  {arc.map((part, index) => (
                    typeof part === 'string' 
                      ? <p key={index} style={index === arc.length - 1 ? {color: 'green', marginTop:'1.25em'} : {}}>{part}</p> 
                      
                      : null
                  ))}
                </div>
                </div>
                <div className="bottom-container">
                        {choices.map((choice, index) => (
                            <button 
                                key={index} 
                                className='choice' 
                                onClick={() => handleChoiceClick(index)}>
                                {choice}
                            </button>
                        ))}
                </div>
            </div>
            {/* <div className="right-container">
              <p className="lorem-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <img className="container-image" src={imageUrl} alt="container" />
            </div> */}
            <div className="right-container">
              <img className="container-image" src={imageUrl} alt="scene" />
            </div>
      </div>
  )
}

export default App
