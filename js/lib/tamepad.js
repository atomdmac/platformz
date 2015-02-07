define(
[],
function() {


var browserGamepads;
var gamepads = {};
var gamepadTypes = ["Xbox 360"];
var connectMethod;


//
function addGamepad(gamepad) {
	for (var lcv = 0; lcv < gamepadTypes.length; lcv++) {
		if (gamepad.id.toLowerCase().indexOf(gamepadTypes[lcv].toLowerCase()) !== -1) {
			// Modify Gamepad object
			gamepad.type = gamepadTypes[lcv];
		}
	}
	if (!gamepad.type) { gamepad.type = "default"; }
	
	gamepads[gamepad.index] = gamepad;
	console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
	gamepad.index, gamepad.id,
	gamepad.buttons.length, gamepad.axes.length);
	
	console.log(gamepads);
}

function removeGamepad(gamepad) {
	delete gamepads[gamepad.index];
}

function connectHandler(e) {
	addGamepad(e.gamepad);
}

function disconnectHandler(e) {
	removeGamepad(e.gamepad);
}

function scanGamepads() {
	browserGamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
	for (var i = 0; i < browserGamepads.length; i++) {
		if (browserGamepads[i]) {
			if (!(browserGamepads[i].index in gamepads)) {
				addGamepad(browserGamepads[i]);
			} else {
				gamepads[browserGamepads[i].index] = browserGamepads[i];
			}
		}
	}
}

function setupGamepadSupport() {
	// Chrome doesn't implement Gamepad events (yet?).
	connectMethod = (navigator.webkitGetGamepads) ? "poll" : "event";
	
	if (connectMethod === "event") {
		window.addEventListener("gamepadconnected", connectHandler);
		window.addEventListener("gamepaddisconnected", disconnectHandler);
	}
}

function updateGamepads() {
	if (connectMethod === "poll") {
		scanGamepads();
	}
}

	
/** @private
 * Start listening for gamepads.
 */


setupGamepadSupport();


var Tamepad = function (gamepad) {
	// A unique name for this Tamepad instance.  Typically used by Tamepad.get()
	// to associate a human-readable name with a Tamepad instance.
	this.name = gamepad.id;

	this.inputMap = {
		"default": {
			"joysticks": {
				"left" : { x: 0, y: 1 },
				"right": { x: 2, y: 3 }
			}
		},
		"Xbox 360": {
			"joysticks": {
				"left" : { x: 0, y: 1 },
				"right": { x: 2, y: 3 }
			}
		}
	};
	
	// Account for inputs that are mapped incorrectly by the browser.
	if (navigator.userAgent.indexOf('Firefox') !== -1) {
		this.inputMap["Xbox 360"].joysticks = {
			"left" : { x: 1, y: 0 },
			"right": { x: 3, y: 2 }
		};
	}
	
	scanGamepads();
	
	// TODO: Register gamepad index with this Tamepad instance.
	this.gamepad = gamepad;
	
	this.buttonsPressedWithoutRepeat = {};
};

// A list of Tamepad instances that have been created via Tamepad.get().
Tamepad.instances = [];

/**
 * Retrieve a Tamepad with the given name.  If no such Tamepad exists AND there
 * are unused Gamepads available, a new Tamepad instance is created and returned.
 */
Tamepad.get = function (name) {
	var unusedGamepad, tamepad;

	// Refresh gamepad list.
	scanGamepads();

	// Search through current tamepad instances for one with the given name.
	for(var i=0; i<Tamepad.instances.length; i++) {
		// 1. If found, return the Tamepad instance. 
		if(Tamepad.instances[i].name == name) {
			return Tamepad.instances[i];
		}
	}
	
	// 2. If none found, make a new one with one of the available game pads.
	unusedGamepad = Tamepad.getUnusedGamepad();
	if(unusedGamepad) {
		tamepad = new Tamepad(unusedGamepad);
		tamepad.name = name;
		Tamepad.instances.push(tamepad);
		return tamepad;
	} else {
		return false;
	}
};

/**
 * Determine which connected Gamepads (if any) have not yet been associated with
 * a Tamepad instance.
 */
Tamepad.getUnusedGamepad = function () {
	for(var i in gamepads) {
		if(Tamepad.instances.indexOf(gamepads[i])=== -1) return gamepads[i];
	}
};

/**
 * Remove any Tamepad instances from the manager that have disconnected Gamepads
 * associated with them.
 */
Tamepad.prune = function () {
	for(var i=Tamepad.instances.length -1; i>=0; i--) {
		if(gamepads.indexOf(Tamepad.instances[i].gamepad) === -1) Tamepad.instances.splice(i, 1);
	}
};

/**
 * Poll Tamepad instances for input.
 */
Tamepad.prototype.update = function() {
	for (var btnKey in this.buttonsPressedWithoutRepeat) {
		if (!this.pressed(Number(btnKey))) {
			delete this.buttonsPressedWithoutRepeat[btnKey];
		}
	}
};

Tamepad.prototype.pressed = function(button) {
	updateGamepads();
	if(!this.gamepad) return false;
	if (typeof(this.gamepad.buttons[button]) == "object") {
		return this.gamepad.buttons[button].pressed;
	}
	return this.gamepad.buttons[button] == 1.0;
};

Tamepad.prototype.pressedWithoutRepeat = function(button) {
	// False if not pressed currently.
	if (!this.pressed(button)) {
		return false; 
	}
	// False if already in hash of pressed buttons.
	if (this.buttonsPressedWithoutRepeat[button]) {
		return false;
	}
	this.buttonsPressedWithoutRepeat[button] = true;
	return true;
};

Tamepad.prototype.readLeftJoystick = function () {
	return {
		x: this.gamepad.axes[0],
		y: this.gamepad.axes[1]
	};
};

Tamepad.prototype.readRightJoystick = function () {
	return {
		x: this.gamepad.axes[3],
		y: this.gamepad.axes[4]
	};
};

Tamepad.prototype.readJoystick = function(joystick) {
	updateGamepads();
	var mappings = this.inputMap[this.gamepad.type].joysticks[joystick];
	var analogX = this.gamepad.axes[mappings.x];
	var analogY = this.gamepad.axes[mappings.y];
	
	var angle = Math.atan2(analogX, analogY);
	var magnitude = Math.sqrt(analogX*analogX+analogY*analogY);
	
	return {
		analogX: analogX,
		analogY: analogY,
		angle: angle,
		magnitude: magnitude
	};
};

Tamepad.prototype.gamepads = gamepads;

return Tamepad;
});
