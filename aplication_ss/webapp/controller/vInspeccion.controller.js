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

                    fechaReal: this.getView().byId("gInsp_fechaReal").getValue(),
                    horaReal: this.getView().byId("gInsp_horaReal").getValue(),
                    actoI: this.getView().byId("gInsp_actoI").getValue(),
                    condicionI: this.getView().byId("gInsp_condicionI").getValue(),
                    descHallazgo: this.getView().byId("gInsp_descHallazgo").getValue(),
                    accTomada: this.getView().byId("gInsp_accTomada").getValue(),
                    recomendacion: this.getView().byId("gInsp_recomendacion").getValue(),
                    ubicacion: this.getView().byId("gInsp_ubicacion").getValue(),

                    desCausaOrigen: this.getView().byId("gInsp_desCausaOrigen").getValue()
                }
                
                let newListInspeccion= this.updateKey(listInspeccion,objInspeccion,tempInspeccion.codInsp)
                // console.log("newListInspeccion",newListInspeccion) 
                oModel.setProperty("/listInspeccion",newListInspeccion); 
                this.onPageBack()
            },
            updateKey: function (miArray,nuevoObjeto,codigoBuscado) {  
                // console.log("updateKey EDITADO",miArray,nuevoObjeto,codigoBuscado) 
                for (var i = 0; i < miArray.length; i++) { 
                    if (miArray[i].codInsp == codigoBuscado) {
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
                    codTrab: this.getView().byId("perInv_codTrab").getValue(), 
                    fullName: this.getView().byId("perInv_fullName").getValue(), 
                    dni: this.getView().byId("perInv_dni").getValue(),
                    contratista: this.getView().byId("perInv_contratista").getValue(),
                    puestoTrb: this.getView().byId("perInv_puestoTrb").getValue()
                }
                listPerInvolucrados.push(objPerInv)
                oModel.setProperty("/tabPerInvolucrados",listPerInvolucrados); 

                this.getView().byId("panelPerInvolucrado").setVisible(false)
                let objPerInvClean = { 
                    codTrab: "perInv_codTrab",
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
                let listRiAsociados = oModel.getProperty("/tabRiAsociados");
                let objRiAsoc = { 
                    conInsegura: this.getView().byId("riAsoc_conInsegura").getValue(), 
                    riesgo: this.getView().byId("riAsoc_riesgo").getValue(),
                    consecuencia: this.getView().byId("riAsoc_consecuencia").getValue(),
                    nivelRiesgo: this.getView().byId("riAsoc_nivelRiesgo").getValue(),
                    file: this.getView().byId("riAsoc_file").getValue()
                }
                console.log("objRiAsoc",objRiAsoc)
                listRiAsociados.push(objRiAsoc)
                oModel.setProperty("/tabRiAsociados",listRiAsociados); 

                this.getView().byId("panelRiAsociados").setVisible(false)
                let objRiAsocClean = { 
                    conInsegura: "riAsoc_conInsegura",
                    riesgo: "riAsoc_riesgo",
                    consecuencia: "riAsoc_consecuencia",
                    nivelRiesgo: "riAsoc_nivelRiesgo",
                    file: "riAsoc_file"
                }
                this.limpiarObjeto(objRiAsocClean)
            },

            addMedCorrectiva: function () {  
                this.getView().byId("panelMedCorrectiva").setVisible(true)
            },
            cancelMedCorrectiva: function () {  
                this.getView().byId("panelMedCorrectiva").setVisible(false)
            },
            saveMedCorrectiva: function () {  
                let oModel = this.getView().getModel("myParam"); 
                let listMedCorrectiva = oModel.getProperty("/tabMedCorrectiva");
                let objMedCor= { 
                    descrip: this.getView().byId("medCor_descrip").getValue(), 
                    responsable: this.getView().byId("medCor_responsable").getValue(),
                    fechaEjc: this.getView().byId("medCor_fechaEjc").getValue(),
                    estadoAccCor: this.getView().byId("medCor_estadoAccCor").getSelectedKey()
                }
                listMedCorrectiva.push(objMedCor)
                oModel.setProperty("/tabMedCorrectiva",listMedCorrectiva); 

                this.getView().byId("panelMedCorrectiva").setVisible(false)
                let objRiAsocClean = { 
                    descrip: "medCor_descrip",
                    responsable: "medCor_responsable",
                    fechaEjc: "medCor_fechaEjc",
                    estadoAccCor: "medCor_estadoAccCor"
                }
                this.limpiarObjeto(objRiAsocClean)
            },
            keyValorEstadoAccionCorrectiva: function (key,lista) { 
                if(key){
                    // console.log("keyValor key",key) 
                    let valorF 
                    // console.log("lista",lista) 
                    for (var i = 0; i < lista.length; i++) { 
                        // console.log("for keyValor",lista[i] )
                        if (lista[i].key == key) {
                            valorF = lista[i].state;
                        }
                      }
                    return valorF
                }
            },

            addResponsables: function () {  
                this.getView().byId("panelResponsables").setVisible(true)
            },
            cancelResponsables: function () {  
                this.getView().byId("panelResponsables").setVisible(false)
            },
            saveResponsables: function () {  
                let oModel = this.getView().getModel("myParam"); 
                let listResp = oModel.getProperty("/tabResponsables");
                let objResp= { 
                    nombre: this.getView().byId("responsable_nombre").getValue(), 
                    cargo: this.getView().byId("responsable_cargo").getValue(),
                    fecha: this.cambiarFormatoFecha(this.getView().byId("responsable_fecha").getValue()), 
                }
                console.log("objResp",objResp)
                listResp.push(objResp)
                oModel.setProperty("/tabResponsables",listResp); 

                this.getView().byId("panelResponsables").setVisible(false)
                let objRespClean = { 
                    nombre: "responsable_nombre",
                    cargo: "responsable_cargo",
                    fecha: "responsable_fecha"
                }
                this.limpiarObjeto(objRespClean)
            },
            cambiarFormatoFecha: function (fecha) {  
                var partesFecha = fecha.split('/');
                var mes = partesFecha[0];
                var dia = partesFecha[1];
                var anio = partesFecha[2];
              
                // Obtener el año actual (solo los últimos dos dígitos)
                var anioActual = new Date().getFullYear().toString().slice(-2);
              
                // Agregar el siglo al año
                var siglo = (anio <= anioActual) ? '20' : '19';
                anio = siglo + anio;
              
                // Asegurarse de que el día y mes tengan dos dígitos
                dia = (dia.length === 1) ? '0' + dia : dia;
                mes = (mes.length === 1) ? '0' + mes : mes;
              
                // Combinar los elementos en el nuevo formato de fecha
                var nuevaFecha = dia + '/' + mes + '/' + anio;
              
                return nuevaFecha; 
            },
            
        });
    });
