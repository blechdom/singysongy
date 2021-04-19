
export default function Reverb(context) {

    this.context = context;
    let input = context.createGain();
    let output = context.createGain();
    this.input = input;
    this.output = output;

    const reverbGain = context.createGain();
    this.reverb_gain = reverbGain;
    this.reverb_gain.gain.value = 0.0;
    const dryReverbGain = context.createGain();
    this.dry_reverb_gain = dryReverbGain;
    this.dry_reverb_gain.gain.value = 0.0;
    let convolver = context.createConvolver();
    this.convolver_node = convolver;

    input.connect(dryReverbGain);
    input.connect(convolver);
    dryReverbGain.connect(output);
    reverbGain.connect(output);
}

Reverb.prototype.setReverbDryGain = function(gainValue) {
    this.dry_reverb_gain.gain.value = gainValue;
}

Reverb.prototype.setReverbWetGain = function(gainValue) {
    this.reverb_gain.gain.value = gainValue;
}

Reverb.prototype.setReverbPreset = async function(reverbPreset) {
    const revPreset = './ir/' + reverbPreset + '.wav';
    const response = await fetch(revPreset);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    this.convolver_node.buffer = audioBuffer; // impulseResponse( 2.5, 2.0 );  // reverbBuffer;
    this.convolver_node.connect(this.reverb_gain); 
}

