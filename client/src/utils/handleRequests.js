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

export { handleFetchNecessarySceneData };