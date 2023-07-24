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
                    "datanewtrabajador":{
                        "idcodigoAC":"",
                        "idapellidoAC":"",
                        "idnombreAC":"",
                        "idAreaAC":"",
                        "idPuestoAC":"",
                    },  
                    "dataContratistafilter":[],
                    "dataContratista":[
                        {"key":"1","keycontract":"","sociedad":"1001","name":"Juan","apellido":"Ugarte","area":"RRHH","puesto":"analista","DNI":"75612345","ACTIVO":"SI"},
                        {"key":"2","keycontract":"","sociedad":"1001","name":"Pedro","apellido":"Torres","area":"RRHH","puesto":"consultor","DNI":"78952463","ACTIVO":"SI"},
                        {"key":"3","keycontract":"","sociedad":"1001","name":"Mario","apellido":"Tapia","area":"RRHH","puesto":"contador","DNI":"85296341","ACTIVO":"SI"},
                        {"key":"4","keycontract":"","sociedad":"1001","name":"Jose","apellido":"Diaz","area":"RRHH","puesto":"personal","DNI":"96385274","ACTIVO":"SI"},
                    ],
                    "dataInduccionfilter":[],
                    "dataInduccion":[
                        {"keyinduc":"1","sociedad":"1001","titulo":"Capacitacion enero","descrip":"programa modulo 1","fechaprog":"22/07/2023","tipoinducc":"General","status":"vigente"},
                        {"keyinduc":"2","sociedad":"1001","titulo":"Capacitacion marzo","descrip":"programa modulo 2","fechaprog":"22/07/2023","tipoinducc":"General","status":"vigente"},
                        {"keyinduc":"3","sociedad":"1001","titulo":"Capacitacion abril","descrip":"programa modulo 3","fechaprog":"22/07/2023","tipoinducc":"General","status":"vigente"},
                        {"keyinduc":"4","sociedad":"1001","titulo":"Capacitacion mayo","descrip":"programa modulo 4","fechaprog":"22/07/2023","tipoinducc":"General","status":"vigente"},
                    ],
                    "dataAsistenteInd":{},
                    "dataAsistenteIndNotas":{},
                    "dataasistentesInduccion":[
                        {"keyinduc":"1","key":"1","nota":"11","anexo":"doc1"},
                        {"keyinduc":"1","key":"2","nota":"12","anexo":"doc2"},
                        {"keyinduc":"1","key":"3","nota":"13","anexo":"doc3"},
                        {"keyinduc":"1","key":"4","nota":"14","anexo":"doc4"},
                    ],
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
                    "listIncidente":[
                        {"numIns":"0001","titulo":"holaMundo","afectado":{"codEmpleado":"01"},"testigo":{"codEmpleado":""},"fecha":"01/10/2022","status":"pendiente"},
                        {"numIns":"0002","titulo":"holaMundoFin","fecha":"03/03/2023","status":"completo","afectado":{"codEmpleado":"02"}},
                    ],
                    "listInspeccion":[
                        {"codInsp":"888","gerencia":"1","area":"area1","departamento":"depa1","fechaP":"01/10/2023","afectado":"","status":"pendiente","categoria":"","tipo":""},
                        {"codInsp":"777","gerencia":"2","area":"area2","departamento":"depa2","fechaP":"01/09/2023","afectado":"","status":"completo","categoria":"","tipo":""},
                    ],
                    "tabPerInvolucrados":[],
                    
                };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                this.setModel(oModel);
                this.setModel(oModel, "myParam"); 
            }
        });
    }
);