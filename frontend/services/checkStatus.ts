import axios from "axios";

const API_BASE_URL = process.env.PUBLIC_API_URL;

export async function checkStatus() {
    try {
        const response = await axios.get(`${API_BASE_URL}/status`)
        return response.data;
    } catch (error) {
        throw error;
    }
}