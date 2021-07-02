
export default function Equalizer(context) {

    this.context = context;
    let input = context.createGain();
    let output = context.createGain();
    this.input = input;
    this.output = output;

    const eqGain = context.createGain();
    this.eqGain = eqGain;

    this.lowEQFilter = setupFilter(context, 'lowshelf', 60, 0, 1);
    this.lowMidEQFilter = setupFilter(context, 'peaking', 250, 0, 1);
    this.midEQFilter = setupFilter(context, 'peaking', 1000, 0, 1);
    this.highMidEQFilter = setupFilter(context, 'peaking', 4000, 0, 1);
    this.highEQFilter = setupFilter(context, 'highshelf', 16000, 0, 1);

    input.connect(this.highEQFilter);
    this.highEQFilter.connect(this.highMidEQFilter);
    this.highMidEQFilter.connect(this.midEQFilter);
    this.midEQFilter.connect(this.lowMidEQFilter);
    this.lowMidEQFilter.connect(this.lowEQFilter);
    this.lowEQFilter.connect(this.eqGain);
    this.eqGain.connect(output);

}

Equalizer.prototype.setEqGain = function(gainValue) {
    this.eqGain.gain.value = gainValue;
}

Equalizer.prototype.changeHighEQ = async function(eqVal) {
	this.highEQFilter.gain.value = eqVal;
}

Equalizer.prototype.changeLowMidEQ = async function(eqVal) {
	this.lowMidEQFilter.gain.value = eqVal;
}

Equalizer.prototype.changeMidEQ = async function(eqVal) {
	this.midEQFilter.gain.value = eqVal;
}

Equalizer.prototype.changeHighMidEQ = async function(eqVal) {
	this.highMidEQFilter.gain.value = eqVal;
}

Equalizer.prototype.changeLowEQ = async function(eqVal) {
	this.lowEQFilter.gain.value = eqVal;
}

function setupFilter (context, type, frequency, gain, q) {
    var filter = context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    if (gain) {
        filter.gain.value = gain;
    }
    if (q) {
        filter.Q.value = q;
    }
    return filter;
}