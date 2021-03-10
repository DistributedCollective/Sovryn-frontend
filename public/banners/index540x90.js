(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.gotoAndPlay = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.pattern_w_bg_958x700 = function() {
	this.initialize(img.pattern_w_bg_958x700);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,958,700);


(lib.SOVRYN_LOGO_V32x = function() {
	this.initialize(img.SOVRYN_LOGO_V32x);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1016,136);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.whitebg_round = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AtVDUQgxABAAgoIAAlZQAAgoAxAAIarAAQAxAAAAAoIAAFZQAAAogxgBg");
	this.shape.setTransform(60.75,21.25);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.whitebg_round, new cjs.Rectangle(-29.5,0,180.5,42.5), null);


(lib.STROKELEFT = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FFFFFF").ss(1,1,1).p("AKeADQAAgCAAgBQAAgHAFgFQAGgGAIAAQAIAAAFAGQAGAFAAAHQAAAIgGAGQgFAFgIAAQgIAAgGgFQgEgFgBgGgArDADIVhAA");
	this.shape.setTransform(113.825,1.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FFFFFF").ss(1,1,1).p("AriAAIXFAA");
	this.shape_1.setTransform(-24.5,2.15);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.STROKELEFT, new cjs.Rectangle(-99.4,-1,285,5.8), null);


(lib.patternbg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.pattern_w_bg_958x700();
	this.instance.setTransform(0,0,0.9057,0.9057);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.patternbg, new cjs.Rectangle(0,0,867.7,634), null);


(lib.LOGO = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.SOVRYN_LOGO_V32x();
	this.instance.setTransform(-65,20,0.2505,0.2505);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.LOGO, new cjs.Rectangle(-65,20,254.6,34.1), null);


(lib.hasarrived = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("Ag+BHQgGAAAAgHIAAh/QAAgHAGAAIBUAAQAvAAAAA1IAAAjQAAA1gvAAgAghAlIAzAAQAIAAADgDQAFgFAAgLIAAgjQAAgLgEgFQgEgDgIABIgzAAg");
	this.shape.setTransform(488.625,23);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("Ag1BHQgGAAAAgHIAAh/QAAgHAGAAIBrAAQAGAAAAAHIAAAVQAAAHgGAAIhNAAIAAAUIAuAAQAGAAAAAGIAAASQAAAGgGAAIguAAIAAAVIBNAAQAGAAAAAHIAAAVQAAAHgGAAg");
	this.shape_1.setTransform(473.775,23);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgQBHQgFgBgCgEIg2iBQgCgHAHAAIAaAAQAFABABAEIAoBjIAohjQADgEAEgBIAaAAQAHAAgCAHIg2CBQgDAEgEABg");
	this.shape_2.setTransform(458.5,23);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgLBHQgGAAAAgHIAAh/QAAgHAGAAIAXAAQAGAAAAAHIAAB/QAAAHgGAAg");
	this.shape_3.setTransform(447.425,23);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AAfBHQgFAAgDgFIgRgcIglAAIAAAaQAAAHgHAAIgXAAQgGAAAAgHIAAh/QAAgHAGAAIBIAAQA5AAAAA1IAAAEQAAAlgbALIAUAcQACAEgBACQAAAAAAAAQgBABAAAAQgBAAAAAAQgBABgBAAgAgfAFIAmAAQAOgBAEgDQAHgDAAgMIAAgDQAAgLgGgFQgFgDgOABIgmAAg");
	this.shape_4.setTransform(436.85,23);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AAfBHQgFAAgCgFIgSgcIgmAAIAAAaQAAAHgFAAIgYAAQgGAAAAgHIAAh/QAAgHAGAAIBHAAQA6AAAAA1IAAAEQAAAlgaALIAUAcQABAEAAACQgBAAAAAAQgBABAAAAQgBAAAAAAQgBABgBAAgAggAFIAoAAQANgBAFgDQAGgDAAgMIAAgDQAAgLgGgFQgFgDgNABIgoAAg");
	this.shape_5.setTransform(421.25,23);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AAwBHQgFgBgCgEIgHgSIhDAAIgIASQgCAEgFABIgaAAQgIAAADgIIA7iAQACgEAFgBIAbAAQAFABACAEIA7CAQADAIgIAAgAAWATIgWg1IgVA1IArAAg");
	this.shape_6.setTransform(404.902,23);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AgTBHQgsAAgEgqQAAgGAGAAIAYAAQAFAAABAFQADAJAJgBIAnAAQAMAAAAgJQAAgGgCgCQgDgCgGAAIgsgEQgXgCgKgJQgKgJAAgUQAAgqAwgBIAkAAQAsABADApQABAGgHAAIgXAAQgFAAgCgGQgCgHgJAAIgkAAQgNgBAAAKQAAAFADADQADACAGAAIAsAEQAXABAKAKQAKAIAAAUQAAAsgwAAg");
	this.shape_7.setTransform(383.975,23);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AAwBHQgFgBgCgEIgHgSIhDAAIgIASQgCAEgFABIgaAAQgIAAADgIIA7iAQACgEAFgBIAbAAQAFABACAEIA7CAQADAIgIAAgAAWATIgWg1IgVA1IArAAg");
	this.shape_8.setTransform(368.002,23);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("AAlBHQgGAAAAgHIAAgwIg9AAIAAAwQAAAHgGAAIgYAAQgGAAAAgHIAAh/QAAgHAGAAIAYAAQAGAAAAAHIAAAxIA9AAIAAgxQAAgHAGAAIAYAAQAGAAAAAHIAAB/QAAAHgGAAg");
	this.shape_9.setTransform(351.825,23);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hasarrived, new cjs.Rectangle(341.9,8,231.10000000000002,28), null);


(lib.forbitcoin = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AAoBHQgFgBgDgDIhAhSIAABPQAAAHgGAAIgYAAQgFAAAAgHIAAh/QAAgHAFAAIAXAAQAFABADADIBABSIAAhPQAAgHAGAAIAXAAQAHAAgBAHIAAB/QABAHgHAAg");
	this.shape.setTransform(-523.9,53.05);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AgLBHQgGAAAAgHIAAh/QAAgHAGAAIAXAAQAGAAAAAHIAAB/QAAAHgGAAg");
	this.shape_1.setTransform(-535.025,53.05);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AgZBHQgYAAgMgOQgMgNAAgWIAAgrQAAgWAMgNQAMgOAYAAIAzAAQAYAAAMAOQAMANAAAWIAAArQAAAWgMANQgMAOgYAAgAgigiQgDADAAAJIAAAtQAAAJADADQADACAGAAIAzAAQAGAAADgCQADgDAAgJIAAgtQAAgJgDgDQgCgBgHAAIgzAAQgHAAgCABg");
	this.shape_2.setTransform(-546.375,53.05);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AgVBHQgYAAgMgOQgMgNAAgWIAAgrQAAgWAMgNQAMgOAYAAIArAAQAYAAAMAOQAMANAAAWQAAAFgGAAIgYAAQgGAAAAgCIAAgEQAAgJgDgDQgCgBgHAAIgrAAQgHAAgCABQgDADAAAJIAAAtQAAAJADADQADACAGAAIArAAQAGAAADgCQADgDAAgJIAAgDQAAgGAGAAIAYAAQAGAAAAAEIAAAEQAAAWgMANQgMAOgYAAg");
	this.shape_3.setTransform(-562.475,53.05);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AgLBHQgGAAAAgHIAAhjIgmAAQgGAAAAgHIAAgVQAAgHAGAAIBvAAQAGAAAAAHIAAAVQAAAHgGAAIgmAAIAABjQAAAHgGAAg");
	this.shape_4.setTransform(-577,53.05);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AgLBHQgGAAAAgHIAAh/QAAgHAGAAIAXAAQAGAAAAAHIAAB/QAAAHgGAAg");
	this.shape_5.setTransform(-586.575,53.05);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFFFF").s().p("Ag7BHQgGAAAAgHIAAh/QAAgHAGAAIBNAAQAvABAAAoIAAACQAAATgLAIQAMAJAAAUIAAACQAAAUgKAKQgMAJgZABgAgeAlIAvAAQANAAAAgKIAAgDQAAgLgNAAIgvAAgAgegNIAtAAQAOABAAgKIAAgEQAAgJgOAAIgtAAg");
	this.shape_6.setTransform(-597.125,53.05);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AAfBHQgFAAgDgFIgRgcIgmAAIAAAaQAAAHgFAAIgYAAQgGAAAAgHIAAh/QAAgHAGAAIBHAAQA6AAAAA1IAAAEQAAAlgbALIAVAcQACADgBADQgBAAAAAAQgBABAAAAQgBAAAAAAQgBABgBAAgAggAEIAoAAQAMAAAGgDQAGgCAAgNIAAgDQAAgLgGgFQgFgCgNAAIgoAAg");
	this.shape_7.setTransform(-617.55,53.05);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AgZBHQgYAAgMgOQgMgNAAgWIAAgrQAAgWAMgNQAMgOAYAAIAzAAQAYAAAMAOQAMANAAAWIAAArQAAAWgMANQgMAOgYAAgAgigiQgDADAAAJIAAAtQAAAJADADQADACAGAAIAzAAQAGAAADgCQADgDAAgJIAAgtQAAgJgDgDQgCgBgHAAIgzAAQgHAAgCABg");
	this.shape_8.setTransform(-633.925,53.05);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("AgzBHQgGAAAAgHIAAh/QAAgHAGAAIBnAAQAGAAAAAHIAAAVQAAAHgGAAIhKAAIAAAUIAsAAQAGAAAAAGIAAASQAAAGgGAAIgsAAIAAAxQAAAHgGAAg");
	this.shape_9.setTransform(-648.475,53.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.forbitcoin, new cjs.Rectangle(-657.5,12.1,189.10000000000002,80), null);


(lib.defi = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgLBGQgGABAAgHIAAh/QAAgGAGgBIAXAAQAGABAAAGIAAB/QAAAHgGgBg");
	this.shape.setTransform(366.725,28.05);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AgzBGQgGABAAgHIAAh/QAAgGAGgBIBnAAQAGABAAAGIAAAVQAAAHgGgBIhKAAIAAAVIAsAAQAGAAAAAGIAAASQAAAGgGAAIgsAAIAAAxQAAAHgGgBg");
	this.shape_1.setTransform(357.525,28.05);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("Ag1BGQgGABAAgHIAAh/QAAgGAGgBIBrAAQAGABAAAGIAAAVQAAAHgGgBIhNAAIAAAVIAuAAQAGAAAAAGIAAASQAAAGgGAAIguAAIAAAVIBNAAQAGAAAAAHIAAAVQAAAHgGgBg");
	this.shape_2.setTransform(343.775,28.05);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("Ag+BGQgGABAAgHIAAh/QAAgGAGgBIBUAAQAvAAAAA1IAAAjQAAA0gvAAgAghAlIAzAAQAIAAADgDQAFgEAAgMIAAgjQAAgLgEgFQgEgDgIAAIgzAAg");
	this.shape_3.setTransform(328.625,28.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.defi, new cjs.Rectangle(318.5,0,102,43.6), null);


(lib.JoinTheWaitlist = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AgLAzQgKgJAAgRIAAgmIgPAAIAAgWIAPAAIAAgYIAbAAIAAAYIAYAAIAAAWIgYAAIAAAmQAAANAMAAQAGAAAFgEIAIAUQgJAGgOAAQgRAAgIgJg");
	this.shape.setTransform(153.6,9.45);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgrAnIAKgTQAOAIATABQARAAAAgJQAAgFgJgDIgTgCQgNgDgHgFQgJgHAAgMQAAgOAMgJQAMgJAUAAQAWAAAPAIIgKAUQgMgGgPgBQgRABAAAIQAAAGAJACIATAEQANACAHAFQAJAGAAANQAAAOgMAIQgMAJgVAAQgaAAgQgLg");
	this.shape_1.setTransform(144.925,10.45);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgNBHIAAhgIAbAAIAABggAgLgrQgFgFgBgGQABgHAFgEQAEgFAHAAQAHAAAGAEQAEAFAAAGQAAAHgEAFQgFAEgIAAQgHAAgEgEg");
	this.shape_2.setTransform(137.5,8.225);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgNBDIAAiFIAbAAIAACFg");
	this.shape_3.setTransform(132.1,8.625);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AgMAzQgJgJAAgRIAAgmIgPAAIAAgWIAPAAIAAgYIAbAAIAAAYIAYAAIAAAWIgYAAIAAAmQAAANAMAAQAGAAAGgEIAHAUQgIAGgPAAQgQAAgKgJg");
	this.shape_4.setTransform(125.45,9.45);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AgNBHIAAhgIAbAAIAABggAgMgrQgEgFAAgGQAAgHAEgEQAFgFAHAAQAIAAAFAEQAEAFABAGQgBAHgEAFQgFAEgIAAQgHAAgFgEg");
	this.shape_5.setTransform(118.9,8.225);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AgjApQgKgHAAgNQAAgcAqAAIAVAAQAAgUgVABQgRAAgLAJIgKgUQAQgMAZAAQAuAAAAArIAAA3IgaAAIAAgMQgIANgUAAQgSAAgJgJgAgRAUQAAAEAEAEQAEADAHAAQAPAAAFgNIAAgKIgSAAQgRAAAAAMg");
	this.shape_6.setTransform(110.35,10.45);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AAcA/IgchVIgbBVIgfAAIgqh9IAeAAIAdBXIAehXIAaAAIAcBYIAehYIAcAAIgqB9g");
	this.shape_7.setTransform(94.675,9);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#000000").s().p("AgjAkQgPgOAAgWQAAgUAOgOQAPgPAVAAQAXAAANAOQAPAOAAAWIAAAHIhJAAQACAJAIAFQAGAGALAAQAOAAAKgKIAPAQQgNAQgbAAQgYAAgPgOgAAZgHQgCgKgGgFQgHgGgKAAQgIAAgHAGQgGAFgBAKIAvAAIAAAAg");
	this.shape_8.setTransform(73.5,10.45);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#000000").s().p("AAWBDIAAgzQgBgWgTAAQgKAAgGAGQgGAGgBANIAAAwIgbAAIAAiFIAbAAIAAAvQAMgMATAAQARAAALALQALALAAAUIAAA4g");
	this.shape_9.setTransform(61.65,8.625);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#000000").s().p("AgNA/IAAhlIgpAAIAAgYIBtAAIAAAYIgpAAIAABlg");
	this.shape_10.setTransform(49.85,9);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#000000").s().p("AAWAxIAAgyQAAgXgVAAQgJAAgGAHQgGAGAAAMIAAAwIgcAAIAAhgIAbAAIAAAMQALgNATAAQATAAAKAKQAMAMAAAVIAAA2g");
	this.shape_11.setTransform(33.1,10.375);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#000000").s().p("AgNBHIAAhgIAbAAIAABggAgMgrQgEgFAAgGQAAgHAEgEQAFgFAHAAQAIAAAEAEQAGAFAAAGQAAAHgGAFQgEAEgIAAQgHAAgFgEg");
	this.shape_12.setTransform(24.15,8.225);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#000000").s().p("AglAkQgPgOAAgWQAAgUAPgPQAPgOAWAAQAXAAAPAOQAPAPAAAUQAAAWgPAOQgPAOgXAAQgWAAgPgOgAgQgTQgIAIAAALQAAANAIAHQAHAHAJAAQALAAAHgHQAGgHABgNQgBgLgGgIQgHgGgLAAQgJAAgHAGg");
	this.shape_13.setTransform(15.6,10.45);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#000000").s().p("AgqAuIAQgTQAKANANAAQARAAAAgUIAAg8IgrAAIAAgXIBIAAIAABRQAAAugsAAQgbAAgOgSg");
	this.shape_14.setTransform(4.025,9.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.JoinTheWaitlist, new cjs.Rectangle(-2,-4.1,161.8,25.9), null);


(lib.Tween3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.LOGO();
	this.instance.setTransform(42.35,-159.4,0.5765,0.5765,0,0,0,72.6,72.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36.9,-189.7,146.7,19.599999999999994);


(lib.BUTTON = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Component_5_11
	this.instance = new lib.JoinTheWaitlist();
	this.instance.setTransform(112.05,24.55,1,1,0,0,0,78.9,8.8);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FEC004").ss(0.5,0,0,4).p("Arjj3IXHAAQBnAABIBJQBJBIAABmQAABnhJBIQhIBJhnAAI3HAAQhnAAhIhJQhJhIAAhnQAAhmBJhIQBIhJBnAAg");
	this.shape.setTransform(112,25);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FDC004").s().p("ArjD6QhoAAhJhJQhJhJAAhoQAAhnBJhIQBJhKBoAAIXHAAQBnAABKBKQBJBIAABnQAABohJBJQhKBJhnAAg");
	this.shape_1.setTransform(112,25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.BUTTON, new cjs.Rectangle(12.3,-0.7,199.5,51.5), null);


// stage content:
(lib._540x90 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// button
	this.instance = new lib.BUTTON();
	this.instance.setTransform(466.8,49.8,0.5395,0.539,0,0,0,113.2,22.2);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(57).to({_off:false},0).to({alpha:1},16).wait(167));

	// stroke_left
	this.instance_1 = new lib.STROKELEFT();
	this.instance_1.setTransform(-93.95,74.75,1,1,0,0,0,92.3,1.9);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(62).to({_off:false},0).to({x:133.4},20,cjs.Ease.circOut).wait(158));

	// logo_copy
	this.instance_2 = new lib.Tween3("synched",0);
	this.instance_2.setTransform(42.75,120.15,0.6473,0.6458,0,0,0,0.1,0.1);
	this.instance_2.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({scaleX:0.6405,scaleY:0.6382,x:46.25,y:139.35,alpha:1},8).wait(232));

	// has_arrived
	this.instance_3 = new lib.hasarrived();
	this.instance_3.setTransform(401.15,91.2,1,1,0,0,0,192.8,65.2);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(35).to({_off:false},0).to({x:73.9,y:93.5},15,cjs.Ease.quartOut).wait(190));

	// white_bg
	this.instance_4 = new lib.whitebg_round();
	this.instance_4.setTransform(613.05,51.45,0.5953,0.5028,0,0,0,76,21.5);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(41).to({_off:false},0).to({x:337.95},15,cjs.Ease.quartOut).wait(184));

	// For_bitcoin
	this.instance_5 = new lib.forbitcoin();
	this.instance_5.setTransform(1400.3,63.15,1,1,0,0,0,192.8,65.2);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(21).to({_off:false},0).to({x:927.5,y:63.2},13,cjs.Ease.quartOut).wait(206));

	// Defi
	this.instance_6 = new lib.defi();
	this.instance_6.setTransform(423.85,45.55,1,1,0,0,0,192.8,22.4);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(6).to({_off:false},0).to({x:-105.2},15,cjs.Ease.quartOut).wait(219));

	// pattern
	this.instance_7 = new lib.patternbg();
	this.instance_7.setTransform(467.35,166,1,1,0,0,0,433.8,317);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).to({regX:434.1,regY:316.9,scaleX:1.074,scaleY:1.074,rotation:-4.9587,x:503.65,y:146.25},239).wait(1));

	// bg
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("Eg5iAHnIAAvNMBzFAAAIAAPNg");
	this.shape.setTransform(365.15,45.05);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(240));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-15.1,-188.1,1012.1,713.9);
// library properties:
lib.properties = {
	id: '6C2532F589104630A12141E57F9B7546',
	width: 540,
	height: 90,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/pattern_w_bg_958x700.jpg", id:"pattern_w_bg_958x700"},
		{src:"images/SOVRYN_LOGO_V32x.png", id:"SOVRYN_LOGO_V32x"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['6C2532F589104630A12141E57F9B7546'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;