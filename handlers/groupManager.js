const { IsSearching } = require("./matchManager");

const groups = new Map();
const userToGroup = new Map();
const pendingGroup = new Set();


let groupCounter = 1;
const GROUP_SIZE = 2;


const createGroup = (users) =>{
    const groupId = groupCounter++;
    groups.set(groupId,new Set(users));
    users.forEach((user,index) => {
        userToGroup.set(user,groupId)
        //userLabel.set(user,`Person ${index + 1}`)
    });
    return groupId;
}

const addUserToPendingGroup = (userId) => {
    if (userToGroup.has(userId)) return null;

    pendingGroup.add(userId);

    if (pendingGroup.size >= GROUP_SIZE) {
        const users = Array.from(pendingGroup).slice(0, GROUP_SIZE);
        users.forEach(u => pendingGroup.delete(u));
        return createGroup(users);
    }

    return null;
};

const stopGroupSearch = (userId) =>{
    pendingGroup.delete(userId);
}

const isSearching = (userId) =>{
    return pendingGroup.has(userId);
}

const getGroupOfUser = (userId) =>{
    const groupId = userToGroup.get(userId);

    if(!groupId) return null;
    const members = [...groups.get(groupId)];

    const labels = {};

    let index = 1;
    members.forEach(member=>{
        labels[member]=`Person ${index++}`;
    })

    return{groupId,members,labels};
}

const leaveGroup = (userId) =>{
    const groupId = userToGroup.get(userId);

    if(!groupId) return;

    const group = groups.get(groupId);

    group.delete(userId);
    userToGroup.delete(userId);

    if(group.size==0){
        groups.delete(groupId);
    }
}

const broadcastMessage = (senderId, messageFn) => {
    const groupData = getGroupOfUser(senderId);
    if (!groupData) return;

    groupData.members.forEach(userId => {
        if (userId !== senderId) {
            messageFn(userId);
        }
    });
}

module.exports = {
    createGroup,
    addUserToPendingGroup,
    getGroupOfUser,
    leaveGroup,
    broadcastMessage,
    stopGroupSearch,
    isSearching
};