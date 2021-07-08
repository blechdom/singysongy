
export default function Router(context) {

    this.context = context;
    /*let input = context.createGain();
    let output = context.createGain();
    this.input = input;
    this.output = output;

    const compressorGain = context.createGain();
    this.compressor_gain = compressorGain;
    this.compressor_gain.gain.value = 0.5;

    let compressor = context.createDynamicsCompressor();
    this.compressor_node = compressor;

    input.connect(compressor);
    compressor.connect(compressorGain);
    compressorGain.connect(output);*/
}

Router.prototype.setCompressorGain = function(gainValue) {
    this.compressor_gain.gain.value = gainValue;
}

Router.prototype.setCompressorThreshold = async function(compressorThreshold) {
    this.compressor_node.threshold.value = compressorThreshold;
}

Router.prototype.setCompressorKnee = async function(compressorKnee) {
    this.compressor_node.knee.value = compressorKnee;
}

Router.prototype.setCompressorRatio = async function(compressorRatio) {
    this.compressor_node.ratio.value = compressorRatio;
}

Router.prototype.setCompressorAttack = async function(compressorAttack) {
    this.compressor_node.attack.value = compressorAttack;
}

Router.prototype.setCompressorRelease = async function(compressorRelease) {
    this.compressor_node.release.value = compressorRelease;
}

