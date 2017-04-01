const S = require('./string')
module.exports = function TimeStamps(dispatch){
    const blocked = new Set()

    dispatch.hook('S_USER_BLOCK_LIST', 1, (event) => {
        for(const member of event.blockList){
            block(member)
        }
    })
    dispatch.hook('S_ADD_BLOCKED_USER', 1, block)
    dispatch.hook('C_REMOVE_BLOCKED_USER', 1, (event) => {
        blocked.delete(event.name)
    })
    dispatch.hook('S_LOGIN', 1, (event) => {
        blocked.clear()
    })
    function block(user){
        blocked.add(user.name)
    }
    function processChatEvent(event){
        if(event.channel === 26) return
        if(blocked.has(event.authorName)) return false
        var time = new Date()
        var timeStr = ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2)
        event.authorName = `</a>${timeStr}][<a href='asfunction:chatNameAction,${event.authorName}@0@0'>${event.authorName}</a>`
        return true
    }
    dispatch.hook('S_CHAT', 1, processChatEvent)
    dispatch.hook('S_PRIVATE_CHAT', 1, processChatEvent)
}
