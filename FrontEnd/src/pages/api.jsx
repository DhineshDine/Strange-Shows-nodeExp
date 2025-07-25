import axios from 'axios';

const API_BASE_URL = 'https://localhost:7207/api/showtimes'; // ✅ Adjust your backend URL/port

export const getShowtimes = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const addShowtime = async (showtime) => {
    const response = await axios.post(API_BASE_URL, showtime);
    return response.data;
};

export const updateShowtime = async (id, showtime) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, showtime);
    return response.data;
};

export const deleteShowtime = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};
