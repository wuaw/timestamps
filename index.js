const S = require('./string');
module.exports = function TimeStamps(dispatch){
    let blockedUsers = []
    dispatch.hook('S_USER_BLOCK_LIST', 1, (event) => {
        event.blockList.forEach(addBlockedUser);
    })
    dispatch.hook('S_ADD_BLOCKED_USER', 1, addBlockedUser)
    dispatch.hook('C_REMOVE_BLOCKED_USER', 1, (event) => {
        let index = blockedUsers.indexOf(event.name)
        if(index !== -1)
            blockedUsers.splice(index, 1);
    })
    dispatch.hook('S_CHAT', 1, (event) => {
        let authorName = S.stripTags(event.authorName);
        if(authorName.includes("]")) authorName = authorName.substring(7, authorName.length);
        if(blockedUsers.includes(authorName)) return false;
    });
    dispatch.hook('S_LOGIN', 1, (event) => {
        blockedUsers = [];
    })
    function addBlockedUser(user){
        if(!blockedUsers.includes(user.name))
            blockedUsers.push(user.name);
    }
    function processEvent(event){
        if(event.channel === 26) return
        var time = new Date();
        var timeStr = ("0" + time.getHours()).slice(-2)   + ":" + ("0" + time.getMinutes()).slice(-2);
        event.authorName = `</a>${timeStr}][<a href='asfunction:chatNameAction,${event.authorName}@0@0'>${event.authorName}</a>`;
        return true;
    }
    dispatch.hook('S_CHAT', 1, processEvent);
    dispatch.hook('S_PRIVATE_CHAT', 1, processEvent);
}
