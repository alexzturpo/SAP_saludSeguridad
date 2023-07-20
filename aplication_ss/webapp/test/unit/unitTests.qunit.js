/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"appss/aplication_ss/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
