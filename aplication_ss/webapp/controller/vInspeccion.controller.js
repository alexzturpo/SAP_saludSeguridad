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
            // funciones generales para los input con fragment
            dialogsSearch: function (oEvent,arrSearch,sValue) { 
                let comFil = []; 
                for (const objeto of arrSearch) { 
                    let oFilter = new sap.ui.model.Filter (objeto.atr, sap.ui.model.FilterOperator.Contains, sValue);
                    comFil.push(oFilter);
                } 
                // console.log("comFil",comFil);
                var oFilter = new sap.ui.model.Filter({
                    filters: comFil,
                    and: false
                });
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            dialogGetValueClose: function (oEvent,idInput) {
                let sDescription, oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) { return } 
                sDescription = oSelectedItem.getDescription(); 
                // this.byId(idInput).setValue(sDescription); 
                this.getView().byId(idInput).setValue(sDescription); 
            }, 
            //input gerencia
            changeZSYSO_GERENCIA: function () { this._dgGerencia().open() },
            _dgGerencia: function () { 
                var e = this.getView();
                if (!this.dgGerencia) {
                    this.dgGerencia = sap.ui.xmlfragment("idDgInputGerencia", "appss.aplicationss.view.fragments.dgInputGerencia", this)
                }
                e.addDependent(this.dgGerencia);
                return this.dgGerencia 
            },
            dgSearchGerencia: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                // console.log("sValue",sValue)
                let arrSearch = [
                    {atr:"ZGERENCIA"},
                    {atr:"ZDESCRIPCION"}
                ] 
                this.dialogsSearch(oEvent,arrSearch,sValue)
            }, 
            dgGetCloseGerencia: function (oEvent) {
                let idInput = "gInsp_gerencia"
                this.dialogGetValueClose(oEvent,idInput)
            },
            //input area
            changeZSYSO_AREA: function () { this._dgArea().open() },
            _dgArea: function () { 
                var e = this.getView();
                if (!this.dgArea) {
                    this.dgArea = sap.ui.xmlfragment("idDgInputArea", "appss.aplicationss.view.fragments.dgInputArea", this)
                }
                e.addDependent(this.dgArea);
                return this.dgArea 
            },
            dgSearchArea: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                // console.log("sValue",sValue)
                let arrSearch = [
                    {atr:"ZAREA"},
                    {atr:"ZDESCRIPCION"}
                ] 
                this.dialogsSearch(oEvent,arrSearch,sValue)
            }, 
            dgGetCloseArea: function (oEvent) {
                let idInput = "gInsp_area"
                this.dialogGetValueClose(oEvent,idInput)
            },
            //input departamento
            changeZSYSO_DPTO: function () { this._dgDtpo().open() },
            _dgDtpo: function () { 
                var e = this.getView();
                if (!this.dgDtpo) {
                    this.dgDtpo = sap.ui.xmlfragment("idDgInputDtpo", "appss.aplicationss.view.fragments.dgInputDtpo", this)
                }
                e.addDependent(this.dgDtpo);
                return this.dgDtpo 
            },
            dgSearchDtpo: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                // console.log("sValue",sValue)
                let arrSearch = [
                    {atr:"ZDPTO"},
                    {atr:"ZDESCRIPCION"}
                ] 
                this.dialogsSearch(oEvent,arrSearch,sValue)
            }, 
            dgGetCloseDtpo: function (oEvent) {
                let idInput = "gInsp_departamento"
                this.dialogGetValueClose(oEvent,idInput)
            },

            onPageBack : function () {  
                this.getRouter().getTargets().display("TargetvMain");
            },
            //actualizar el registro inspeccion seleccionado
            updateInspeccion: function () {
                var oModel = this.getView().getModel("myParam");  
                let tempInspeccion = oModel.getProperty("/tempInspecciones");
                let listInspeccion = oModel.getProperty("/ZSYSO_INSPECCION");
                let objInspeccion = { 
                    ZINSPECCION: this.getView().byId("gInsp_codInsp").getValue(),
                    ZGERENCIA: this.getView().byId("gInsp_gerencia").getValue(),
                    ZAREA: this.getView().byId("gInsp_area").getValue(),
                    ZDPTO: this.getView().byId("gInsp_departamento").getValue(),
                    ZFEC_PROGRAM: this.cambiarFormatoFecha(this.getView().byId("gInsp_programada").getValue()),
                    // afectado: "",
                    // ZESTADO: "pendiente",
                    ZCATEGORIA: this.getView().byId("gInsp_categoria").getSelectedKey(),
                    ZTIPO: this.getView().byId("gInsp_tipo").getSelectedKey(),

                    ZFEC_REAL: this.cambiarFormatoFecha(this.getView().byId("gInsp_fechaReal").getValue()),
                    ZHOR_REAL: this.getView().byId("gInsp_horaReal").getValue(),
                    ZACTO: this.getView().byId("gInsp_actoI").getValue(),
                    ZCONDICION: this.getView().byId("gInsp_condicionI").getValue(),
                    ZHALLAZGO: this.getView().byId("gInsp_descHallazgo").getValue(),
                    ZACCIONES: this.getView().byId("gInsp_accTomada").getValue(),
                    ZRECOMENDACION: this.getView().byId("gInsp_recomendacion").getValue(),
                    ZUBICACION: this.getView().byId("gInsp_ubicacion").getValue(),

                    ZCAUSAS: this.getView().byId("gInsp_desCausaOrigen").getValue()
                }
                
                let newListInspeccion= this.updateKey(listInspeccion,objInspeccion,tempInspeccion.ZINSPECCION) // datos ficticion
                // console.log("newListInspeccion",newListInspeccion) 
                oModel.setProperty("/listInspeccion",newListInspeccion); 
                // logica para actualizar la inspeccion 
                
                this.onPageBack()
            },
            updateKey: function (miArray,nuevoObjeto,codigoBuscado) {  
                // console.log("updateKey EDITADO",miArray,nuevoObjeto,codigoBuscado) 
                for (var i = 0; i < miArray.length; i++) { 
                    if (miArray[i].ZINSPECCION == codigoBuscado) {
                      miArray[i] = nuevoObjeto; // Reemplazar el objeto si tiene el mismo código 
                    }
                  }
                return miArray
            },
            //FUNCIONES DE PERSONAL INVOLUCRADO INSPECCIONES 
            addPerInvolucrado: function () {  
                this.getView().byId("panelPerInvolucrado").setVisible(true)
            },
            cancelPerInvolucrado: function () {  
                this.getView().byId("panelPerInvolucrado").setVisible(false)
            },
            savePerInvolucrado: function () {  
                let oModel = this.getView().getModel("myParam"); 
                let listPerInvolucrados = oModel.getProperty("/tabPerInvolucrados");
                //guardar persona involucrada
                let objPerInv = { 
                    ZID_TRAB_LAREDO: this.getView().byId("perInv_codTrab").getValue(), 
                    ZAPELLIDO_NOMBRE: this.getView().byId("perInv_fullName").getValue(), 
                    ZDNI: this.getView().byId("perInv_dni").getValue(),
                    ZPROVEEDOR: this.getView().byId("perInv_contratista").getValue(),
                    ZPUESTO: this.getView().byId("perInv_puestoTrb").getValue()
                }
                listPerInvolucrados.push(objPerInv)
                console.log("listPerInvolucrados",listPerInvolucrados)
                oModel.setProperty("/tabPerInvolucrados",listPerInvolucrados); 

                this.getView().byId("panelPerInvolucrado").setVisible(false) // ocultar panel
                let objPerInvClean = {  //limpiar formulario
                    codTrab: "perInv_codTrab",
                    fullName: "perInv_fullName",
                    dni: "perInv_dni",
                    contratista: "perInv_contratista",
                    puestoTrb: "perInv_puestoTrb"
                }
                this.limpiarObjeto(objPerInvClean)

            },
            deletePerInvolucrado : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/tabPerInvolucrados");

                var oTable = this.getView().byId("tablePersInvolucrado");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length) {
                    dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/tabPerInvolucrados",dataTable);
                    console.log("Registro eliminado.");
                }else {
                console.log("Índice inválido, no se eliminó ningún registro.");
                }
            },

            limpiarObjeto: function (objeto) {  
                for (var propiedad in objeto) {
                    if (objeto.hasOwnProperty(propiedad)) {
                        this.getView().byId(objeto[propiedad]).setValue("") 
                    }
                  }
            },
            //FUNCIONES DE RIESGOS ASOCIADOS INSPECCIONES 
            addPerInvolucrado: function () {  
                this.getView().byId("panelPerInvolucrado").setVisible(true)
            },
            cancelPerInvolucrado: function () {  
                this.getView().byId("panelPerInvolucrado").setVisible(false)
            },
            savePerInvolucrado: function () {  
                let oModel = this.getView().getModel("myParam"); 
                let listPerInvolucrados = oModel.getProperty("/tabPerInvolucrados");
                //guardar persona involucrada
                let objPerInv = { 
                    ZID_TRAB_LAREDO: this.getView().byId("perInv_codTrab").getValue(), 
                    ZAPELLIDO_NOMBRE: this.getView().byId("perInv_fullName").getValue(), 
                    ZDNI: this.getView().byId("perInv_dni").getValue(),
                    ZPROVEEDOR: this.getView().byId("perInv_contratista").getValue(),
                    ZPUESTO: this.getView().byId("perInv_puestoTrb").getValue()
                }
                listPerInvolucrados.push(objPerInv)
                console.log("listPerInvolucrados",listPerInvolucrados)
                oModel.setProperty("/tabPerInvolucrados",listPerInvolucrados); 

                this.getView().byId("panelPerInvolucrado").setVisible(false) // ocultar panel
                let objPerInvClean = {  //limpiar formulario
                    codTrab: "perInv_codTrab",
                    fullName: "perInv_fullName",
                    dni: "perInv_dni",
                    contratista: "perInv_contratista",
                    puestoTrb: "perInv_puestoTrb"
                }
                this.limpiarObjeto(objPerInvClean)

            },
            deletePerInvolucrado : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/tabPerInvolucrados");

                var oTable = this.getView().byId("tablePersInvolucrado");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length) {
                    dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/tabPerInvolucrados",dataTable);
                    console.log("Registro eliminado.");
                }else {
                console.log("Índice inválido, no se eliminó ningún registro.");
                }
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
