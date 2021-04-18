
export default function Compressor(context) {

    this.context = context;
    let input = context.createGain();
    let output = context.createGain();
    this.input = input;
    this.output = output;

    const compressorGain = context.createGain();
    this.compressor_gain = compressorGain;
    this.compressor_gain.gain.value = 0.5;
    const dryCompressorGain = context.createGain();
    this.dry_compressor_gain = dryCompressorGain;
    this.dry_compressor_gain.gain.value = 0.5;
    let compressor = context.createDynamicsCompressor();
    this.compressor_node = compressor;

    input.connect(dryCompressorGain);
    input.connect(compressor);
    dryCompressorGain.connect(output);
    compressorGain.connect(output);
}

Compressor.prototype.setCompressorDryGain = function(gainValue) {
    this.dry_compressor_gain.gain.value = gainValue;
}

Compressor.prototype.setCompressorWetGain = function(gainValue) {
    this.compressor_gain.gain.value = gainValue;
}

Compressor.prototype.setCompressorThreshold = async function(compressorThreshold) {
    this.compressor_node.threshold.value = compressorThreshold;
}

Compressor.prototype.setCompressorKnee = async function(compressorKnee) {
    this.compressor_node.knee.value = compressorKnee;
}

Compressor.prototype.setCompressorRatio = async function(compressorRatio) {
    this.compressor_node.ratio.value = compressorRatio;
}

Compressor.prototype.setCompressorAttack = async function(compressorAttack) {
    this.compressor_node.attack.value = compressorAttack;
}

Compressor.prototype.setCompressorRelease = async function(compressorRelease) {
    this.compressor_node.release.value = compressorRelease;
}

