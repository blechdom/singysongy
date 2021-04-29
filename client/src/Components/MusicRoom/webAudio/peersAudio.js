export default function PeersAudio(context) {

    this.context = context;
    this.partnerGains = {};
    this.partnerGainValues = {};

    const peersOutputVolume = context.createGain();
    this.peersOutputVolume = peersOutputVolume;
    peersOutputVolume.connect(context.destination);
}

PeersAudio.prototype.addPartner = function(partnerName, partnerStream) {
    let partnerAudio = this.context.createMediaStreamSource(partnerStream);
    this.partnerGains[partnerName] = this.context.createGain();
    this.partnerGainValues[partnerName] = {
        gain: 1, 
        mute: 1
    }
    console.log('partner gains on add ', this.partnerGains);
    partnerAudio.connect(this.partnerGains[partnerName]);
    this.partnerGains[partnerName].connect(this.peersOutputVolume);
}

PeersAudio.prototype.removePartner = function(partnerName) {
    delete this.partnerGains[partnerName];
    delete this.partnerGainValues[partnerName];
}

PeersAudio.prototype.updatePartnerGain = function(partnerName, gainVal) {
    if(this.partnerGainValues[partnerName]){
        this.partnerGainValues[partnerName].gain = gainVal;
        this.updatePartner(partnerName);
    }
}

PeersAudio.prototype.updatePartnerMute = function(partnerName, muteVal) {
    if(this.partnerGainValues[partnerName]){
        this.partnerGainValues[partnerName].mute = muteVal;
        this.updatePartner(partnerName);
    }
}

PeersAudio.prototype.updatePartner = function(partnerName) {
    if(this.partnerGains[partnerName] && this.partnerGainValues[partnerName]){
        this.partnerGains[partnerName].gain.value = 
            this.partnerGainValues[partnerName].gain * this.partnerGainValues[partnerName].mute;
    }
}