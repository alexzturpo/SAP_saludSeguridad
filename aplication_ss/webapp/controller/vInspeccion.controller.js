sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,MessageToast) {
        "use strict";
        var usuario = "CONSULT_MM";
        var password = "Laredo2023**";
        var url_ini = "";
        return Controller.extend("appss.aplicationss.controller.vInspeccion", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {
                
            }, 
            onAfterRendering: function () {
                this.validarEdicion()
            },
            validarEdicion:async function () {
                let oModel = this.getView().getModel("myParam");  
                let inspecion = oModel.getProperty("/tempInspecciones");
                console.log("inspecion",inspecion)
                // debugger
                if(inspecion.ZESTADO == "F"){
                    this.getView().byId("btnSaveIns").setVisible(false)

                    this.getView().byId("addPer").setVisible(false)
                    this.getView().byId("editPer").setVisible(false)
                    this.getView().byId("deletePer").setVisible(false)

                    this.getView().byId("addRisA").setVisible(false)
                    this.getView().byId("editRisA").setVisible(false)
                    this.getView().byId("deleteRisA").setVisible(false)

                    this.getView().byId("addMed").setVisible(false)
                    this.getView().byId("editMed").setVisible(false)
                    this.getView().byId("deleteMed").setVisible(false)

                    this.getView().byId("addRes").setVisible(false)
                    this.getView().byId("editRes").setVisible(false)
                    this.getView().byId("deleteRes").setVisible(false)
                }

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
                this.getView().byId(`${idInput}Text`).setValue(sDescription); 
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
            handleLinkPress:function(oEvent){
                //var oSelectedItem = oEvent.getSource();
                //var oContext = oSelectedItem.getBindingContext();
                var oSelectedItem = oEvent.oSource.mProperties.text;       
                var filename = "testt.pdf";//oContext.getObject().nombre;
                var uri = "/dms/testt.pdf";// + filename;
                var link = document.createElement("a");
                link.download = oSelectedItem;
                link.href = uri;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            onPageBack : function () {  
                this.getRouter().getTargets().display("TargetvMain");
            },
            //actualizar el registro inspeccion seleccionado
            updateInspeccion:async function () {
                let typeMsm = "information",
                    titleMsm = "¿Deseas continuar?"
                let ok = await this.MessageBoxPress(typeMsm,titleMsm)
                if(ok){
                    var oModel = this.getView().getModel("myParam");  
                    let selectInspeccion = oModel.getProperty("/tempInspecciones");
                    let estadoInspec = selectInspeccion.ZESTADO
                    //LOGICA PARA VERIFICAR SI TODAS LA MEDIDADAS CORRECTIVAS ESTAN CUMPLICAS
                    let resValidacion = this.validarMedidasCompletas()
                    if(resValidacion){
                        let typeMsm2 = "success",
                            titleMsm2 = "Cambio de estado de la inspección a LIBERADO, Todas las acciones correctivas estan completadas."
                        let ok = await this.MessageBoxPress(typeMsm2,titleMsm2)
                        if(ok){
                            estadoInspec = 'F'
                            // MessageToast.show("Inspeccion liberada")
                        }else{ MessageToast.show("Solicitud cancelada, Realice los cambios necesario.") }
                    }
                    
                    // let listInspeccion = oModel.getProperty("/ZSYSO_INSPECCION");
                    //obtener tablas para enviar la acctualizacion 
                    let  tabPerInvolucrados = oModel.getProperty("/tabPerInvolucrados");
                    console.log("tabPerInvolucrados",tabPerInvolucrados)
                    let  tabRiAsociados = oModel.getProperty("/tabRiAsociados");
                    console.log("tabRiAsociados",tabRiAsociados)
                    let  tabMedCorrectiva = oModel.getProperty("/tabMedCorrectiva");
                    console.log("tabMedCorrectiva",tabMedCorrectiva)
                    let  tabResponsables  = oModel.getProperty("/tabResponsables");
                    console.log("tabResponsables",tabResponsables)
    
                    let objInspeccion = {
                    "cabecera": { 
                        ZINSPECCION: this.getView().byId("gInsp_codInsp").getValue(),
                        ZGERENCIA: this.getView().byId("gInsp_gerencia").getValue(),
                        ZAREA: this.getView().byId("gInsp_area").getValue(),
                        ZDPTO: this.getView().byId("gInsp_departamento").getValue(),
                        ZFEC_PROGRAM: this.cambiarFormatoFecha(this.getView().byId("gInsp_programada").getValue()),
    
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
    
                        ZCAUSAS: this.getView().byId("gInsp_desCausaOrigen").getValue(),
                        ZESTADO: estadoInspec
                    },
                    
                    "detalle": tabPerInvolucrados,
                    "detalle1": tabRiAsociados,
                    "detalle2": tabMedCorrectiva,
                    "detalle3": tabResponsables
                    }
                    console.log("objInspeccion",objInspeccion) 
                    // debugger
                    var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/UPD_INSP/1000/0/${selectInspeccion.ZINSPECCION}/0/0/0/0?sap-client=120`;
                    var dataRes = this.f_PostJsonData(url, objInspeccion) // actualizar inspeccion cabecera y tablas involucrados asociados correctiva responsable
                    console.log("dataRes",dataRes)
                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error en la solicitud");
                    }else{
                        await this.MessageBoxPressOneOption("success",`Cambios realizados`)
                        MessageToast.show("Solicitud exitosa");  
                        this.onPageBack()
                    } 

                }else{ MessageToast.show("Solicitud cancelada") }
            },
            validarMedidasCompletas: function () { 
                var oModel = this.getView().getModel("myParam");  
                let tabMedCorrectiva = oModel.getProperty("/tabMedCorrectiva");
                let validacion = true
                for (let med of tabMedCorrectiva) { 
                    // debugger
                    if(med.ZESTADO !== 'C') validacion = false 
                }
                return validacion
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
                this.getView().byId("panelPerInvolucradoEdit").setVisible(false)
                let objPerInvClean = {  //limpiar formulario
                    codTrab: "perInv_codTrab",
                    fullName: "perInv_fullName",
                    dni: "perInv_dni",
                    contratista: "perInv_contratista",
                    puestoTrb: "perInv_puestoTrb"
                }
                this.limpiarObjeto(objPerInvClean)

                let objPerInvCleanEdit = {  //limpiar formulario
                    codTrab: "edit_perInv_codTrab",
                    fullName: "edit_perInv_fullName",
                    dni: "edit_perInv_dni",
                    contratista: "edit_perInv_contratista",
                    puestoTrb: "edit_perInv_puestoTrb"
                }
                this.limpiarObjeto(objPerInvCleanEdit)
            },
            editPerInvolucrado: function () {  
                let oModel = this.getView().getModel("myParam");  
                let varTemEdit = "/temEditInvolucrado"
                let varTemEditId = "/temEditInvolucradoId"
                let varTabaLista = "/tabPerInvolucrados"
                let varIdTabla = "tablePersInvolucrado"
                let tableList = oModel.getProperty(varTabaLista); 
                
                var oTable = this.getView().byId(varIdTabla);
                var indiceEdit = oTable.getSelectedIndices();
                if (indiceEdit >= 0 && indiceEdit < tableList.length && tableList[indiceEdit] != undefined) {
                    // if (indiceEdit >= 0) {
                    this.getView().byId("panelPerInvolucradoEdit").setVisible(true) 
                    console.log("Registro A EDITAR.",tableList[indiceEdit]);
                    oModel.setProperty(varTemEdit,tableList[indiceEdit]); 
                    oModel.setProperty(varTemEditId,indiceEdit); 
                } else {MessageToast.show("Seleccione un registro")}  
            },
            saveEditPerInvolucrado: function () {  
                // let varTemEdit = "/temEditAcciones"
                let varTemEditId = "/temEditInvolucradoId"
                let varTabaLista = "/tabPerInvolucrados"
                // let varIdTabla = "tableAccionesInforme"

                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty(varTabaLista);
                let tempEditId = oModel.getProperty(varTemEditId);
                // console.log("saveEditAcciones list init",list)
                let obj = { 
                    ZID_TRAB_LAREDO: this.getView().byId("edit_perInv_codTrab").getValue(), 
                    ZAPELLIDO_NOMBRE: this.getView().byId("edit_perInv_fullName").getValue(), 
                    ZDNI: this.getView().byId("edit_perInv_dni").getValue(),
                    ZPROVEEDOR: this.getView().byId("edit_perInv_contratista").getValue(),
                    ZPUESTO: this.getView().byId("edit_perInv_puestoTrb").getValue()
                }
                this.actualizarCamposPorIndice(list, tempEditId, obj); 
                // console.log("saveEditAcciones list FIN",list)
                oModel.setProperty(varTabaLista,list); 
                MessageToast.show("Cambios realizados")
                this.cancelPerInvolucrado()
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
                // let objPerInvClean = {  //limpiar formulario
                //     codTrab: "perInv_codTrab",
                //     fullName: "perInv_fullName",
                //     dni: "perInv_dni",
                //     contratista: "perInv_contratista",
                //     puestoTrb: "perInv_puestoTrb"
                // }
                // this.limpiarObjeto(objPerInvClean)

            },
            deletePerInvolucrado:async  function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/tabPerInvolucrados");

                var oTable = this.getView().byId("tablePersInvolucrado");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length && dataTable[indiceAEliminar] != undefined) {
                    let typeMsm = "information",
                    titleMsm = "¿Deseas elimar el registro seleccionado?"
                    let ok = await this.MessageBoxPress(typeMsm,titleMsm)
                    if(ok){ 
                        dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                        oModel.setProperty("/tabPerInvolucrados",dataTable)
                        MessageToast.show("Registro eliminado.")
                    }else{ MessageToast.show("Solicitud cancelada") }
                }else {MessageToast.show("Seleccione un registro")}
            },
            buscarTrabajador:async function () {   
                var iCodTrabajador = this.getView().byId("perInv_codTrab").getValue()
                let dataRes = await this.searchTrabajador(iCodTrabajador)
                if(dataRes){
                    this.getView().byId("perInv_fullName").setValue(`${dataRes.NOMBRE} ${dataRes.APELLIDO}`) 
                    this.getView().byId("perInv_dni").setValue(dataRes.DNI)
                    this.getView().byId("perInv_contratista").setValue(dataRes.DNI)
                    this.getView().byId("perInv_puestoTrb").setValue(dataRes.AREA)

                }else{MessageToast.show("No encontrado")}
            },
            buscarTrabajadorEdit:async function () {   
                var iCodTrabajador = this.getView().byId("edit_perInv_codTrab").getValue()
                let dataRes = await this.searchTrabajador(iCodTrabajador)
                if(dataRes){
                    this.getView().byId("edit_perInv_fullName").setValue(`${dataRes.NOMBRE} ${dataRes.APELLIDO}`) 
                    this.getView().byId("edit_perInv_dni").setValue(dataRes.DNI)
                    this.getView().byId("edit_perInv_contratista").setValue(dataRes.DNI)
                    this.getView().byId("edit_perInv_puestoTrb").setValue(dataRes.AREA)

                }else{MessageToast.show("No encontrado")}
            },
            searchTrabajador:  function (iCodTrabajador) {  
                let data
                // console.log('getListEmpleado')
                // var iCodTrabajador = this.getView().byId("perInv_codTrab").getValue()
                // console.log("iCodTrabajador",iCodTrabajador)
                // var oModel = this.getView().getModel("myParam");  
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_PERSONAL/0/0/${iCodTrabajador}/0/0/0/0?sap-client=120`;
                var dataRes =  this.f_GetJson(url) 
                console.log('getListEmpleado DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    // MessageToast.show("Error (" + dataRes.descripcion + ")");
                    // MessageToast.show("NO ENCONTRADO");
                    data = false
                }else{
                    console.log("PERSONAL",dataRes)
                    dataRes= dataRes[0]
                    data = dataRes
                    // this.getView().byId("perInv_fullName").setValue(`${dataRes.NOMBRE} ${dataRes.APELLIDO}`) 
                    // this.getView().byId("perInv_dni").setValue(dataRes.DNI)
                    // this.getView().byId("perInv_contratista").setValue(dataRes.DNI)
                    // this.getView().byId("perInv_puestoTrb").setValue(dataRes.AREA)
                    // oModel.setProperty('/listEmpleados',dataRes);  
                }
                return data
            },

            limpiarObjeto: function (objeto) {  
                for (var propiedad in objeto) {
                    if (objeto.hasOwnProperty(propiedad)) {
                        this.getView().byId(objeto[propiedad]).setValue("") 
                    }
                  }
            }, 
            // limpiarObjeto: function (objeto) {  
            //     for (var propiedad in objeto) {
            //         if (objeto.hasOwnProperty(propiedad)) {
            //             this.getView().byId(objeto[propiedad]).setValue("") 
            //         }
            //       }
            // },

            //FUNCIONES DE RIESGOS ASOCIADOS INSPECCIONES
            addRiAsociados: function () {  
                this.getView().byId("panelRiAsociados").setVisible(true)
            },
            cancelRiAsociados: function () {  
                this.getView().byId("panelRiAsociados").setVisible(false)
                let objRiAsocClean = { 
                    conInsegura: "riAsoc_conInsegura",
                    riesgo: "riAsoc_riesgo",
                    consecuencia: "riAsoc_consecuencia",
                    nivelRiesgo: "riAsoc_nivelRiesgo",
                    file: "riAsoc_file"
                }
                this.limpiarObjeto(objRiAsocClean)
                this.getView().byId("panelRiAsociadosEdit").setVisible(false)
            },
            editRiAsociados: function () {  
                let oModel = this.getView().getModel("myParam");  
                let varTemEdit = "/temEditRiAsociados"
                let varTemEditId = "/temEditRiAsociadosId"
                let varTabaLista = "/tabRiAsociados"
                let varIdTabla = "tableRiesgosAsociados"
                let tableList = oModel.getProperty(varTabaLista); 
                
                var oTable = this.getView().byId(varIdTabla);
                var indiceEdit = oTable.getSelectedIndices();
                if (indiceEdit >= 0 && indiceEdit < tableList.length && tableList[indiceEdit] != undefined) {
                    // if (indiceEdit >= 0) {
                    this.getView().byId("panelRiAsociadosEdit").setVisible(true) 
                    console.log("Registro A EDITAR.",tableList[indiceEdit]);
                    oModel.setProperty(varTemEdit,tableList[indiceEdit]); 
                    oModel.setProperty(varTemEditId,indiceEdit); 
                } else {MessageToast.show("Seleccione un registro")}  
            },
            saveRiAsociados: function () {  
                let oModel = this.getView().getModel("myParam"); 
                let listRiAsociados = oModel.getProperty("/tabRiAsociados");
                let objRiAsoc = { 
                    ZCOND_INSEGURA: this.getView().byId("riAsoc_conInsegura").getValue(), 
                    ZRIESGO: this.getView().byId("riAsoc_riesgo").getValue(),
                    ZCONSECUENCIA: this.getView().byId("riAsoc_consecuencia").getValue(),
                    ZNIVEL_RIESGO: this.getView().byId("riAsoc_nivelRiesgo").getValue(),
                    ZANEXO: this.getView().byId("riAsoc_file").getValue()
                }
                console.log("objRiAsoc",objRiAsoc)
                listRiAsociados.push(objRiAsoc)
                oModel.setProperty("/tabRiAsociados",listRiAsociados);
                
                this.getView().byId("panelRiAsociados").setVisible(false)
                this.cancelRiAsociados()
            },
            saveEditRiAsociados: function () {  
                // let varTemEdit = "/temEditAcciones"
                let varTemEditId = "/temEditRiAsociadosId"
                let varTabaLista = "/tabRiAsociados"
                // let varIdTabla = "tableAccionesInforme"

                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty(varTabaLista);
                let tempEditId = oModel.getProperty(varTemEditId);
                // console.log("saveEditAcciones list init",list)
                let objRiAsoc = { 
                    ZCOND_INSEGURA: this.getView().byId("edit_riAsoc_conInsegura").getValue(), 
                    ZRIESGO: this.getView().byId("edit_riAsoc_riesgo").getValue(),
                    ZCONSECUENCIA: this.getView().byId("edit_riAsoc_consecuencia").getValue(),
                    ZNIVEL_RIESGO: this.getView().byId("edit_riAsoc_nivelRiesgo").getValue(),
                    ZANEXO: this.getView().byId("edit_riAsoc_file").getValue()
                } 
                this.actualizarCamposPorIndice(list, tempEditId, objRiAsoc); 
                // console.log("saveEditAcciones list FIN",list)
                oModel.setProperty(varTabaLista,list); 
                MessageToast.show("Cambios realizados")
                this.cancelRiAsociados() 
            },
            deleteRiAsociados:async function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/tabRiAsociados");

                var oTable = this.getView().byId("tableRiesgosAsociados");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length && dataTable[indiceAEliminar] != undefined) {
                    let typeMsm = "information",
                        titleMsm = "¿Deseas eleminar al asistente seleccionado?"
                    let ok = await this.MessageBoxPress(typeMsm,titleMsm)
                    if(ok){
                        dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                        oModel.setProperty("/tabRiAsociados",dataTable);
                        MessageToast.show("Registro eliminado.")
                    }else{ MessageToast.show("Solicitud cancelada")}
                }else {MessageToast.show("Seleccione un registro")}
            },
            //FUNCIONES DE MEDIDAS CORRECTIVAS
            addMedCorrectiva: function () {  
                this.getView().byId("panelMedCorrectiva").setVisible(true)
            },
            cancelMedCorrectiva: function () {  
                this.getView().byId("panelMedCorrectiva").setVisible(false)
                this.getView().byId("panelMedCorrectivaEdit").setVisible(false)
                let objRiAsocClean = { 
                    descrip: "medCor_descrip",
                    responsable: "medCor_responsable",
                    fechaEjc: "medCor_fechaEjc",
                    estadoAccCor: "medCor_estadoAccCor"
                }
                this.limpiarObjeto(objRiAsocClean)
            },
            saveMedCorrectiva: function () {  
                let oModel = this.getView().getModel("myParam"); 
                let listMedCorrectiva = oModel.getProperty("/tabMedCorrectiva");
                let objMedCor= { 
                    ZMEDIDA: this.getView().byId("medCor_descrip").getValue(), 
                    ZRESPONSABLE: this.getView().byId("medCor_responsable").getValue(), 
                    ZFEC_EJECUCION: this.cambiarFormatoFecha(this.getView().byId("medCor_fechaEjc").getValue()),
                    ZESTADO: this.getView().byId("medCor_estadoAccCor").getSelectedKey()
                }
                console.log("objMedCor correctivo",objMedCor)
                listMedCorrectiva.push(objMedCor)
                oModel.setProperty("/tabMedCorrectiva",listMedCorrectiva); 
                this.getView().byId("panelMedCorrectiva").setVisible(false)
                this.cancelMedCorrectiva()
            },
            deleteMedCorrectiva:async function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/tabMedCorrectiva");

                var oTable = this.getView().byId("tableMedidaCorrectiva");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length  && dataTable[indiceAEliminar] != undefined) {
                    let typeMsm = "information",
                    titleMsm = "¿Deseas eleminar al asistente seleccionado?"
                    let ok = await this.MessageBoxPress(typeMsm,titleMsm)
                    if(ok){
                        dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                        oModel.setProperty("/tabMedCorrectiva",dataTable);
                        MessageToast.show("Registro eliminado.")
                    }else{ MessageToast.show("Solicitud cancelada")}
                }else {MessageToast.show("Seleccione un registro")}
            },
            editMedCorrectiva: function () {  
                let oModel = this.getView().getModel("myParam");  
                let varTemEdit = "/temEditMedCorrectiva"
                let varTemEditId = "/temEditMedCorrectivaId"
                let varTabaLista = "/tabMedCorrectiva"
                let varIdTabla = "tableMedidaCorrectiva"
                let tableList = oModel.getProperty(varTabaLista); 
                
                var oTable = this.getView().byId(varIdTabla);
                var indiceEdit = oTable.getSelectedIndices();
                if (indiceEdit >= 0 && indiceEdit < tableList.length && tableList[indiceEdit] != undefined) {
                    // if (indiceEdit >= 0) {
                    this.getView().byId("panelMedCorrectivaEdit").setVisible(true) 
                    console.log("Registro A EDITAR.",tableList[indiceEdit]);
                    oModel.setProperty(varTemEdit,tableList[indiceEdit]); 
                    oModel.setProperty(varTemEditId,indiceEdit); 
                } else {MessageToast.show("Seleccione un registro")}  
            },
            saveEditMedCorrectiva: function () {   
                let varTemEditId = "/temEditMedCorrectivaId"
                let varTabaLista = "/tabMedCorrectiva" 

                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty(varTabaLista);
                let tempEditId = oModel.getProperty(varTemEditId); 
                let objMedCor= { 
                    ZMEDIDA: this.getView().byId("edit_medCor_descrip").getValue(), 
                    ZRESPONSABLE: this.getView().byId("edit_medCor_responsable").getValue(), 
                    ZFEC_EJECUCION: this.cambiarFormatoFecha(this.getView().byId("edit_medCor_fechaEjc").getValue()),
                    ZESTADO: this.getView().byId("edit_medCor_estadoAccCor").getSelectedKey()
                }
                this.actualizarCamposPorIndice(list, tempEditId, objMedCor); 
                // console.log("saveEditAcciones list FIN",list)
                oModel.setProperty(varTabaLista,list); 
                MessageToast.show("Cambios realizados")
                this.cancelMedCorrectiva() 
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
            // RESPONSABLE DE REGISTROS
            addResponsables: function () {  
                this.getView().byId("panelResponsables").setVisible(true)
            },
            cancelResponsables: function () {  
                this.getView().byId("panelResponsables").setVisible(false)
                this.getView().byId("panelResponsablesEdit").setVisible(false)
                let objRespClean = { 
                    nombre: "responsable_nombre",
                    cargo: "responsable_cargo",
                    fecha: "responsable_fecha"
                }
                this.limpiarObjeto(objRespClean)
            },
            saveResponsables: function () {  
                let oModel = this.getView().getModel("myParam"); 
                let listResp = oModel.getProperty("/tabResponsables");
                let objResp= { 
                    ZAPELLIDO_NOMBRE: this.getView().byId("responsable_nombre").getValue(), 
                    ZCARGO: this.getView().byId("responsable_cargo").getValue(),
                    ZFECHA: this.cambiarFormatoFecha(this.getView().byId("responsable_fecha").getValue()), 
                }
                console.log("objResp",objResp)
                listResp.push(objResp)
                oModel.setProperty("/tabResponsables",listResp); 
                this.getView().byId("panelResponsables").setVisible(false)
                this.cancelResponsables()
            },
            deleteResponsables:async function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/tabResponsables");

                var oTable = this.getView().byId("idTableResponsable");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length  && dataTable[indiceAEliminar] != undefined) {
                    let typeMsm = "information",
                    titleMsm = "¿Deseas eleminar al asistente seleccionado?"
                    let ok = await this.MessageBoxPress(typeMsm,titleMsm)
                    if(ok){
                        dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                        oModel.setProperty("/tabResponsables",dataTable);
                        MessageToast.show("Registro eliminado.")
                    }else{ MessageToast.show("Solicitud cancelada")}
                }else {MessageToast.show("Seleccione un registro")}
            },
            editResponsables: function () {  
                let oModel = this.getView().getModel("myParam");  
                let varTemEdit = "/temEditResponsables"
                let varTemEditId = "/temEditResponsablesId"
                let varTabaLista = "/tabResponsables"
                let varIdTabla = "idTableResponsable"
                let tableList = oModel.getProperty(varTabaLista); 
                
                var oTable = this.getView().byId(varIdTabla);
                var indiceEdit = oTable.getSelectedIndices();
                if (indiceEdit >= 0 && indiceEdit < tableList.length && tableList[indiceEdit] != undefined) {
                    // if (indiceEdit >= 0) {
                    this.getView().byId("panelResponsablesEdit").setVisible(true) 
                    console.log("Registro A EDITAR.",tableList[indiceEdit]);
                    oModel.setProperty(varTemEdit,tableList[indiceEdit]); 
                    oModel.setProperty(varTemEditId,indiceEdit); 
                } else {MessageToast.show("Seleccione un registro")}  
            },
            saveEditResponsables: function () {   
                let varTemEditId = "/temEditResponsablesId"
                let varTabaLista = "/tabResponsables" 

                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty(varTabaLista);
                let tempEditId = oModel.getProperty(varTemEditId); 
                let objResp= { 
                    ZAPELLIDO_NOMBRE: this.getView().byId("edit_responsable_nombre").getValue(), 
                    ZCARGO: this.getView().byId("edit_responsable_cargo").getValue(),
                    ZFECHA: this.cambiarFormatoFecha(this.getView().byId("edit_responsable_fecha").getValue()), 
                }
                this.actualizarCamposPorIndice(list, tempEditId, objResp); 
                // console.log("saveEditAcciones list FIN",list)
                oModel.setProperty(varTabaLista,list); 
                MessageToast.show("Cambios realizados")
                this.cancelResponsables() 
            },
            buscarTrabajadorRes:async function () {   
                var iCodTrabajador = this.getView().byId("codTrabajador").getValue()
                let dataRes = await this.searchTrabajador(iCodTrabajador)
                if(dataRes){
                    this.getView().byId("responsable_nombre").setValue(`${dataRes.NOMBRE} ${dataRes.APELLIDO}`) 
                    this.getView().byId("responsable_cargo").setValue(dataRes.AREA)

                }else{MessageToast.show("No encontrado")}
            },
            buscarTrabajadorResEdit:async function () {   
                var iCodTrabajador = this.getView().byId("edit_codTrabajador").getValue()
                let dataRes = await this.searchTrabajador(iCodTrabajador)
                if(dataRes){
                    this.getView().byId("edit_responsable_nombre").setValue(`${dataRes.NOMBRE} ${dataRes.APELLIDO}`) 
                    this.getView().byId("edit_responsable_cargo").setValue(dataRes.AREA)

                }else{MessageToast.show("No encontrado")}
            },
            // funciones generales
            cambiarFormatoFecha: function (fecha) {
                let fechaReturn 
                // para saber si el la fecha q se envia es 8/21/23
                if (fecha.includes('/')) {
                    const partes = fecha.split('/');
                    if (partes.length !== 3) {
                        fechaReturn = "";
                    }
    
                    let mes = partes[0];
                    let dia = partes[1];
                    let año = partes[2];
    
                    // Convertir el año a formato completo (yyyy)
                    if (año.length === 2) {
                        const añoActual = new Date().getFullYear().toString();
                        const siglo = añoActual.slice(0, 2);
                        año = siglo + año;
                    }
    
                    // Asegurarse de que los componentes de fecha tengan dos dígitos
                    dia = dia.padStart(2, '0');
                    mes = mes.padStart(2, '0');
    
                    const fechaFormateada = `${año}-${mes}-${dia}`;
                    fechaReturn = fechaFormateada;
                }else{
                    if (fecha.includes('-')) {
                        fechaReturn = fecha; 
                    }else{
                        fechaReturn = "Formato de fecha incorrecto";
                    } 
                }
                return fechaReturn
            },
            actualizarCamposPorIndice: function (array, indice, nuevosCampos) {
                if (indice >= 0 && indice < array.length) {
                  array[indice] = { ...array[indice], ...nuevosCampos };
                } else {
                  console.log("Índice fuera de rango");
                }
            },
            f_GetJson: function (p_url_path) {
                // return new Promise((resolve, reject) => {    
                    var credentials = btoa(`${usuario}:${password}`);  
                    var res = null;
                    $.ajax({
                        type: "GET",
                        url: p_url_path ,
                        async: false,
                        headers: {
                            "Authorization": `Basic ${credentials}`,
                            "X-Requested-With": "XMLHttpRequest",
                            "Content-Type": "application/json; charset=utf8",
                            "Accept": "application/json"
                            },
                        success: function (result) {
                            // console.log(`DATA ->`,result);
                            // resolve(result.ITAB); 
                            res = result.ITAB
                        },
                        error: function (error) { 
                            // console.log('error',error); 
                            var str_error = '';
                            if(error.responseJSON != undefined && error.responseJSON.ITAB != undefined) {
                            for(var i=0; i<error.responseJSON.ITAB.length; i++) {
                                if(str_error == '') { str_error = error.responseJSON.ITAB[i].MESSAGE; }
                                else { str_error = str_error + "; " + error.responseJSON.ITAB[i].MESSAGE; }
                            }
                            }
                            else {
                            str_error = "Ocurrió un error (" + error.responseText + ")";
                            }
                            // MessageToast.show("Error (" + str_error + ")");
                            var errorObj = {
                                cod : 'Error',
                                descripcion :str_error
                            }
                            // resolve(errorObj);
                            res=  errorObj
                        }
                    });
                    // console.log(`RES ->`,res);
                    return res
                // }); 
            },
            f_PostJsonSinData:  function (url) { 
                const credentials = btoa(`${usuario}:${password}`); 
                var res = null
                $.ajax(url, {
					type: "POST",
                    async: false,
					headers: {
                        "Authorization": `Basic ${credentials}`,
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/json"
					}, 
					success: function (result) {
                        res = result
					},
					error: function (error) { 
                        // console.log('error',error); 
                        var str_error = '';
                        if(error.responseJSON != undefined && error.responseJSON.ITAB != undefined) {
                            for(var i=0; i<error.responseJSON.ITAB.length; i++) {
                                if(str_error == '') { str_error = error.responseJSON.ITAB[i].MESSAGE; }
                                else { str_error = str_error + "; " + error.responseJSON.ITAB[i].MESSAGE; }
                            }
                        }
                        else { str_error = "Ocurrió un error (" + error.responseText + ")"; } 
                        var errorObj = { cod : 'Error',  descripcion :str_error }
                        res= errorObj
                    }
				}); 
                // console.log(`RES ->`,res);
                return res
            },
            f_PostJsonData:  function (url, dataForm) { 
                // console.log("INICIO f_PostJsonData")
                const credentials = btoa(`${usuario}:${password}`); 
                var res = null
                // var oVector = [dataForm]
                $.ajax(url, {
					type: "POST",
                    data: JSON.stringify(dataForm),
                    async: false,
					headers: {
                        "Authorization": `Basic ${credentials}`,
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/json"
					}, 
					success: function (result) {
						// console.log('obtuvo consulta POST',result); 
                        res = result
					},
					error: function (error) { 
                        // console.log('error',error); 
                        var str_error = '';
                        if(error.responseJSON != undefined && error.responseJSON.ITAB != undefined) {
                            for(var i=0; i<error.responseJSON.ITAB.length; i++) {
                                if(str_error == '') { str_error = error.responseJSON.ITAB[i].MESSAGE; }
                                else { str_error = str_error + "; " + error.responseJSON.ITAB[i].MESSAGE; }
                            }
                        }
                        else { str_error = "Ocurrió un error (" + error.responseText + ")"; } 
                        var errorObj = { cod : 'Error',  descripcion :str_error }
                        res= errorObj
                    }
				}); 
                // console.log(`RES ->`,res);
                return res
            },
            MessageBoxPress: function (typeMsm,titleMsm) {
                return new Promise((resolve, reject) => {  
                    MessageBox[typeMsm](titleMsm, {
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            let res = false
                            if(sAction === MessageBox.Action.OK){  
                                res = true
                            }  
                            resolve(res); 
                        }
                    });
                }); 
            },
            MessageBoxPressOneOption: function (typeMsm,titleMsm) {
                return new Promise((resolve, reject) => {  
                    MessageBox[typeMsm](titleMsm, {
                        actions: [MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            let res = false
                            if(sAction === MessageBox.Action.OK){  
                                res = true
                            }  
                            resolve(res); 
                        }
                    });
                }); 
            },
            changeFullNameTrab:  function (cod) { 
                let list = this.getView().getModel("myParam").getProperty('/listCodTrabajador'); 
                if(cod){
                    let valorF 
                    valorF = list.filter(function(e) {return parseInt(e.COD_PERSONAL, 10) == parseInt(cod, 10) })
                    valorF = valorF[0]
                    if(valorF){ valorF= `${valorF.NOMBRE} ${valorF.APELLIDO}`}
                    else{valorF = `Sin data ${cod}`}
                    return valorF
                }

            },
            changeDataGerencia:  function (cod) { 
                let list = this.getView().getModel("myParam").getProperty('/ZSYSO_GERENCIASet'); 
                if(cod){
                    let valorF 
                    valorF = list.filter(function(e) {return parseInt(e.ORGEH, 10) == parseInt(cod, 10) })
                    valorF = valorF[0]
                    if(valorF){ valorF= valorF.STEXT}
                    else{valorF = `Sin data ${cod}`}
                    return valorF
                } 
            },
            changeDataPuesto:  function (cod) { 
                let list = this.getView().getModel("myParam").getProperty('/ZSYSO_PUESTO');  
                if(cod){
                    let valorF 
                    valorF = list.filter(function(e) {return parseInt(e.PUESTO, 10) == parseInt(cod, 10) })
                    valorF = valorF[0]
                    if(valorF){ valorF= valorF.DESCRIP}
                    else{valorF = `Sin data ${cod}`}
                    return valorF
                } 
            },
            changeDataArea:  function (cod) { 
                let list = this.getView().getModel("myParam").getProperty('/ZSYSO_AREASet'); 
                if(cod){
                    let valorF 
                    valorF = list.filter(function(e) {return e.DIVISION == cod })
                    valorF = valorF[0]
                    if(valorF){ valorF= valorF.DESCRIP}
                    else{valorF = `Sin data ${cod}`}
                    return valorF
                } 
            },
            changeDataDepartamento:  function (cod) { 
                let list = this.getView().getModel("myParam").getProperty('/ZSYSO_DPTO');  
                if(cod){
                    let valorF 
                    valorF = list.filter(function(e) {return e.DEPARTAM == cod })
                    valorF = valorF[0]
                    // debugger
                    if(valorF){ valorF= valorF.DESCRIP}
                    else{valorF = `Sin data ${cod}`}
                    return valorF
                } 
            },

        });
    });
