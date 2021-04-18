module.exports = (io) => {
    console.log('init sockets');
    io.on('connect', (socket) => {
        console.log('a client is connected: ', socket.id);
        
        socket.on('subscribe', data => {
            console.log('subscribe ', JSON.stringify(data));

            socket.join( data.room );
            socket.join( data.socketId );

            console.log('socket.adapter ', socket.adapter.rooms);
            if ( socket.adapter.rooms.get(data.room).size > 1 ) {
                console.log("initReceive");
                socket.to( data.room ).emit('initReceive', data.socketId);
            }
        })

        socket.on('signal', data => {
            console.log('sending signal from ' + socket.id + ' to ', data.socket_id);
            socket.to( data.socket_id ).emit('signal', { socket_id: socket.id, signal: data.signal });
        })

        socket.on('initSend', init_socket_id => {
            console.log('INIT SEND from ' + socket.id + ' to ' + init_socket_id);
            socket.to( init_socket_id ).emit( 'initSend', socket.id );
        })

        socket.on('disconnect', () => {
            console.log('socket disconnected ' + socket.id);
            socket.broadcast.emit('removePeer', socket.id);
        })
    })
}