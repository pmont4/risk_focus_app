import axios from "axios";

const BASE_URL = "/riskfocus/";

export const reportyAPI_GetAll = axios.create({
    baseURL: BASE_URL + "report/"
});

export const typeHazardAPI = axios.create({
    baseURL: BASE_URL + "typehazard/"
})

export const plantAPI = axios.create({
    baseURL: BASE_URL + "plant/"
});

export const hazardsAPI = axios.create({
    baseURL: BASE_URL + "hazard/"
});
