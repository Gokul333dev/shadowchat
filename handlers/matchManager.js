// ** function to build - AddUserToQueue , RemoveUserFromQueue , FindMatch , EndChat , GetPartner , IsInChat , IsSearching

const waitingQueue = []
const activeChat = new Map();

const AddUserToQueue = (userId)=>{
    if(!waitingQueue.includes(userId)){
        waitingQueue.push(userId);
    }
}

const RemoveUserFromQueue = (userId) => {
    const index = waitingQueue.indexOf(userId);

    if(index!=-1){
        waitingQueue.splice(index,1);
    }
}

const FindMatch = (userId) =>{
    if(waitingQueue.length==0 || (waitingQueue.length==1 && waitingQueue[0]===userId)){
        return null;
    }

    const partnerId = waitingQueue.find((id)=>id!==userId);

    if(!partnerId){
        return null;
    }

    RemoveUserFromQueue(userId);
    RemoveUserFromQueue(partnerId);

    activeChat.set(userId,partnerId); 
    activeChat.set(partnerId,userId); 

    return partnerId;
}


const EndChat = (userId) =>{
    const partnerId = activeChat.get(userId);

    if(partnerId){
        activeChat.delete(userId);
        activeChat.delete(partnerId);
    }

    return partnerId;
}

const GetPartner = (userId)=>{
    const partnerId = activeChat.get(userId);

    if(partnerId){
        return partnerId;
    }
}

const IsInChat = (userId) =>{
    return activeChat.has(userId);
}

const IsSearching = (userId) =>{
    return waitingQueue.includes(userId);
}

const stopSearching = (userId) =>{
    const index = waitingQueue.indexOf(userId);
    if(index!==-1){
        waitingQueue.splice(index,1);
    }
}

module.exports = {
    AddUserToQueue,
    RemoveUserFromQueue,
    FindMatch,
    EndChat,
    GetPartner,
    IsInChat,
    IsSearching,
    stopSearching,
    waitingQueue
}