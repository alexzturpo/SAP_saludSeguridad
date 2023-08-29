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
            updateInspeccion: function () {
                var oModel = this.getView().getModel("myParam");  
                let selectInspeccion = oModel.getProperty("/tempInspecciones");
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

                    ZCAUSAS: this.getView().byId("gInsp_desCausaOrigen").getValue()
                },
                
                "detalle": tabPerInvolucrados,
                "detalle1": tabRiAsociados,
                "detalle2": tabMedCorrectiva,
                "detalle3": tabResponsables
                }
                console.log("objInspeccion",objInspeccion) 
                
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/UPD_INSP/1000/0/${selectInspeccion.ZINSPECCION}/0/0/0/0?sap-client=100`;
                var dataRes = this.f_PostJsonData(url, objInspeccion) // actualizar inspeccion cabecera y tablas involucrados asociados correctiva responsable
                console.log("dataRes",dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    MessageToast.show("Solicitud exitosa");  
                } 
                // oModel.setProperty("/listInspeccion",newListInspeccion);  
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
                this.getView().byId("panelPerInvolucradoEdit").setVisible(false)
            },
            editPerInvolucrado: function () {  
                this.getView().byId("panelPerInvolucradoEdit").setVisible(true) 
                let oModel = this.getView().getModel("myParam");  
                let varTemEdit = "/temEditInvolucrado"
                let varTemEditId = "/temEditInvolucradoId"
                let varTabaLista = "/tabPerInvolucrados"
                let varIdTabla = "tablePersInvolucrado"
                let tableList = oModel.getProperty(varTabaLista); 

                var oTable = this.getView().byId(varIdTabla);
                var indiceEdit = oTable.getSelectedIndices();
                if (indiceEdit >= 0) {
                    console.log("Registro A EDITAR.",tableList[indiceEdit]);
                    oModel.setProperty(varTemEdit,tableList[indiceEdit]); 
                    oModel.setProperty(varTemEditId,indiceEdit); 
                } else {
                console.log("Índice inválido, no se eliminó ningún registro.");
                }  
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
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length && dataTable[indiceAEliminar] != undefined) {
                    dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/tabPerInvolucrados",dataTable);
                    console.log("Registro eliminado.");
                }else {
                    MessageToast.show("Seleccione un registro");
                console.log("Índice inválido, no se eliminó ningún registro.");
                }
            },
            buscarTrabajador:  function () {  
                console.log('getListEmpleado')
                var iCodTrabajador = this.getView().byId("perInv_codTrab").getValue()
                console.log("iCodTrabajador",iCodTrabajador)
                var oModel = this.getView().getModel("myParam");  
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_PERSONAL/0/0/${iCodTrabajador}/0/0/0/0`;
                var dataRes =  this.f_GetJson(url) 
                console.log('getListEmpleado DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                    MessageToast.show("NO ENCONTRADO");
                }else{
                    console.log("PERSONAL",dataRes)
                    dataRes= dataRes[0]
                    this.getView().byId("perInv_fullName").setValue(`${dataRes.NOMBRE} ${dataRes.APELLIDO}`) 
                    this.getView().byId("perInv_dni").setValue(dataRes.DNI)
                    this.getView().byId("perInv_contratista").setValue(dataRes.DNI)
                    this.getView().byId("perInv_puestoTrb").setValue(dataRes.AREA)
                    // oModel.setProperty('/listEmpleados',dataRes);  
                }
            },

            limpiarObjeto: function (objeto) {  
                for (var propiedad in objeto) {
                    if (objeto.hasOwnProperty(propiedad)) {
                        this.getView().byId(objeto[propiedad]).setValue("") 
                    }
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
                let objRiAsocClean = { 
                    conInsegura: "riAsoc_conInsegura",
                    riesgo: "riAsoc_riesgo",
                    consecuencia: "riAsoc_consecuencia",
                    nivelRiesgo: "riAsoc_nivelRiesgo",
                    file: "riAsoc_file"
                }
                this.limpiarObjeto(objRiAsocClean)
            },
            deleteRiAsociados : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/tabRiAsociados");

                var oTable = this.getView().byId("tableRiesgosAsociados");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length && dataTable[indiceAEliminar] != undefined) {
                    dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/tabRiAsociados",dataTable);
                    console.log("Registro eliminado.");
                }else {
                    MessageToast.show("Seleccione un registro");
                console.log("Índice inválido, no se eliminó ningún registro.");
                }
            },
            //FUNCIONES DE MEDIDAS CORRECTIVAS
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
                    ZMEDIDA: this.getView().byId("medCor_descrip").getValue(), 
                    ZRESPONSABLE: this.getView().byId("medCor_responsable").getValue(), 
                    ZFEC_EJECUCION: this.cambiarFormatoFecha(this.getView().byId("medCor_fechaEjc").getValue()),
                    ZESTADO: this.getView().byId("medCor_estadoAccCor").getSelectedKey()
                }
                console.log("objMedCor correctivo",objMedCor)
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
                this.onPageBack()
            },
            deleteMedCorrectiva : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/tabMedCorrectiva");

                var oTable = this.getView().byId("tableMedidaCorrectiva");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length  && dataTable[indiceAEliminar] != undefined) {
                    dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/tabMedCorrectiva",dataTable);
                    console.log("Registro eliminado.");
                }else {
                    MessageToast.show("Seleccione un registro");
                console.log("Índice inválido, no se eliminó ningún registro.");
                }
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
                    ZAPELLIDO_NOMBRE: this.getView().byId("responsable_nombre").getValue(), 
                    ZCARGO: this.getView().byId("responsable_cargo").getValue(),
                    ZFECHA: this.cambiarFormatoFecha(this.getView().byId("responsable_fecha").getValue()), 
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
            deleteResponsables : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/tabResponsables");

                var oTable = this.getView().byId("idTableResponsable");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length  && dataTable[indiceAEliminar] != undefined) {
                    dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/tabResponsables",dataTable);
                    console.log("Registro eliminado.");
                }else {
                    MessageToast.show("Seleccione un registro");
                console.log("Índice inválido, no se eliminó ningún registro.");
                }
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
        });
    });
