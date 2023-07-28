export

function updateOptions(options: RequestInit) {
    const update: RequestInit = {...options};
    if (localStorage.getItem("uuid")) {
        update.headers = {
            ...update.headers,
            'Authorization': `${localStorage.getItem("uuid")}`
        }
    }

    if(typeof options.body == "object"){
        update.headers = {
            ...update.headers,
            'Content-Type': "application/json"
        }
    }


    return update
}

/**
 * Wrapper call for fetch to add on Authorization and Content-Type headers
 * @param path - The relative URL for the API call
 * @param options - Additional HTTP options
 */
export default async function fetcher(path: string, options?: RequestInit) {
    return fetch(import.meta.env.VITE_BACKEND_URL + path, updateOptions(options ?? {})).then(res => res.json())
}