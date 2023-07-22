sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("appss.aplicationss.controller.vIncidente", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {

            },
            // onPageBack: function () {
            //     console.log("CLIC EN CELDA")
            // },
            onPageBack : function () {  
                this.getRouter().getTargets().display("TargetvMain");
            }
            
        });
    });
