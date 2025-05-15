
import { toast } from "react-toastify";
import axios from "axios";


const axiosApiInstance = axios.create({

    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});


function createSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')  // Replace spaces and non-word characters with hyphens
        .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
}


const notify = (msg, flag) => toast(msg, { type: flag ? "success" : "error" });

function getCookies(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}


export { createSlug, notify, axiosApiInstance,getCookies }