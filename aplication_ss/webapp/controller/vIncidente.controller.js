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
            IncNotificacion : function () {  
                let oModel = this.getView().getModel("myParam");  
                let dataSelect = oModel.getProperty("/selectIncidente");
                // https://vheaids4ci.sap.agroindustriallaredo.com:44300/sap/bc/ZSISMART/smart/UPD_EST_INC/1000/0/000010/E/0/0/0?sap-client=100
                var urlAjax = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/UPD_EST_INC/1000/0/${dataSelect.ZINCIDENTE}/C/0/0/0`
                console.log("urlAjax",urlAjax)

                var dataRes = this.f_PostJsonSinData(urlAjax)

                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{ 
                    MessageToast.show("Solicitud exitosa")  
                    this.getListInc()
                }
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
            cancelAcciones: function () {  
                this.getView().byId("panelAcciones").setVisible(false)
            },
            saveInforme : function () {  
                console.log("saveAcciones")
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
                    ZFECHA : this.getView().byId("info_fecha").getValue(),
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
                if (indiceAEliminar >= 0 && indiceAEliminar < dataTable.length) {
                    dataTable.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/tableAccionesInformeIncidente",dataTable);
                    console.log("Registro eliminado.");
                } else {
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
                    ZINF_INVESTIGAC: fileAnexoInfor.name, 

                    ZFECHA: this.cambiarFormatoFecha(this.getView().byId("gi_new_fecha").getValue()),
                    ZHORA: this.getView().byId("gi_new_hora").getValue(),

                    ZID_COD_TRABAJADOR: this.getView().byId("gi_codEmp_afectado").getValue(), //codigo de empleado afectado
                    ZID_COD_INFORMANTE: this.getView().byId("gi_codEmp_informante").getValue(), //codigo de empleado informante
                    ZMANIFESTACION: this.getView().byId("gi_codEmp_detalleInf").getValue(), 

                    // INFORME
                    ZACTOS_SUBESTAND : this.getView().byId("info_acto").getValue(),
                    ZCOND_SUBESTAND : this.getView().byId("info_descrip").getValue(),
                    ZFACT_PERSONALES : this.getView().byId("info_facPers").getValue(),
                    ZFACT_TRABAJO : this.getView().byId("info_facTrab").getValue(),
                    ZLECCIONES : this.getView().byId("info_lecion").getValue(),
                    ZINVEST_POR : this.getView().byId("info_invesNombre").getValue(),
                    ZCARGO : this.getView().byId("info_invesCargo").getValue(),
                    ZFIRMA : this.getView().byId("info_invesFirma").getValue(),

                },
                "detalle" : docsIncidente,
                "detalle2" : tbAcciones
                }
               
                console.log("incidenteForm",incidenteForm)

                var urlAjax = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/UPD_INC/1000/0/${dataSelect.ZINCIDENTE}/0/0/0/0` 
                var dataRes = this.f_PostJsonData(urlAjax, incidenteForm) // envia nuevo registro

                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{ 
                    MessageToast.show("Solicitud exitosa")
                    // this.limpiarObjeto(objClean) // vuelve a consultar toda los incidentes y actualizar los registros 
                    this.getListInc() 
                } 
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
