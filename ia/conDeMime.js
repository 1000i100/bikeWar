        var cloneWorker;
        if(typeof exports === 'undefined') exports = this;
        exports.onmessage = function (event) {
            if (event.data != null) {
                var monId = event.data.playerId;
                if (!cloneWorker) {
                    cloneWorker = new Worker(otherPlayerScript(monId, event.data.data.players));
                    cloneWorker.onmessage = sendCloneMessage;
                }
                cloneWorker.postMessage(event.data);
            } else postMessage("data null");
        };
        function otherPlayerScript(monId, players){
            if(players[0].id == monId) players.shift();
            var otherPlayer = players[0];
            var exploded = otherPlayer.script.split('/');
            if (exploded[0]=='ia') exploded.shift();
            return exploded.join('/');
        }
        function sendCloneMessage(event){
            if (event.data != null) exports.postMessage(event.data);
        }