import axios from 'axios';

const serverUrl = import.meta.env.VITE_REACT_APP_API_URL;

const handleFetchNecessarySceneData = async ({scene_ids}) => {
    try {
        // const response = await axios.post(`${serverUrl}/api/scene/necessary`, {
        const response = await axios.post(`http://localhost:8080/api/scene/necessary`, {
            scene_ids
        });
        return response.data
    } catch(error) {
        throw { message: error.response.data, status: error.response.status };
    }
}

const handleFetchNecessarySceneImage = async ({scene_ids}) => {
    try {
        const response = await axios.post(`http://localhost:8080/api/scene/img`, {
            scene_ids
        }); // you need to set the response type to 'blob' for images

        // Create a URL for the image blob
        const imageUrl = URL.createObjectURL(response);

        // or return it to be used elsewhere
        return imageUrl;

    } catch(error) {
        throw { message: error, status: error };
    }
}


export { handleFetchNecessarySceneData, handleFetchNecessarySceneImage};