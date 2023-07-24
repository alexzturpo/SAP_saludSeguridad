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
            },
            updateKey: function (miArray,nuevoObjeto,codigoBuscado) {  
                for (var i = 0; i < miArray.length; i++) {
                    if (miArray[i].codigo === codigoBuscado) {
                      miArray[i] = nuevoObjeto; // Reemplazar el objeto si tiene el mismo código
                    }
                  }
                return miArray
            },
            
            updateIncidente: function () {
                let oModel = this.getView().getModel("myParam");  
                let selectIncidente = oModel.getProperty("/selectIncidente"); 
                let listIncidente = oModel.getProperty("/listIncidente"); 
                let incidenteFormUpdate = {
                    numIns: selectIncidente.numIns,
                    titulo: this.getView().byId("gi_new_titulo").getValue(),
                    descrip: this.getView().byId("gi_new_descrip").getValue(),
                    accionInmediata: this.getView().byId("gi_new_accionInmediata").getValue(),
                    
                    sociedad: this.getView().byId("gi_new_sociedad").getValue(),
                    ubicacion: this.getView().byId("gi_new_ubicacion").getValue(),
                    detalle: this.getView().byId("gi_new_detalle").getValue(),
                    invPreliminar: this.getView().byId("gi_new_invPreliminar").getValue(),

                    fecha: this.getView().byId("gi_new_fecha").getValue(),
                    hora: this.getView().byId("gi_new_hora").getValue(),
                    
                    afectado: {
                        codEmpleado: this.getView().byId("gi_new_codEmp").getValue(),
                        nombreEmp: this.getView().byId("gi_new_nombreEmp").getValue(),
                        apellidoEmp: this.getView().byId("gi_new_apellidoEmp").getValue(),
                        dniEmp: this.getView().byId("gi_new_dniEmp").getValue(),
                        areaTrabajoEmp: this.getView().byId("gi_new_areaTrabajoEmp").getValue(),
                    },
                    testigo: {
                        codEmpleado: this.getView().byId("gi_new_codEmpTest").getValue(),
                        nombreEmp: this.getView().byId("gi_new_nombreEmpTest").getValue(),
                        apellidoEmp: this.getView().byId("gi_new_apellidoEmpTest").getValue(),
                        dniEmp: this.getView().byId("gi_new_dniEmpTest").getValue(),
                        areaTrabajoEmp: this.getView().byId("gi_new_areaTrabajoEmpTest").getValue(),
                        detalleEmp: this.getView().byId("gi_new_detalleEmpTest").getValue(),
                    },
                    status: "Pendiente"
                }
                let newListIncidente= this.updateKey(listIncidente,incidenteFormUpdate,selectIncidente.numIns)
                console.log("UPDATE",newListIncidente)
                oModel.setProperty("/listIncidente",newListIncidente);
                this.onPageBack();
            },
            
        });
    });
