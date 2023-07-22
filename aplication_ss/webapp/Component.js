/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "appss/aplicationss/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("appss.aplicationss.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                var oData = {
                    "dataGerencia":[
                        {"key":"1","name":"Fábrica"},
                        {"key":"2","name":"Administración"},
                        {"key":"3","name":"Instalaciones y equipo"},
                        {"key":"4","name":"Rutinarias, No Rutinarias y administrativas"}
                    ],
                    "dataTab":[
                        {"key":"1","name":"Fábrica"},
                        {"key":"2","name":"Administración"},
                        {"key":"3","name":"Instalaciones y equipo"},
                        {"key":"4","name":"Rutinarias, No Rutinarias y administrativas"}
                    ],
                    "dataCategoria":[
                        {"key":"A","name":"A","info":"Condición o práctica con potencial de causar incapacidad permanente, fatalidad y/o ocasionar perdida mayor y/o demoras en atención a levantamiento."},
                        {"key":"B","name":"B","info":"Condición o práctica con potencial de causar lesiones, enfermedad seria, ocasionando incapacidad temporal o daño a la propiedad"},
                        {"key":"C","name":"C","info":"Condición o práctica con potencial de causar lesión o enfermedad menor y/o daño a la propiedad no considerable"}
                    ],
                    "dataTipo":[
                        {"key":"1","name":"Condición"},
                        {"key":"2","name":"Acto"}
                    ],

                    "dataTipo":[
                        {"key":"1","name":"Condición"},
                        {"key":"2","name":"Acto"}
                    ],
                };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                this.setModel(oModel);
                this.setModel(oModel, "myParam"); 
            }
        });
    }
);