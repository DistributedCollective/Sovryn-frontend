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
	this.shape.graphics.f("#000000").s().p("AhSBcQgHAAAAgIIAAinQAAgIAHAAIBvAAQA9AAAABFIAAAuQAABEg9AAgAgrAwIBCAAQAKAAAFgEQAHgGgBgPIAAgtQAAgPgFgFQgFgFgLAAIhCAAg");
	this.shape.setTransform(868.5,30.925);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AhFBcQgHAAAAgIIAAinQAAgIAHAAICLAAQAHAAAAAIIAAAdQAAAHgHAAIhkAAIAAAbIA8AAQAIAAAAAIIAAAYQAAAIgIAAIg8AAIAAAcIBkAAQAHAAAAAHIAAAdQAAAIgHAAg");
	this.shape_1.setTransform(849.15,30.925);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgUBcQgHAAgCgGIhHioQgEgJAKAAIAhAAQAHAAACAGIA0CBIA1iBQACgGAHAAIAhAAQAKAAgEAJIhHCoQgCAGgHAAg");
	this.shape_2.setTransform(829.325,30.925);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgOBcQgIAAAAgIIAAinQAAgIAIAAIAdAAQAIAAAAAIIAACnQAAAIgIAAg");
	this.shape_3.setTransform(814.95,30.925);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AAoBcQgGAAgDgFIgXglIgxAAIAAAiQAAAIgIAAIgfAAQgHAAAAgIIAAinQAAgIAHAAIBeAAQBKAAAABFIAAAFQAAAwgiAOIAaAlQADAEgCADQgBADgFAAgAgpAGIAzAAQARAAAGgEQAJgEAAgPIAAgFQAAgPgJgFQgGgFgRAAIgzAAg");
	this.shape_4.setTransform(801.175,30.925);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AAoBcQgGAAgDgFIgXglIgxAAIAAAiQAAAIgIAAIgfAAQgHAAAAgIIAAinQAAgIAHAAIBeAAQBKAAAABFIAAAFQAAAwgiAOIAaAlQADAEgCADQgBADgFAAgAgpAGIAzAAQARAAAGgEQAJgEAAgPIAAgFQAAgPgJgFQgGgFgRAAIgzAAg");
	this.shape_5.setTransform(780.875,30.925);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AA/BcQgHAAgCgGIgKgXIhYAAIgJAXQgDAGgGAAIgjAAQgKAAAEgJIBNioQACgGAHAAIAjAAQAGAAADAGIBNCoQAEAJgKAAgAAdAaIgdhFIgcBFIA5AAg");
	this.shape_6.setTransform(759.61,30.925);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AgZBcQg6AAgEg2QAAgIAIAAIAfAAQAGAAACAHQADALAMAAIAzAAQAQAAAAgNQAAgHgDgDQgDgDgJAAIg5gFQgegCgNgMQgNgLAAgaQAAg5A+AAIAwAAQA5AAAEA2QAAAIgIAAIgfAAQgGAAgCgHQgCgLgMAAIgwAAQgQAAAAANQAAAHADADQAEACAIABIA6AFQAdACANAMQANALAAAaQAAA5g+AAg");
	this.shape_7.setTransform(732.3986,30.925);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AA/BcQgHAAgCgGIgKgXIhYAAIgJAXQgDAGgGAAIgjAAQgKAAAEgJIBNioQACgGAHAAIAjAAQAGAAADAGIBNCoQAEAJgKAAgAAdAaIgdhFIgcBFIA5AAg");
	this.shape_8.setTransform(711.61,30.925);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("AAwBcQgIAAAAgIIAAg/IhPAAIAAA/QAAAIgIAAIgfAAQgIAAABgIIAAinQgBgIAIAAIAfAAQAIAAAAAIIAABBIBPAAIAAhBQAAgIAIAAIAfAAQAHAAABAIIAACnQgBAIgHAAg");
	this.shape_9.setTransform(690.55,30.925);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hasarrived, new cjs.Rectangle(678.3,12,231,35.2), null);


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
	this.shape.graphics.f("#FFFFFF").s().p("AAzBcQgFAAgFgFIhThqIAABnQAAAIgHAAIggAAQgHAAAAgIIAAinQAAgIAHAAIAfAAQAFAAAEAFIBTBrIAAhoQAAgIAJAAIAeAAQAIAAAAAIIAACnQAAAIgIAAg");
	this.shape.setTransform(172.25,50.625);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AgPBcQgHAAAAgIIAAinQAAgIAHAAIAeAAQAIAAAAAIIAACnQAAAIgIAAg");
	this.shape_1.setTransform(157.8,50.625);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AghBcQgeAAgRgSQgPgRAAgcIAAg4QAAgdAPgRQARgSAeAAIBDAAQAfAAAQASQAPARAAAdIAAA4QAAAcgPARQgQASgfAAgAgtgsQgDAEAAALIAAA7QAAALAEAEQADADAIAAIBDAAQAIAAADgDQAFgEAAgLIAAg7QAAgLgEgEQgDgDgJAAIhDAAQgIAAgEADg");
	this.shape_2.setTransform(142.975,50.625);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AgcBcQgeAAgQgSQgPgRgBgcIAAg4QABgdAPgRQAQgSAeAAIA5AAQAeAAAQASQAQARgBAdQAAAHgHAAIgeAAQgJAAAAgFIAAgEQABgLgEgEQgEgDgIAAIg5AAQgIAAgDADQgEAEAAALIAAA7QAAALAEAEQADADAIAAIA5AAQAIAAADgDQAEgEAAgLIAAgEQAAgIAJAAIAeAAQAHAAAAAFIAAAGQABAcgQARQgQASgeAAg");
	this.shape_3.setTransform(122,50.625);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AgPBcQgHAAAAgIIAAiCIgyAAQgIAAAAgIIAAgdQAAgIAIAAICRAAQAIAAAAAIIAAAdQAAAIgIAAIgyAAIAACCQAAAIgIAAg");
	this.shape_4.setTransform(103.175,50.625);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AgPBcQgHAAAAgIIAAinQAAgIAHAAIAeAAQAIAAAAAIIAACnQAAAIgIAAg");
	this.shape_5.setTransform(90.75,50.625);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFFFF").s().p("AhOBcQgHAAAAgIIAAinQAAgIAHAAIBlAAQA9AAABA0IAAADQAAAagQAKQARAMAAAaIAAADQAAAZgOANQgPANggAAgAgnAwIA9AAQARAAAAgNIAAgEQAAgNgRAAIg9AAgAgngQIA7AAQARAAAAgNIAAgFQAAgNgRAAIg7AAg");
	this.shape_6.setTransform(77.075,50.625);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AAoBcQgGAAgDgFIgXglIgxAAIAAAiQAAAIgIAAIgfAAQgHAAAAgIIAAinQAAgIAHAAIBeAAQBKAAAABFIAAAFQAAAwgiAOIAaAlQADAEgCADQgBADgFAAgAgpAGIAzAAQARAAAGgEQAJgEAAgPIAAgFQAAgPgJgFQgGgFgRAAIgzAAg");
	this.shape_7.setTransform(50.475,50.625);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AghBcQgeAAgRgSQgPgRAAgcIAAg4QAAgdAPgRQARgSAeAAIBDAAQAfAAAQASQAPARAAAdIAAA4QAAAcgPARQgQASgfAAgAgtgsQgDAEAAALIAAA7QAAALAEAEQADADAIAAIBDAAQAIAAADgDQAFgEAAgLIAAg7QAAgLgEgEQgDgDgJAAIhDAAQgIAAgEADg");
	this.shape_8.setTransform(29.125,50.625);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("AhDBcQgIAAAAgIIAAinQAAgIAIAAICGAAQAJAAgBAIIAAAdQABAHgJAAIhfAAIAAAbIA5AAQAHAAABAIIAAAYQgBAIgHAAIg5AAIAABAQgBAIgHAAg");
	this.shape_9.setTransform(10.2,50.625);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.forbitcoin, new cjs.Rectangle(-1,-1.5,189.1,101.6), null);


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
	this.shape.graphics.f("#FFFFFF").s().p("AgOBcQgIAAAAgIIAAinQAAgIAIAAIAdAAQAIAAAAAIIAACnQAAAIgIAAg");
	this.shape.setTransform(1094.5,25.925);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AhDBcQgHAAAAgIIAAinQAAgIAHAAICHAAQAHAAABAIIAAAdQgBAHgHAAIhhAAIAAAbIA6AAQAIAAgBAIIAAAYQABAIgIAAIg6AAIAABAQABAIgJAAg");
	this.shape_1.setTransform(1082.5,25.925);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AhFBcQgIAAABgIIAAinQgBgIAIAAICLAAQAHAAAAAIIAAAdQAAAHgHAAIhkAAIAAAbIA8AAQAIAAAAAIIAAAYQAAAIgIAAIg8AAIAAAcIBkAAQAHAAAAAHIAAAdQAAAIgHAAg");
	this.shape_2.setTransform(1064.6,25.925);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhSBcQgHAAAAgIIAAinQAAgIAHAAIBvAAQA9AAAABFIAAAuQAABEg9AAgAgrAwIBCAAQAKAAAFgEQAHgGgBgPIAAgtQAAgPgFgFQgFgFgLAAIhCAAg");
	this.shape_3.setTransform(1044.9,25.925);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.defi, new cjs.Rectangle(1032.3,0,102,43.6), null);


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
(lib._720x90 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(618.4,50.3,0.8323,0.8314,0,0,0,113.2,22.2);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(46).to({_off:false},0).to({scaleX:0.8336,scaleY:0.8315,x:618.55,alpha:0.9883},12).wait(182));

	// stroke_left
	this.instance_1 = new lib.STROKELEFT();
	this.instance_1.setTransform(-93.95,76.25,1,1,0,0,0,92.3,1.9);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(57).to({_off:false},0).to({x:186.1},20,cjs.Ease.circOut).wait(163));

	// logo_copy
	this.instance_2 = new lib.Tween3("synched",0);
	this.instance_2.setTransform(42.75,120.15,0.6473,0.6458,0,0,0,0.1,0.1);
	this.instance_2.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({scaleX:0.6405,scaleY:0.6382,x:46.25,y:139.35,alpha:1},8).wait(232));

	// has_arrived
	this.instance_3 = new lib.hasarrived();
	this.instance_3.setTransform(242.55,86.45,1,1,0,0,0,192.8,65.2);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(31).to({_off:false},0).to({x:-197.7},11,cjs.Ease.quintOut).wait(198));

	// white_bg
	this.instance_4 = new lib.whitebg_round();
	this.instance_4.setTransform(817.7,51.8,0.7757,0.7859,0,0,0,75.8,21.3);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(31).to({_off:false},0).to({x:436.1,y:52},11).wait(198));

	// For_bitcoin
	this.instance_5 = new lib.forbitcoin();
	this.instance_5.setTransform(928.5,66.7,1,1,0,0,0,192.8,65.2);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(18).to({_off:false},0).to({x:289.35},14,cjs.Ease.quintOut).wait(208));

	// Defi
	this.instance_6 = new lib.defi();
	this.instance_6.setTransform(-105.2,48.55,1,1,0,0,0,192.8,22.4);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(6).to({_off:false},0).to({x:-819.35},17,cjs.Ease.quintOut).wait(217));

	// pattern
	this.instance_7 = new lib.patternbg();
	this.instance_7.setTransform(591.8,166,1,1,0,0,0,433.8,317);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).to({regX:434.1,regY:316.9,scaleX:1.074,scaleY:1.074,rotation:-2.2179,x:604.05,y:146.15},239).wait(1));

	// bg
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("Eg5iAHnIAAvNMBzFAAAIAAPNg");
	this.shape.setTransform(365.15,45.05);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(240));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(74.9,-166.9,1007.6999999999999,671.4);
// library properties:
lib.properties = {
	id: '6C2532F589104630A12141E57F9B7546',
	width: 720,
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