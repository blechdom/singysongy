export const mixAudioTracks = function (context, stream1, stream2) {
    var stream1Sound = context.createMediaStreamSource(stream1);
    var stream2Sound = context.createMediaStreamSource(stream2);
    var destination = context.createMediaStreamDestination();
    var newStream = destination.stream;
    stream1Sound.connect(destination);
    stream2Sound.connect(destination);
    return newStream.getAudioTracks()[0];
};