const users = [];

// mongo or firebase on future as db 

// Join users for chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);
    return user;
}

// get the current active user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// if user leaves
function userleave(id) {
    let user = users.findIndex(user => user.id === id);
    if (user != -1) {
        return users.splice(user, 1)[0];
    }
}

// get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin, getCurrentUser, userleave, getRoomUsers
}