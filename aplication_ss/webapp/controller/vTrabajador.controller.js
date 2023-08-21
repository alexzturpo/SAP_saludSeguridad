sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        var usuario = "CONSULT_PQ01";
        var password = "Rcom2023..";
        var url_ini = "";
        return Controller.extend("appss.aplicationss.controller.vTrabajador", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {

            }, 
            onPageBack : function () {  
                this.getRouter().getTargets().display("TargetvMain");
            },
            saveTrabajador : function () {  
                let oModel = this.getView().getModel("myParam"); 
                
                let trabajador = oModel.getProperty("/tempTrabajadorSelect");  
                let ListRegistroMedico = oModel.getProperty("/ListRegistroMedico");  
                let ListRegistroSCTR = oModel.getProperty("/ListRegistroSCTR");  
                let getListRgstrDOC = oModel.getProperty("/getListRgstrDOC");   
                //INSERTAR Y ACTUALIZAR DETALLES DEL TRABAJADOR
                var formTrab = {
                    "pers_regmed": ListRegistroMedico,
                    "pers_sctr": ListRegistroSCTR,
                    "pers_doc": getListRgstrDOC,
                    // "pers_doc_ver": tbAcciones,
                }
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/INS_DETALLE_TRABAJADOR/1000/0/${trabajador.COD_PERSONAL}/0/0/0/0`;
                var dataRes = this.f_PostJsonData(url, formTrab) // envia nuevo registro

                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{ 
                    MessageToast.show("Solicitud exitosa")
                    this.onPageBack()
                }
            },
            //PANEL TABLE DE REGISTRO MEDICO
            addRMedico: function () { this.getView().byId("panelRegistroMedico").setVisible(true) },
            cancelRMedico: function () { 
                this.getView().byId("panelRegistroMedico").setVisible(false) 
                this.getView().byId("panelRegistroMedicoEdit").setVisible(false) 
            }, 
            saveRMedico : function () {  
                console.log("saveRMedico")
                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty("/ListRegistroMedico");  
                var formData = { 
                    ZFEC_EMISION : this.cambiarFormatoFecha(this.getView().byId("RMedico_fecha").getValue()),
                    ZOBSERVACIONES : this.getView().byId("RMedico_obs").getValue(),
                    ZESTADO : this.getView().byId("RMedico_estado").getSelectedKey(),
                    ZFEC_VENCIMIENTO : this.cambiarFormatoFecha(this.getView().byId("RMedico_fechaVenc").getValue()), 
                } 
                console.log("formData",formData)
                list.push(formData)
                oModel.setProperty("/ListRegistroMedico",list); 
                // limpiar formulario
                let accionClean = [
                    {id:"RMedico_fecha"},
                    {id:"RMedico_obs"},
                    {id:"RMedico_estado", select: true},
                    {id:"RMedico_fechaVenc"}
                ] 
                this.limpiarObjeto(accionClean)
                this.cancelRMedico()
            },
            editRMedico: function () {  
                let oModel = this.getView().getModel("myParam");  

                let varPanel = "panelRegistroMedicoEdit"
                let varListTable = "/ListRegistroMedico"
                let varOTableId = "tableRegistroMedico"
                let varTemEdit = "/temEditRMedico"
                let varTemEditIndice = "/temEditRMedicoId" 

                var oTable = this.getView().byId(varOTableId);
                var indiceEdit = oTable.getSelectedIndices();
                console.log("indiceEdit",indiceEdit)
                if (indiceEdit.length > 0) {
                    console.log("indice seleccionado")
                    this.getView().byId(varPanel).setVisible(true)
                    let listTable = oModel.getProperty(varListTable); 
                    // console.log("Registro A EDITAR.",listTable[indiceEdit]);
                    oModel.setProperty(varTemEdit,listTable[indiceEdit]);  //nombre de modelo temporal a editar
                    oModel.setProperty(varTemEditIndice,indiceEdit); //indice de modelo temporal a editar
                } else {
                console.log("Índice inválido, SELECCIONEE UNO");
                }  
            },
            saveEditRMedico: function () {  
                let oModel = this.getView().getModel("myParam");  
                
                // let varPanel = "panelRegistroMedicoEdit"
                let varListTable = "/ListRegistroMedico"
                // let varOTableId = "tableRegistroMedico"
                // let varTemEdit = "/temEditRMedico"
                let varTemEditIndice = "/temEditRMedicoId" 

                let list = oModel.getProperty(varListTable);
                let tempEditId = oModel.getProperty(varTemEditIndice);
                var formData = { 
                    ZFEC_EMISION : this.cambiarFormatoFecha(this.getView().byId("edit_RMedico_fecha").getValue()),
                    ZOBSERVACIONES : this.getView().byId("edit_RMedico_obs").getValue(),
                    ZESTADO : this.getView().byId("edit_RMedico_estado").getSelectedKey(),
                    ZFEC_VENCIMIENTO : this.cambiarFormatoFecha(this.getView().byId("edit_RMedico_fechaVenc").getValue()), 
                } 
                this.actualizarCamposPorIndice(list, tempEditId, formData); 
                oModel.setProperty(varListTable,list); 
                this.cancelRMedico()
            },
            deleteRMedico : function () {  
                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty("/ListRegistroMedico");   
                var oTable = this.getView().byId("tableRegistroMedico");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < list.length) {
                    list.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/tableAccionesInformeIncidente",list);
                    console.log("Registro eliminado.");
                } else {
                console.log("Índice inválido, no se eliminó ningún registro.");
                }  
            },
            //PANEL TABLE DE LISTA DE RESGISTROS SCTR
            addSCTR: function () { this.getView().byId("panelRegistroSCTR").setVisible(true) },
            cancelSCTR: function () { 
                this.getView().byId("panelRegistroSCTR").setVisible(false) 
                this.getView().byId("panelRegistroSCTREdit").setVisible(false) 
            }, 
            saveSCTR : function () {  
                console.log("saveRMedico")
                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty("/ListRegistroSCTR");  
                var formData = { 
                    ZFEC_EMISION : this.cambiarFormatoFecha(this.getView().byId("SCTR_fecha").getValue()),
                    ZOBSERVACIONES : this.getView().byId("SCTR_obs").getValue(),
                    ZESTADO : this.getView().byId("SCTR_estado").getSelectedKey(),
                    ZFEC_VENCIMIENTO : this.cambiarFormatoFecha(this.getView().byId("SCTR_fechaVenc").getValue()), 
                } 
                console.log("formData",formData)
                list.push(formData)
                oModel.setProperty("/ListRegistroSCTR",list); 
                // limpiar formulario
                let accionClean = [
                    {id:"SCTR_fecha"},
                    {id:"SCTR_obs"},
                    {id:"SCTR_estado", select: true},
                    {id:"SCTR_fechaVenc"}
                ]
                this.limpiarObjeto(accionClean)
                this.cancelSCTR()
            }, 
            editSCTR: function () {  
                let oModel = this.getView().getModel("myParam");  

                let varPanel = "panelRegistroSCTREdit"
                let varListTable = "/ListRegistroSCTR"
                let varOTableId = "tableSCTR"
                let varTemEdit = "/temEditSCTR"
                let varTemEditIndice = "/temEditSCTRIndice" 

                var oTable = this.getView().byId(varOTableId);
                var indiceEdit = oTable.getSelectedIndices();
                console.log("indiceEdit",indiceEdit)
                if (indiceEdit.length > 0) {
                    console.log("indice seleccionado")
                    this.getView().byId(varPanel).setVisible(true)
                    let listTable = oModel.getProperty(varListTable); 
                    // console.log("Registro A EDITAR.",listTable[indiceEdit]);
                    oModel.setProperty(varTemEdit,listTable[indiceEdit]);  //nombre de modelo temporal a editar
                    oModel.setProperty(varTemEditIndice,indiceEdit); //indice de modelo temporal a editar
                } else {
                console.log("Índice inválido, SELECCIONEE UNO");
                }  
            },
            saveEditSCTR: function () {  
                let oModel = this.getView().getModel("myParam");   
                let varListTable = "/ListRegistroSCTR" 
                let varTemEditIndice = "/temEditSCTRIndice" 

                let list = oModel.getProperty(varListTable);
                let tempEditId = oModel.getProperty(varTemEditIndice);
                var formData = { 
                    ZFEC_EMISION : this.cambiarFormatoFecha(this.getView().byId("edit_SCTR_fecha").getValue()),
                    ZOBSERVACIONES : this.getView().byId("edit_SCTR_obs").getValue(),
                    ZESTADO : this.getView().byId("edit_SCTR_estado").getSelectedKey(),
                    ZFEC_VENCIMIENTO : this.cambiarFormatoFecha(this.getView().byId("edit_SCTR_fechaVenc").getValue()), 
                }  
                this.actualizarCamposPorIndice(list, tempEditId, formData); 
                oModel.setProperty(varListTable,list); 
                this.cancelSCTR()
            },
            deleteSCTR : function () {  
                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty("/ListRegistroSCTR");   
                var oTable = this.getView().byId("tableSCTR");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < list.length) {
                    list.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/ListRegistroSCTR",list);
                    console.log("Registro eliminado.");
                } else {
                console.log("Índice inválido, no se eliminó ningún registro.");
                }  
            },
             //TABLA DE LISTA DE  RESGISTROS DOCUMENTOS 
            addRDocs: function () { this.getView().byId("panelRDocs").setVisible(true) },
            cancelRDocs: function () { this.getView().byId("panelRDocs").setVisible(false) }, 
            saveRDocs : function () {  
                console.log("saveRMedico")
                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty("/getListRgstrDOC");  

                const oFileUploader = this.byId("RDocs_doc").oFileUpload.files[0];  
                var formData = {  
                ZPERS_DOC :"",
                ZDOCUMENTO : oFileUploader.name,
                ZFORMATO : this.determinarTipoArchivo(oFileUploader.name), 
                ZOBLIGATORIO : this.getView().byId("RDocs_obligatorio").getSelectedKey(),
                //  ZFEC_VENCIMIENTO : this.getView().byId("SCTR_fechaVenc").getValue(), 
                } 
                console.log("formData",formData)
                list.push(formData)
                oModel.setProperty("/getListRgstrDOC",list); 
                // limpiar formulario
                let accionClean = [ 
                    {id:"RDocs_obligatorio", select: true},
                    {id:"RDocs_doc"}
                ]
                this.limpiarObjeto(accionClean)
                this.cancelRDocs()
            },
            deleteRDocs : function () {  
                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty("/getListRgstrDOC");   
                var oTable = this.getView().byId("tableSCTR");
                var indiceAEliminar = oTable.getSelectedIndices();
                if (indiceAEliminar >= 0 && indiceAEliminar < list.length) {
                    list.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/getListRgstrDOC",list);
                    console.log("Registro eliminado.");
                } else {
                console.log("Índice inválido, no se eliminó ningún registro.");
                }  
            },
            revisarRDocs : function () {  
                let oModel = this.getView().getModel("myParam");  
                // let list = oModel.getProperty("/getListRgstrDOC");   
                var oTable = this.getView().byId("tableRegistroDocs");
                var indiceAEliminar = oTable.getSelectedIndices();
                console.log("indiceAEliminar",indiceAEliminar);
                // if (indiceAEliminar >= 0 && indiceAEliminar < list.length) {
                //     list.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                //     oModel.setProperty("/getListRgstrDOC",list);
                //     console.log("Registro eliminado.");
                // } else {
                // console.log("Índice inválido, no se eliminó ningún registro.");
                // }  
            },
            determinarTipoArchivo: function (nombreArchivo) {
                const extension = nombreArchivo.split('.').pop().toLowerCase(); 
                const tiposArchivo = {
                    'txt': 'Texto',
                    'pdf': 'PDF',
                    'doc': 'Documento de Word',
                    'docx': 'Documento de Word',
                    'xls': 'Hoja de cálculo de Excel',
                    'xlsx': 'Hoja de cálculo de Excel',
                    'jpg': 'Imagen JPEG',
                    'jpeg': 'Imagen JPEG',
                    'png': 'Imagen PNG',
                    'gif': 'Imagen GIF',
                    'mp3': 'Archivo de audio MP3',
                    'mp4': 'Archivo de video MP4',
                    'avi': 'Archivo de video AVI',
                    // Agrega más extensiones y tipos de archivo
                }; 
                if (extension in tiposArchivo) {return tiposArchivo[extension];} 
                else { return 'tipo desconocido'; }
            },

            //FUNCIONES GENERALES
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
            cambiarFormatoFecha: function (fecha) {
                let fechaReturn 
                // para saber si el la fecha q se envia es 8/21/23
                if (fecha.includes('/')) {
                    const partes = fecha.split('/');
                    if (partes.length !== 3) {
                        fechaReturn = "Formato de fecha incorrecto";
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
