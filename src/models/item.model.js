
const items = {};

export const createItems = (uuid) => {
    items[uuid] = [];
}

export const getItems = (uuid) => {
    return items[uuid];
}

export const setItems = (uuid, id, itemId) => {
    return items[uuid].push({ id, itemId });
}

export const clearItems = (uuid) => {
    items[uuid] = [];
}
