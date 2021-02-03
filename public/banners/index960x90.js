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
	this.shape.setTransform(25.436,15.8,0.9306,0.9412);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.whitebg_round, new cjs.Rectangle(-58.5,-4.2,168,40), null);


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
	this.shape_1.graphics.f().s("#FFFFFF").ss(1,1,1).p("A/SAAMA+lAAA");
	this.shape_1.setTransform(-157.2,2.15);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.STROKELEFT, new cjs.Rectangle(-358.4,-1,544,5.8), null);


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
	this.shape.graphics.f("#000000").s().p("Ah3CGQgLAAAAgLIAAj1QAAgLALAAIChAAQBZAAAABlIAABDQAABjhZAAgAg/BGIBhAAQAPAAAHgGQAJgIAAgWIAAhCQAAgWgJgIQgGgGgQAAIhhAAg");
	this.shape.setTransform(641.6,8.675);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AhlCGQgLAAAAgLIAAj1QAAgLALAAIDLAAQALAAAAALIAAAqQAAAMgLAAIiTAAIAAAnIBZAAQALAAAAAMIAAAiQAAAMgLAAIhZAAIAAApICTAAQALAAAAALIAAAqQAAALgLAAg");
	this.shape_1.setTransform(613.35,8.675);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgeCGQgJAAgFgIIhmj2QgGgNAPAAIAvAAQALAAADAJIBMC8IBOi8QADgJAJAAIAxAAQAOAAgGANIhnD2QgEAIgJAAg");
	this.shape_2.setTransform(584.35,8.675);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgVCGQgMAAAAgLIAAj1QAAgLAMAAIArAAQAMAAAAALIAAD1QAAALgMAAg");
	this.shape_3.setTransform(563.325,8.675);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AA7CGQgKAAgEgHIghg2IhIAAIAAAyQAAALgMAAIgtAAQgLAAAAgLIAAj1QAAgLALAAICKAAQBsAAAABlIAAAHQAABGgzAUIAnA4QAEAFgCAEQgCAEgHAAgAg8AJIBKAAQAZAAAKgGQAMgHAAgWIAAgGQAAgXgMgHQgJgGgaAAIhKAAg");
	this.shape_4.setTransform(543.15,8.675);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AA6CGQgJAAgEgHIghg2IhIAAIAAAyQAAALgMAAIgtAAQgLAAAAgLIAAj1QAAgLALAAICKAAQBsAAAABlIAAAHQAABGgzAUIAnA4QAEAFgCAEQgCAEgHAAgAg8AJIBKAAQAZAAAKgGQAMgHAAgWIAAgGQAAgXgMgHQgJgGgaAAIhKAAg");
	this.shape_5.setTransform(513.45,8.675);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("ABcCGQgJAAgEgIIgOghIiBAAIgOAhQgDAIgKAAIgzAAQgOAAAFgNIBwj1QAEgJAKAAIAzAAQAKAAAEAJIBwD1QAGANgPAAgAArAmIgrhmIgpBmIBUAAg");
	this.shape_6.setTransform(482.3872,8.675);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AgmCGQhTAAgGhOQgBgMAMAAIAtAAQAJAAADALQAEAPARAAIBMAAQAYAAAAgTQAAgKgFgEQgFgEgMgBIhVgHQgrgDgTgSQgTgRAAglQAAhTBaAAIBHAAQBTAAAGBPQABALgMAAIgtAAQgJAAgDgLQgEgOgRAAIhGAAQgYAAAAASQAAAKAFAEQAFAEAMABIBVAHQArADATASQATARAAAmQAABShbAAg");
	this.shape_7.setTransform(442.599,8.675);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("ABcCGQgJAAgEgIIgOghIiBAAIgOAhQgDAIgKAAIgzAAQgOAAAFgNIBwj1QAEgJAKAAIAzAAQAKAAAEAJIBwD1QAGANgPAAgAArAmIgrhmIgpBmIBUAAg");
	this.shape_8.setTransform(412.2372,8.675);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("ABHCGQgMAAAAgLIAAhcIh1AAIAABcQAAALgMAAIgsAAQgLAAAAgLIAAj1QAAgLALAAIAsAAQAMAAAAALIAABfIB1AAIAAhfQAAgLAMAAIAsAAQAMAAAAALIAAD1QAAALgMAAg");
	this.shape_9.setTransform(381.45,8.675);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hasarrived, new cjs.Rectangle(364.4,-18,349.9,49.6), null);


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
	this.shape.graphics.f("#FFFFFF").s().p("ABLCGQgIAAgGgHIh7icIAACYQAAALgLAAIgtAAQgLAAAAgLIAAj1QAAgLALAAIAsAAQAIAAAGAHIB6CdIAAiZQAAgLAMAAIAtAAQALAAAAALIAAD1QAAALgLAAg");
	this.shape.setTransform(498.775,26.675);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AgVCGQgMAAAAgLIAAj1QAAgLAMAAIArAAQAMAAAAALIAAD1QAAALgMAAg");
	this.shape_1.setTransform(477.625,26.675);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AgxCGQgsAAgYgaQgWgYAAgqIAAhSQAAgrAWgYQAYgaAsAAIBjAAQAsAAAYAaQAWAYAAArIAABSQAAAqgWAYQgYAagsAAgAhChAQgFAFAAAQIAABXQgBAQAHAFQAEAFAMAAIBjAAQAMAAAFgFQAFgFABgQIAAhXQgBgQgFgFQgFgEgMAAIhjAAQgMAAgFAEg");
	this.shape_2.setTransform(455.95,26.675);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AgqCGQgrAAgYgaQgXgYAAgqIAAhSQAAgrAXgYQAYgaArAAIBUAAQAtAAAXAaQAWAYABArQAAAKgMAAIgtAAQgMAAAAgGIAAgHQABgQgGgFQgEgEgNAAIhUAAQgMAAgEAEQgGAFAAAQIAABXQAAAQAHAFQAEAFALAAIBUAAQALAAAGgFQAFgFAAgQIAAgFQAAgMAMAAIAtAAQAMAAAAAHIAAAIQgBAqgWAYQgXAagtAAg");
	this.shape_3.setTransform(425.3,26.675);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AgWCGQgLAAAAgLIAAi/IhJAAQgLAAAAgLIAAgrQAAgLALAAIDVAAQALAAAAALIAAArQAAALgLAAIhJAAIAAC/QAAALgMAAg");
	this.shape_4.setTransform(397.75,26.675);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AgVCGQgMAAAAgLIAAj1QAAgLAMAAIArAAQAMAAAAALIAAD1QAAALgMAAg");
	this.shape_5.setTransform(379.575,26.675);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFFFF").s().p("AhxCGQgMAAAAgLIAAj1QAAgLAMAAICSAAQBaAAABBMIAAAEQAAAlgWAQQAYARAAAnIAAAEQAAAlgVASQgWATguAAgAg6BGIBZAAQAaAAAAgSIAAgHQAAgTgaAAIhZAAgAg6gYIBXAAQAZAAAAgTIAAgHQAAgSgZAAIhXAAg");
	this.shape_6.setTransform(359.55,26.675);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AA7CGQgKAAgEgHIghg2IhJAAIAAAyQABALgMAAIgtAAQgLAAAAgLIAAj1QAAgLALAAICKAAQBsAAAABlIAAAHQAABGgyAUIAmA4QAEAFgCAEQgCAEgHAAgAg9AJIBMAAQAYAAAKgGQAMgHAAgWIAAgGQAAgXgMgHQgKgGgYAAIhMAAg");
	this.shape_7.setTransform(320.65,26.675);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AgxCGQgsAAgYgaQgWgYAAgqIAAhSQAAgrAWgYQAYgaAsAAIBjAAQAsAAAYAaQAWAYAAArIAABSQAAAqgWAYQgYAagsAAgAhChAQgFAFAAAQIAABXQgBAQAHAFQAEAFAMAAIBjAAQAMAAAFgFQAFgFABgQIAAhXQgBgQgFgFQgFgEgMAAIhjAAQgMAAgFAEg");
	this.shape_8.setTransform(289.45,26.675);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("AhiCGQgLAAAAgLIAAj1QAAgLALAAIDFAAQALAAAAALIAAAqQAAAMgLAAIiNAAIAAAnIBUAAQAMAAAAAMIAAAiQAAAMgMAAIhUAAIAABeQAAALgLAAg");
	this.shape_9.setTransform(261.775,26.675);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.forbitcoin, new cjs.Rectangle(236.9,0,344.30000000000007,49.6), null);


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
	this.shape.graphics.f("#FFFFFF").s().p("AgVCGQgMAAAAgLIAAj1QAAgLAMAAIArAAQAMAAAAALIAAD1QAAALgMAAg");
	this.shape.setTransform(246.975,13.725);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AhiCGQgLAAAAgLIAAj1QAAgLALAAIDFAAQALAAAAALIAAAqQAAAMgLAAIiNAAIAAAnIBUAAQAMAAAAAMIAAAiQAAAMgMAAIhUAAIAABeQAAALgLAAg");
	this.shape_1.setTransform(229.425,13.725);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AhlCGQgLAAAAgLIAAj1QAAgLALAAIDLAAQALAAAAALIAAAqQAAAMgLAAIiTAAIAAAnIBZAAQALAAAAAMIAAAiQAAAMgLAAIhZAAIAAApICTAAQALAAAAALIAAAqQAAALgLAAg");
	this.shape_2.setTransform(203.3,13.725);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("Ah3CGQgLAAAAgLIAAj1QAAgLALAAIChAAQBZAAAABlIAABDQAABjhZAAgAg/BGIBhAAQAPAAAHgGQAJgIAAgWIAAhCQAAgWgJgIQgGgGgQAAIhhAAg");
	this.shape_3.setTransform(174.5,13.725);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.defi, new cjs.Rectangle(157,-20,221.2,58), null);


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
	this.instance.setTransform(36.1,-165.7,0.4911,0.4898,0,0,0,72.7,72.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-31.5,-191.4,125,16.700000000000017);


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
(lib._960x90 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(849.3,45.3,0.8911,0.8655,0,0,0,112.1,25.3);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(116).to({_off:false},0).to({alpha:1},14).wait(110));

	// stroke_left
	this.instance_1 = new lib.STROKELEFT();
	this.instance_1.setTransform(-109.3,77.75,1,1,0,0,0,92.3,1.9);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(124).to({_off:false},0).to({x:303.8},26,cjs.Ease.circOut).wait(90));

	// logo_copy
	this.instance_2 = new lib.Tween3("synched",0);
	this.instance_2.setTransform(406.1,484.9,2.4005,2.3989,0,0,0,0.2,0.3);
	this.instance_2.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({regX:0.3,scaleX:2.4004,x:406.3,alpha:1},22).to({regY:0.2,scaleX:2.4005,y:484.65},16).to({regX:0.6,regY:0.6,scaleX:2.4001,scaleY:2.3928,x:407.05,y:484.5,alpha:0},21).to({_off:true},12).wait(169));

	// has_arrived
	this.instance_3 = new lib.hasarrived();
	this.instance_3.setTransform(811,102.2,1,1,0,0,0,192.8,65.2);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(94).to({_off:false},0).wait(1).to({regX:511.8,regY:8.7,x:1079.65,y:45.7},0).wait(1).to({x:1030.4},0).wait(1).to({x:982.5},0).wait(1).to({x:936.1},0).wait(1).to({x:891.4},0).wait(1).to({x:848.7},0).wait(1).to({x:808.1},0).wait(1).to({x:769.8},0).wait(1).to({x:733.9},0).wait(1).to({x:700.45},0).wait(1).to({x:669.5},0).wait(1).to({x:641},0).wait(1).to({x:614.95},0).wait(1).to({x:591.15},0).wait(1).to({x:569.55},0).wait(1).to({regX:192.8,regY:65.2,x:231.05,y:102.2},0).wait(130));

	// white_bg
	this.instance_4 = new lib.whitebg_round();
	this.instance_4.setTransform(1142.25,53.15,1.1906,1.215,0,0,0,77.5,21.7);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(102).to({_off:false},0).to({x:662.3},16,cjs.Ease.quintOut).wait(122));

	// For_bitcoin
	this.instance_5 = new lib.forbitcoin();
	this.instance_5.setTransform(930.65,84.2,1,1,0,0,0,192.8,65.2);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(76).to({_off:false},0).to({x:72.7},15,cjs.Ease.quintOut).wait(149));

	// Defi
	this.instance_6 = new lib.defi();
	this.instance_6.setTransform(1006.75,53.4,1,1,0,0,0,192.8,22.4);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(58).to({_off:false},0).to({x:54.8},14,cjs.Ease.quintOut).wait(168));

	// pattern
	this.instance_7 = new lib.pattern_w_bg_958x700();
	this.instance_7.setTransform(268,-183);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).to({scaleX:1.0784,scaleY:1.0784,rotation:-6.9152,x:165.75,y:-195.35},239).wait(1));

	// bg
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("EhyqAIIIAAwPMDlVAAAIAAQPg");
	this.shape.setTransform(724.125,45.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(240));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-79.5,-274.7,1537.5,828.8);
// library properties:
lib.properties = {
	id: '6C2532F589104630A12141E57F9B7546',
	width: 960,
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