export const objectToQueryParams = (obj: object): string => {
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
        }
    }
    return queryParams.toString();
}