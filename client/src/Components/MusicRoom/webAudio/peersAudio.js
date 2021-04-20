export default function PeersAudio(context) {

    this.context = context;
    this.partnerGains = {};

    const peersOutputVolume = context.createGain();
    this.peersOutputVolume = peersOutputVolume;
    peersOutputVolume.connect(context.destination);
}

PeersAudio.prototype.addPartner = function(partnerName, partnerStream) {
    console.log('partnerName ', partnerName);
    let partnerAudio = this.context.createMediaStreamSource(partnerStream);
    this.partnerGains[partnerName] = this.context.createGain();
    console.log('partner gains on add ', this.partnerGains);
    partnerAudio.connect(this.partnerGains[partnerName]);
    this.partnerGains[partnerName].connect(this.peersOutputVolume);
}

PeersAudio.prototype.removePartner = function(partnerName) {
   // delete this.partnerGains[partnerName];
    console.log("partner gains post delete ", this.partnerGains);
}

PeersAudio.prototype.updatePartnerGain = function(partnerName, gainVal) {
    console.log('this.partnerGains', this.partnerGains);
    if(this.partnerGains[partnerName]){
        console.log('update partner gain ', partnerName, gainVal);
        this.partnerGains[partnerName].gain.value = gainVal;
    }
}

