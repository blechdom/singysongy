
export default function Eq(context) {

    this.context = context;
    let input = context.createGain();
    let output = context.createGain();
    this.input = input;
    this.output = output;

    const eqGain = context.createGain();
    this.eq_gain = eqGain;
    this.eq_gain.gain.value = 0.0;
    const dryEqGain = context.createGain();
    this.dry_eq_gain = dryEqGain;
    this.dry_eq_gain.gain.value = 0.0;
    let convolver = context.createConvolver();
    this.convolver_node = convolver;

    input.connect(dryEqGain);
    input.connect(convolver);
    dryEqGain.connect(output);
    eqGain.connect(output);
}

Eq.prototype.setEqDryGain = function(gainValue) {
    this.dry_eq_gain.gain.value = gainValue;
}

Eq.prototype.setEqWetGain = function(gainValue) {
    this.eq_gain.gain.value = gainValue;
}

Eq.prototype.setEqPreset = async function(eqPreset) {
    const revPreset = './ir/' + eqPreset + '.wav';
    const response = await fetch(revPreset);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    this.convolver_node.buffer = audioBuffer; // impulseResponse( 2.5, 2.0 );  // eqBuffer;
    this.convolver_node.connect(this.eq_gain); 
}

