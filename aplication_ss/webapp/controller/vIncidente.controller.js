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
        // var usuario = "CONSULT_MM";
        // var password = "Laredo2023.";
        // var url_ini = "";
        var usuario = "CONSULT_PQ01";
        var password = "Rcom2023..";
        var url_ini = "";
        return Controller.extend("appss.aplicationss.controller.vIncidente", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {

            },
            
            onPageBack : function () {  
                this.getRouter().getTargets().display("TargetvMain");
            },
            onAfterRendering:async function () {  
                this.llenarDataTrabajadores()
            },
            llenarDataTrabajadores:async function () {
                // PONER DATA DE TRABAJADORES
                let oModel = this.getView().getModel("myParam");  
                var incidenteSelect = oModel.getProperty("/selectIncidente");
                // incidenteSelect.ZID_COD_INFORMANTE
                // incidenteSelect.ZID_COD_TRABAJADOR
                console.log("onAfterRendering DATA SELECT",incidenteSelect)
                // enviar datos de Informante
                if(incidenteSelect.ZID_COD_INFORMANTE){
                    let dataInformante = this.buscarTrabajador(incidenteSelect.ZID_COD_INFORMANTE)
                    console.log("buscarTrabajador DATA SELECT",dataInformante)
                    console.log("buscarTrabajador DATA SELECT",dataInformante.NOMBRE)
                    if(dataInformante){
                        this.getView().byId("gi_new_nombreEmpTest").setValue(dataInformante.NOMBRE)
                        this.getView().byId("gi_new_apellidoEmpTest").setValue(dataInformante.APELLIDO)
                        this.getView().byId("gi_new_dniEmpTest").setValue(dataInformante.DNI)
                        this.getView().byId("gi_new_areaTrabajoEmpTest").setValue(dataInformante.AREA) 
                    } 
                }
                //para afectadp
                if(incidenteSelect.ZID_COD_TRABAJADOR){
                    let dataTrabajador = this.buscarTrabajador(incidenteSelect.ZID_COD_TRABAJADOR)
                    if(dataTrabajador){
                        this.getView().byId("gi_new_nombreEmp").setValue(dataTrabajador.NOMBRE)
                        this.getView().byId("gi_new_apellidoEmp").setValue(dataTrabajador.APELLIDO)
                        this.getView().byId("gi_new_dniEmp").setValue(dataTrabajador.DNI)
                        this.getView().byId("gi_new_areaTrabajoEmp").setValue(dataTrabajador.AREA) 
                    }  
                }
            },
            obtenerClavePorNombre: function(nombre, conjuntoDeObjetos) {
            for (const clave in conjuntoDeObjetos) {
                    if (conjuntoDeObjetos[clave] === nombre) {
                    return clave;
                    }
                }
                return "Clave no encontrada";
            },
            obtenerNombreEstado: function(clave, conjuntoDeObjetos) {
                const nombreEstado = conjuntoDeObjetos[clave] || "Estado no válido";
                return nombreEstado;
            },
            buscarTrabajador:  function (codigoTrabajador) {  
                console.log('getListEmpleado') 
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_PERSONAL/0/0/${codigoTrabajador}/0/0/0/0`;
                var dataRes =  this.f_GetJson(url) 
                var resTrab = false
                console.log('getListEmpleado DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    // MessageToast.show("Error (" + dataRes.descripcion + ")");
                    MessageToast.show("No encontrado");
                }else{
                    dataRes= dataRes[0]
                    resTrab = dataRes 
                }
                return resTrab
            },
            
            IncNotificacion : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataSelect = oModel.getProperty("/selectIncidente");
                console.log("dataSelect", dataSelect)
                let resTrab = this.buscarTrabajador(dataSelect.ZID_COD_TRABAJADOR)
                console.log("resTrab",resTrab)
                let datosTrabajador = {
                    "afectado": `${resTrab.NOMBRE} ${resTrab.APELLIDO}`
                }
                var urlAjax = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/UPD_EST_INC/1000/0/${dataSelect.ZINCIDENTE}/C/0/0/0`
                console.log("urlAjax",urlAjax)

                var dataRes = this.f_PostJsonData(urlAjax,datosTrabajador)

                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{ 
                    MessageToast.show("Solicitud exitosa")  
                    this.getListInc()
                }
                this.onPageBack()
            },
            saveDocIncidente : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/docTableIncidente");

                const oFileUploader = this.byId("fileDocIncidente");  
                const oUploadedFile = oFileUploader.oFileUpload.files[0];
                // Nombre documento, FechaSubidaDocumento
                var doc = { 
                    ZNOM_DOC : oUploadedFile.name,
                    ZFECHA_UPLOAD : this.fechaActual()
                } 
                dataTable.push(doc)
                oModel.setProperty("/docTableIncidente",dataTable);

                 oFileUploader.setValue('')

                // console.log("oUploadedFile",doc);
            },
            deleteDocIncidente : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/docTableIncidente");

                var oTable = this.getView().byId("tableDocIncidente");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length) {
                    dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/docTableIncidente",dataTable);
                    console.log("Registro eliminado.");
                } else {
                console.log("Índice inválido, no se eliminó ningún registro.");
                } 
                 
            },
            //informe de incidente
            addAcciones: function () {  
                this.getView().byId("panelAcciones").setVisible(true)
            },
            editAcciones: function () {  
                this.getView().byId("panelAccionesEditar").setVisible(true)
                let oModel = this.getView().getModel("myParam");  
                let tbAcciones = oModel.getProperty("/tableAccionesInformeIncidente"); 

                var oTable = this.getView().byId("tableAccionesInforme");
                var indiceEdit = oTable.getSelectedIndices();
                if (indiceEdit >= 0) {
                    console.log("Registro A EDITAR.",tbAcciones[indiceEdit]);
                    oModel.setProperty("/temEditAcciones",tbAcciones[indiceEdit]); 
                    oModel.setProperty("/temEditAccionesId",indiceEdit); 
                } else {
                console.log("Índice inválido, no se eliminó ningún registro.");
                }  
            },
            saveEditAcciones: function () {  
                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty("/tableAccionesInformeIncidente");
                let tempEditId = oModel.getProperty("/temEditAccionesId");
                // console.log("saveEditAcciones list init",list)
                var accion = { 
                    ZTITULO : this.getView().byId("edit_info_titulo").getValue(),
                    ZDESCRIPCION : this.getView().byId("edit_info_desc").getValue(),
                    ZRESPONSABLE : this.getView().byId("edit_info_responsable").getValue(),
                    ZFECHA : this.cambiarFormatoFecha(this.getView().byId("edit_info_fecha").getValue()),
                    ZTIPO : this.getView().byId("edit_info_tipo").getSelectedKey(),
                    ZESTATUS : this.getView().byId("edit_info_estado").getSelectedKey(),
                } 
                this.actualizarCamposPorIndice(list, tempEditId, accion); 
                // console.log("saveEditAcciones list FIN",list)
                oModel.setProperty("/tableAccionesInformeIncidente",list); 
                this.cancelAcciones()
            }, 
            actualizarCamposPorIndice: function (array, indice, nuevosCampos) {
                if (indice >= 0 && indice < array.length) {
                  array[indice] = { ...array[indice], ...nuevosCampos };
                } else {
                  console.log("Índice fuera de rango");
                }
            },
            cancelAcciones: function () {  
                this.getView().byId("panelAcciones").setVisible(false)
                this.getView().byId("panelAccionesEditar").setVisible(false)
            },
            saveInforme : function () {  
                let oModel = this.getView().getModel("myParam");   
                let dataSelect = oModel.getProperty("/selectIncidente"); 
                let tbAcciones = oModel.getProperty("/tableAccionesInformeIncidente");
                var informeCab = {"cabecera": { 
                    ZINCIDENTE : dataSelect.ZINCIDENTE,
                    ZACTOS_SUBESTAND : this.getView().byId("info_acto").getValue(),
                    ZCOND_SUBESTAND : this.getView().byId("info_descrip").getValue(),
                    ZFACT_PERSONALES : this.getView().byId("info_facPers").getValue(),
                    ZFACT_TRABAJO : this.getView().byId("info_facTrab").getValue(),
                    ZLECCIONES : this.getView().byId("info_lecion").getValue(),
                    ZINVEST_POR : this.getView().byId("info_invesNombre").getValue(),
                    ZCARGO : this.getView().byId("info_invesCargo").getValue(),
                    ZFIRMA : this.getView().byId("info_invesFirma").getValue(),
                },
                "detalle":tbAcciones
                }
                console.log("saveInforme DATA",informeCab)

                var urlAjax = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/INS_INCACC/1000/0/${dataSelect.ZINCIDENTE}/0/0/0/0` 
                var dataRes = this.f_PostJsonData(urlAjax, informeCab) // envia nuevo registro

                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{ 
                    MessageToast.show("Solicitud exitosa")
                    // this.limpiarObjeto(objClean) // vuelve a consultar toda los incidentes y actualizar los registros 
                    // LLAMAR OTRA VES A LA CONSULTA GET  INFORME PARA ACTUALIZAR this.getListInc() 
                } 
            },
            saveAcciones : function () {  
                console.log("saveAcciones")
                let oModel = this.getView().getModel("myParam");  
                let tbAcciones = oModel.getProperty("/tableAccionesInformeIncidente");
                console.log("tbAcciones",tbAcciones)
                
                // Nombre documento, FechaSubidaDocumento
                var accion = { 
                    ZTITULO : this.getView().byId("info_titulo").getValue(),
                    ZDESCRIPCION : this.getView().byId("info_desc").getValue(),
                    ZRESPONSABLE : this.getView().byId("info_responsable").getValue(),
                    ZFECHA : this.cambiarFormatoFecha(this.getView().byId("info_fecha").getValue()),
                    ZTIPO : this.getView().byId("info_tipo").getSelectedKey(),
                    ZESTATUS : this.getView().byId("info_estado").getSelectedKey(),
                } 
                console.log("accion",accion)
                tbAcciones.push(accion)
                oModel.setProperty("/tableAccionesInformeIncidente",tbAcciones); 
                // limpiar formulario
                let accionClean = [
                    {id:"info_titulo"},
                    {id:"info_desc"},
                    {id:"info_responsable"},
                    {id:"info_fecha", fecha: true},
                    {id:"info_tipo", select: true},
                    {id:"info_estado", select: true},
                ] 
                this.limpiarObjeto(accionClean)
                this.getView().byId("panelAcciones").setVisible(false)
            },
            deleteAcciones : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataTable = oModel.getProperty("/tableAccionesInformeIncidente");

                var oTable = this.getView().byId("tableAccionesInforme");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length && dataTable[indiceAEliminar] != undefined) {
                    dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/tableAccionesInformeIncidente",dataTable);
                    console.log("Registro eliminado.");
                } else {
                    MessageToast.show("Seleccione un registro");
                    console.log("Índice inválido, no se eliminó ningún registro.");
                }  
            },
            
            IncTerminar : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataSelect = oModel.getProperty("/selectIncidente");
                var urlAjax = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/UPD_EST_INC/1000/0/${dataSelect.ZINCIDENTE}/T/0/0/0`
                console.log("urlAjax",urlAjax) 
                var dataRes = this.f_PostJsonSinData(urlAjax)

                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{ 
                    MessageToast.show("Solicitud exitosa")  
                    this.getListInc()
                }
            },
            handleLinkPress:function(oEvent){
                //var oSelectedItem = oEvent.getSource();
                //var oContext = oSelectedItem.getBindingContext();
                var filename = "testt.pdf";//oContext.getObject().nombre;
                var uri = "/dms/testt.pdf";// + filename;
                var link = document.createElement("a");
                link.download = filename;
                link.href = uri;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            saveIncidente : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataSelect = oModel.getProperty("/selectIncidente"); 
                //optener archivos Anexos 
                let fileAnexoInves = this.byId("fileDocIncidenteAnexoInves").getValue();
                let fileAnexoInfor = this.byId("fileDocIncidenteAnexoInfor").getValue();
                console.log("fileAnexoInves ", fileAnexoInfor)
                console.log("ARCHIVO fileAnexoInfor value", fileAnexoInfor)
                if(!fileAnexoInves){ 
                    // fileAnexoInves = this.byId("fileDocIncidenteAnexoInves").oFileUpload.files[0].name; 
                    fileAnexoInves = ""; 
                }
                if(!fileAnexoInfor){
                    //  fileAnexoInfor = this.byId("fileDocIncidenteAnexoInfor").oFileUpload.files[0].name;
                     fileAnexoInfor = ""
                }
                // console.log("ARCHIVO fileDocIncidenteAnexoInves", this.byId("fileDocIncidenteAnexoInves").oFileUpload.files[0])
                // fileAnexoInfor = this.byId("fileDocIncidenteAnexoInfor").oFileUpload.files[0];

                //obtener array de documentos  
                let docsIncidente = oModel.getProperty("/docTableIncidente")
                let tbAcciones = oModel.getProperty("/tableAccionesInformeIncidente");

                let incidenteForm = {"cabecera" : {
                    //DETALLE
                    ZINCIDENTE: dataSelect.ZINCIDENTE,
                    ZTITULO: this.getView().byId("gi_new_titulo").getValue(),
                    ZDESCRIPCION: this.getView().byId("gi_new_descrip").getValue(),
                    ZACCIONES: this.getView().byId("gi_new_accionInmediata").getValue(),
                    
                    ZSOCIEDAD: this.getView().byId("gi_new_sociedad").getValue(),
                    ZUBICACION: this.getView().byId("gi_new_ubicacion").getValue(),
                    ZDETALLE: this.getView().byId("gi_new_detalle").getValue(),
                    ZINVEST_PRELIM: this.getView().byId("gi_new_invPreliminar").getValue(), 

                    ZINVEST_ACCIDENTES: fileAnexoInves, 
                    ZINF_INVESTIGAC: fileAnexoInfor, 
                    
                    ZFECHA: this.cambiarFormatoFecha(this.getView().byId("gi_new_fecha").getValue()),
                    ZHORA: this.getView().byId("gi_new_hora").getValue(),

                    ZID_COD_TRABAJADOR: this.getView().byId("gi_codEmp_afectado").getValue(), //codigo de empleado afectado
                    ZID_COD_INFORMANTE: this.getView().byId("gi_codEmp_informante").getValue(), //codigo de empleado informante
                    ZMANIFESTACION: this.getView().byId("gi_codEmp_detalleInf").getValue(), 
                    ZESTADO: dataSelect.ZESTADO,

                    // INFORME
                    ZACTOS_SUBESTAND : this.getView().byId("info_acto").getValue(),
                    ZCOND_SUBESTAND : this.getView().byId("info_descrip").getValue(),
                    ZFACT_PERSONALES : this.getView().byId("info_facPers").getValue(),
                    ZFACT_TRABAJO : this.getView().byId("info_facTrab").getValue(),
                    ZLECCIONES : this.getView().byId("info_lecion").getValue(),
                    ZINVEST_POR : this.getView().byId("info_invesNombre").getValue(),
                    ZCARGO : this.getView().byId("info_invesCargo").getValue(),
                    // ZFIRMA : this.getView().byId("info_invesFirma").getValue(),

                },
                "detalle" : docsIncidente,
                "detalle2" : tbAcciones
                }
               
                console.log("incidenteForm update DATA",incidenteForm)

                var urlAjax = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/UPD_INC/1000/0/${dataSelect.ZINCIDENTE}/0/0/0/0` 
                var dataRes = this.f_PostJsonData(urlAjax, incidenteForm) // envia nuevo registro

                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{ 
                    MessageToast.show("Solicitud exitosa")
                    // this.limpiarObjeto(objClean) // vuelve a consultar toda los incidentes y actualizar los registros 
                    this.getListInc() 
                } 
                this.onPageBack()
            },

            /// inicio borrar
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

                    // fecha2: this.getView().byId("gi_new_fecha").getValue(),
                    fecha: this.cambiarFormatoFecha(this.getView().byId("gi_new_fecha").getValue()),
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
            // fin borrar

            //FUNCIONES GENERALES
            getListInc:  function () { 
                console.log('getListInc')
                var oModel = this.getView().getModel("myParam");  
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_INC/1000/0/0/0/0/0/0?sap-client=100";
                var dataRes =  this.f_GetJson(url) 
                console.log('getListInc DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/listIncidente',dataRes);  
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
            fechaActual : function () {  
                var fechaActual = new Date();
                // Obtener día, mes y año
                var dia = fechaActual.getDate();
                var mes = fechaActual.getMonth() + 1; // Los meses en JavaScript son base 0, por lo que se suma 1
                var año = fechaActual.getFullYear();

                // Formatear día y mes para que tengan siempre dos dígitos
                if (dia < 10) {
                    dia = '0' + dia;
                }
                if (mes < 10) {
                    mes = '0' + mes;
                } 
                // Construir la fecha en el formato deseado
                var fechaFormateada = dia + '/' + mes + '/' + año;

                // console.log(fechaFormateada);
                return fechaFormateada
            },
            limpiarObjeto: function (arrayClean) {   
                console.log(`arrayClean: ${arrayClean}`)
                for (const item of arrayClean) {
                    // console.log(`${item.id}`)
                    // if (item.fecha) {
                    //     this.getView().byId(item.id).setDateValue("")
                    // }
                    if (item.select) {
                        this.getView().byId(item.id).setSelectedKey("") 
                    }
                    // this.getView().byId(item.id).setValue("")
                    this.getView().byId(item.id).setValue(''); 
                }
            },
        });
    });
