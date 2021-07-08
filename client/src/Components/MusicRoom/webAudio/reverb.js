
export default function Reverb(context) {

    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();

    this.reverbGain = context.createGain();
    this.reverbGain.gain.value = 0.0;
    this.dryReverbGain = context.createGain();
    this.dryReverbGain.gain.value = 0.0;
    this.convolverNode = context.createConvolver();

    this.input.connect(this.dryReverbGain);
    this.input.connect(this.convolverNode);
    this.dryReverbGain.connect(this.output);
    this.reverbGain.connect(this.output);
}

Reverb.prototype.setReverbDryGain = function(gainValue) {
    this.dryReverbGain.gain.value = gainValue;
}

Reverb.prototype.setReverbWetGain = function(gainValue) {
    this.reverbGain.gain.value = gainValue;
}

Reverb.prototype.setReverbPreset = async function(reverbPreset) {
    const revPreset = 'https://www.aivxdemos.com/musicRoom/ir/' + reverbPreset + '.wav';
    const response = await fetch(revPreset);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    this.convolverNode.buffer = audioBuffer; // impulseResponse( 2.5, 2.0 );  // reverbBuffer;
    this.convolverNode.connect(this.reverbGain); 
}

