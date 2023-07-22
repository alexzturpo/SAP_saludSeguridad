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
            onSelectTbIncidente: function () {
                this.getRouter().getTargets().display("vIncidente");
            },
            // GESTION DE INCIDENTES
            newIncidente: function () {
                let newIncidenteForm = {
                    titulo: this.getView().byId("gi_new_titulo").getValue(),
                    descrip: this.getView().byId("gi_new_descrip").getValue(),
                    accionInmediata: this.getView().byId("gi_new_accionInmediata").getValue(),
                    
                    sociedad: this.getView().byId("gi_new_sociedad").getValue(),
                    ubicacion: this.getView().byId("gi_new_ubicacion").getValue(),
                    detalle: this.getView().byId("gi_new_detalle").getValue(),
                } 
                console.log("newIncidenteForm",newIncidenteForm)
            },

        });
    });
