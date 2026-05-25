import axios from "axios";

const BASE_URL = "/riskfocus/";

export const reportyAPI_GetAll = axios.create({
    baseURL: BASE_URL + "report/"
});
