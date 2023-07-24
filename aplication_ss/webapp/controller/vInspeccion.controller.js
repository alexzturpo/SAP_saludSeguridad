sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("appss.aplicationss.controller.vInspeccion", {
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
            updateInspeccion: function () {
                var oModel = this.getView().getModel("myParam");  
                let tempInspeccion = oModel.getProperty("/tempInspecciones");
                let listInspeccion = oModel.getProperty("/listInspeccion");
                let objInspeccion = { 
                    codInsp: this.getView().byId("gInsp_codInsp").getValue(),
                    gerencia: this.getView().byId("gInsp_gerencia").getSelectedKey(),
                    area: this.getView().byId("gInsp_area").getValue(),
                    departamento: this.getView().byId("gInsp_departamento").getValue(),
                    fechaP: this.getView().byId("gInsp_programada").getValue(),
                    afectado: "",
                    status: "pendiente",
                    categoria: this.getView().byId("gInsp_categoria").getSelectedKey(),
                    tipo: this.getView().byId("gInsp_tipo").getSelectedKey(),

                    fechaReal: this.getView().byId("gInsp_tipo").getSelectedKey(),
                    horaReal: this.getView().byId("gInsp_tipo").getSelectedKey(),
                    actoI: this.getView().byId("gInsp_tipo").getSelectedKey(),
                    condicionI: this.getView().byId("gInsp_tipo").getSelectedKey(),
                    descHallazgo: this.getView().byId("gInsp_tipo").getSelectedKey(),
                    accTomada: this.getView().byId("gInsp_tipo").getSelectedKey(),
                    recomendacion: this.getView().byId("gInsp_tipo").getSelectedKey(),
                    ubicacion: this.getView().byId("gInsp_tipo").getSelectedKey(),
                }
                console.log("objInspeccion",objInspeccion) 
                let newListInspeccion= this.updateKey(listInspeccion,objInspeccion,tempInspeccion.codInsp)
                console.log("newListInspeccion",newListInspeccion) 
                oModel.setProperty("/listInspeccion",newListInspeccion); 
                this.onPageBack()
            },
            updateKey: function (miArray,nuevoObjeto,codigoBuscado) {  
                for (var i = 0; i < miArray.length; i++) {
                    if (miArray[i].codigo === codigoBuscado) {
                      miArray[i] = nuevoObjeto; // Reemplazar el objeto si tiene el mismo código
                    }
                  }
                return miArray
            },
            addPerInvolucrado: function () {  
                this.getView().byId("panelPerInvolucrado").setVisible(true)
            },
            cancelPerInvolucrado: function () {  
                this.getView().byId("panelPerInvolucrado").setVisible(false)
            },
            savePerInvolucrado: function () {  
                let oModel = this.getView().getModel("myParam"); 
                let listPerInvolucrados = oModel.getProperty("/tabPerInvolucrados");
                let objPerInv = { 
                    fullName: this.getView().byId("perInv_fullName").getValue(), 
                    dni: this.getView().byId("perInv_dni").getValue(),
                    contratista: this.getView().byId("perInv_contratista").getValue(),
                    puestoTrb: this.getView().byId("perInv_puestoTrb").getValue()
                }
                listPerInvolucrados.push(objPerInv)
                oModel.setProperty("/tabPerInvolucrados",listPerInvolucrados); 

                this.getView().byId("panelPerInvolucrado").setVisible(false)
                let objPerInvClean = { 
                    fullName: "perInv_fullName",
                    dni: "perInv_dni",
                    contratista: "perInv_contratista",
                    puestoTrb: "perInv_puestoTrb"
                }
                this.limpiarObjeto(objPerInvClean)
            },
            limpiarObjeto: function (objeto) {  
                for (var propiedad in objeto) {
                    if (objeto.hasOwnProperty(propiedad)) {
                        this.getView().byId(objeto[propiedad]).setValue("") 
                    }
                  }
            },
            addRiAsociados: function () {  
                this.getView().byId("panelRiAsociados").setVisible(true)
            },
            cancelRiAsociados: function () {  
                this.getView().byId("panelRiAsociados").setVisible(false)
            },
            saveRiAsociados: function () {  
                let oModel = this.getView().getModel("myParam"); 
                let listPerInvolucrados = oModel.getProperty("/tabPerInvolucrados");
                let objPerInv = { 
                    fullName: this.getView().byId("perInv_fullName").getValue(), 
                    dni: this.getView().byId("perInv_dni").getValue(),
                    contratista: this.getView().byId("perInv_contratista").getValue(),
                    puestoTrb: this.getView().byId("perInv_puestoTrb").getValue()
                }
                listPerInvolucrados.push(objPerInv)
                oModel.setProperty("/tabPerInvolucrados",listPerInvolucrados); 

                this.getView().byId("panelRiAsociados").setVisible(false)
                let objPerInvClean = { 
                    fullName: "perInv_fullName",
                    dni: "perInv_dni",
                    contratista: "perInv_contratista",
                    puestoTrb: "perInv_puestoTrb"
                }
                this.limpiarObjeto(objPerInvClean)
            },

            
        });
    });
