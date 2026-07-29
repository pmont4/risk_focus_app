import axios from "axios";

const BASE_URL = "/api/riskfocus/";

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

const BASE_URL_AUTH = "/api/riskfocusauth/"

export const logInAPI = axios.create({
    baseURL: BASE_URL_AUTH + "login/"
})
