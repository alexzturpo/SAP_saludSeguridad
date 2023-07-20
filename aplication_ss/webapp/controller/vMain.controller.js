sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("appss.aplicationss.controller.vMain", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {

            },
            onSelectTab: function () {
                console.log("CLIC EN CELDA")
                this.getRouter().getTargets().display("vInspeccion");
            },
            addTrabajador: function () {
                this.getRouter().getTargets().display("vNewTrabajador");
            },
            onSelectTrabajador: function () {
                this.getRouter().getTargets().display("vTrabajador");
            },
        });
    });
