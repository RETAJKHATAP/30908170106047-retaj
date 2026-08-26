import axios from 'axios';

const reviewBaseURL = import.meta.env.VITE_REVIEW_SERVICE_URL || 'http://localhost:4001';

const reviewClient = axios.create({ baseURL: reviewBaseURL });

export default reviewClient;
