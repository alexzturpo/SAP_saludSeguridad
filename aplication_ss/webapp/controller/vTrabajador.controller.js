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
        var usuario120 = "CONSULT_MM";
        var password120 = "Laredo2023**";
        var url_ini = "";
        var usuario = "CONSULT_MM";
        var password = "Laredo2023**"; 
        return Controller.extend("appss.aplicationss.controller.vTrabajador", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {

            }, 
            onAfterRendering: function () {

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
                this.getView().byId("tableRegistroDocs").setVisible(false)
            },
            saveTrabajador :async function () {  
                let typeMsm = "information",
                    titleMsm = "¿Deseas continuar?"
                let ok = await this.MessageBoxPress(typeMsm,titleMsm)
                if(ok){
                    console.log("TODO OK")
                    let oModel = this.getView().getModel("myParam"); 
                    
                    let tipo = oModel.getProperty("/tipoConsultaPersonal");  
                    console.log("saveTrabajador tipo",tipo)
                    let trabajador = oModel.getProperty("/tempTrabajadorSelect");  
                    let ListRegistroMedico = oModel.getProperty("/ListRegistroMedico");  
                    let ListRegistroSCTR = oModel.getProperty("/ListRegistroSCTR");  
                    let getListRgstrDOC = oModel.getProperty("/getListRgstrDOC");   
                    //LOGICA PARA UNIR LAS LISTA DE DOCUMENTOS VERSION
                    let getListRgstrDOCVers = oModel.getProperty("/getListRgstrDOCVersiones");  
                    let listTempDocSubidos = oModel.getProperty("/listTempDocSubidos");  
                    //AQUI LOGICA PARA VERIFICAR QUE NOMBRES DE DOCUMENTOS NO SEAN IGUALES Y PODER SUBIRLO A CEMIS
                    let getListRgstrDOCVersTotal = [...getListRgstrDOCVers,...listTempDocSubidos]
    
                    //INSERTAR Y ACTUALIZAR DETALLES DEL TRABAJADOR
                    var formTrab = {
                        "PERS_REGMED": ListRegistroMedico,
                        "PERS_SCTR": ListRegistroSCTR,
                        "PERS_DOC": getListRgstrDOC,
                        "PERS_DOC_VER": getListRgstrDOCVersTotal,
                    }
                    // debugger
                    //FALTA IMPLEMENTAR LOS CAMBIOS
                    var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/INS_DETALLE_TRABAJADOR/1000/0/${trabajador.COD_PERSONAL}/${tipo}/0/0/0?sap-client=120`;
                    var dataRes = this.f_PostJsonData(url, formTrab,true) // envia nuevo registro
    
                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error en la solicitud");
                    }else{ 
                        MessageToast.show("Solicitud exitosa")
                        let ok = await this.MessageBoxPressOneOption("success",`Cambios realizados`)
                        if(ok){
                            // console.log("TODO OK")
                            // MessageBox.success(`${dataRes.ITAB[0].MESSAGE}`); 
                            this.onPageBack()
                            oModel.setProperty("/listTempDocSubidos",[]);  
                        }
                        //limpiar arreglo de documentos subidos temporalmente 
                        // let ojo = oModel.getProperty("/listTempDocSubidos");  
                    }
                }else{ MessageToast.show("Solicitud cancelada") }
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
                let listTable = oModel.getProperty(varListTable); 

                var oTable = this.getView().byId(varOTableId);
                var indiceEdit = oTable.getSelectedIndices();
                console.log("indiceEdit",indiceEdit)
                if (indiceEdit.length > 0 && indiceEdit < listTable.length  && listTable[indiceEdit] != undefined) {
                    console.log("indice seleccionado")
                    this.getView().byId(varPanel).setVisible(true)
                    // console.log("Registro A EDITAR.",listTable[indiceEdit]);
                    oModel.setProperty(varTemEdit,listTable[indiceEdit]);  //nombre de modelo temporal a editar
                    oModel.setProperty(varTemEditIndice,indiceEdit); //indice de modelo temporal a editar
                } else {
                    MessageToast.show("Seleccione un registro");
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
                console.log("indiceAEliminar ",indiceAEliminar)
                if (indiceAEliminar >= 0 && indiceAEliminar < list.length && list[indiceAEliminar] != undefined ) {
                    list.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/tableAccionesInformeIncidente",list);
                    console.log("Registro eliminado.");
                } else {
                    MessageToast.show("Seleccione un registro");
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
                let listTable = oModel.getProperty(varListTable); 

                var oTable = this.getView().byId(varOTableId);
                var indiceEdit = oTable.getSelectedIndices();
                console.log("indiceEdit",listTable[indiceEdit])
                debugger
                if (indiceEdit.length > 0 && indiceEdit < listTable.length  && listTable[indiceEdit] != undefined) {
                    console.log("indice seleccionado")
                    this.getView().byId(varPanel).setVisible(true)
                    // console.log("Registro A EDITAR.",listTable[indiceEdit]);
                    oModel.setProperty(varTemEdit,listTable[indiceEdit]); //nombre de modelo temporal a editar
                    oModel.setProperty(varTemEditIndice,indiceEdit); //indice de modelo temporal a editar
                } else {
                    MessageToast.show("Seleccione un registro");
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
                if (indiceAEliminar >= 0 && indiceAEliminar < list.length && list[indiceAEliminar] != undefined) {
                    list.splice(indiceAEliminar, 1); // Eliminar 1 elemento desde el índice dado
                    oModel.setProperty("/ListRegistroSCTR",list);
                    console.log("Registro eliminado.");
                } else {
                    MessageToast.show("Seleccione un registro");
                console.log("Índice inválido, no se eliminó ningún registro.");
                }  
            },
            //TABLA DE DOCUMENTOS NECESARIOS 
            revisarRDocsNecesario : function () {  
                let oModel = this.getView().getModel("myParam");  
                
                let docVersPersonal = oModel.getProperty("/getListRgstrDOCVersiones"); 

                let varOTableId = "idtableListDocNecesarios"
                let varListTable = "/ListDocumentosNecesario"
                let varTemVerDoc = "/versionesDocSelect" //MODELO PARA SELECCION DE DOCUMENTO
                
                let listTable = oModel.getProperty(varListTable); 
                var oTable = this.getView().byId(varOTableId);
                var indiceEdit = oTable.getSelectedIndices();
                console.log("indiceEdit",indiceEdit)
                if (indiceEdit.length > 0 && indiceEdit < listTable.length  && listTable[indiceEdit] != undefined) {
                    console.log("indice seleccionado")
                    this.getView().byId("tableRegistroDocs").setVisible(true)
                    console.log("Registro A EDITAR.",listTable[indiceEdit]);
                    //LOGICA PARA TRAER LOS DOC VERSION O FILTRAR Y PONERLO EN EL MODELO
                    console.log("docVersPersonal ",docVersPersonal)
                    console.log("listTable[indiceEdit].ZID_DOCUMENTO ",listTable[indiceEdit].ZID_DOCUMENTO)
                    const versDocSelect = docVersPersonal.filter(doc => {return  doc.ZID_DOCUMENTO === listTable[indiceEdit].ZID_DOCUMENTO});
                    let listTempDocSubidos = oModel.getProperty("/listTempDocSubidos"); 
                    const tempSubidoSelect = listTempDocSubidos.filter(doc => {return  doc.ZID_DOCUMENTO === listTable[indiceEdit].ZID_DOCUMENTO});
                    let totalVersDocSelect = [...versDocSelect,...tempSubidoSelect]
                    console.log("documentos filtrados de la seleccion",totalVersDocSelect)
                    oModel.setProperty("/selectDocNecesario",listTable[indiceEdit]); //modelo de version de documentos seleccionado
                    oModel.setProperty(varTemVerDoc,totalVersDocSelect); //modelo de version de documentos seleccionado
                    // debugger
                } else {
                    MessageToast.show("Seleccione un registro");
                    console.log("Índice inválido, SELECCIONEE UNO");
                }  
            },

             //TABLA DE LISTA DE  VERESION DE DOCUMENTOS
            addRDocs: function () { this.getView().byId("panelRDocs").setVisible(true) },
            // addRDocsEdit: function () { this.getView().byId("panelRDocsEdit").setVisible(true) },
            cancelRDocs: function () { 
                this.getView().byId("panelRDocs").setVisible(false) 
                this.getView().byId("panelRDocsEdit").setVisible(false) 
            }, 
            saveRDocs : function () {  
                console.log("saveRMedico")
                let oModel = this.getView().getModel("myParam");  
                let selectDocNecesario = oModel.getProperty("/selectDocNecesario");  
                let list = oModel.getProperty("/versionesDocSelect");  
                let tempTrabajadorSelect = oModel.getProperty("/tempTrabajadorSelect");  
                const oFileUploader = this.byId("RDocs_doc").oFileUpload.files[0];  
                var formData = {  
                    ZID_DOCUMENTO : selectDocNecesario.ZID_DOCUMENTO,
                    ZDOCUMENTO : "",
                    ZNOMBRE_DOC : oFileUploader.name,
                    ZVERSION :"",
                    ZOBSERVACION :"",
                    ZID_PERSONA : tempTrabajadorSelect.COD_PERSONAL, 
                    ZESTADO : "E",
                    //  ZFEC_VENCIMIENTO : this.getView().byId("SCTR_fechaVenc").getValue(), 
                } 
                console.log("formData",formData)
                list.push(formData)
                oModel.setProperty("/versionesDocSelect",list); 
                //logica agregar en el modelo temporal de archivos subidos
                let listTempDocSubidos = oModel.getProperty("/listTempDocSubidos");   
                listTempDocSubidos.push(formData)
                oModel.setProperty("/listTempDocSubidos",listTempDocSubidos); 
                // debugger
                
                // limpiar formulario
                let accionClean = [  
                    {id:"RDocs_doc"}
                ]
                this.limpiarObjeto(accionClean)
                this.cancelRDocs()
            },
            saveEditRDocs : function () {  
                let oModel = this.getView().getModel("myParam");   
                let dataDoc = oModel.getProperty("/temSelectDoc" );
                let varListTable = "/versionesDocSelect" 
                let varTemEditIndice = "/temSelectDocIndice" 
                console.log("dataDoc",dataDoc)
                ///guarda en el modelo tmporal versionesDocSelect
                let list = oModel.getProperty(varListTable);
                let tempEditId = oModel.getProperty(varTemEditIndice);
                var formData = {  
                    ZID_DOCUMENTO : dataDoc.ZID_DOCUMENTO,
                    ZDOCUMENTO : dataDoc.ZDOCUMENTO,
                    ZNOMBRE_DOC : dataDoc.ZNOMBRE_DOC, 
                    ZVERSION : dataDoc.ZVERSION,
                    ZOBSERVACION : this.getView().byId("RDocs_observacion").getValue(),
                    ZID_PERSONA : dataDoc.ZID_PERSONA,  
                    ZESTADO : this.getView().byId("RDocs_estado").getSelectedKey(),
                } 
                this.actualizarCamposPorIndice(list, tempEditId, formData); 
                oModel.setProperty(varListTable,list); 
                //logica de replica en la el modelo maestro   
                let modelMaestroDoc = oModel.getProperty("/getListRgstrDOCVersiones");
                // debugger
                // formData  // es el objeto con los cambios 
                this.actualizarArregloMaestro(modelMaestroDoc,formData) 
                console.log("data replicada ",modelMaestroDoc)

                this.cancelRDocs()
            },
            actualizarArregloMaestro : function (arregloMaestro, objeto) {
                const { ZVERSION, ZID_DOCUMENTO, ...nuevosCampos } = objeto;
              
                const indice = arregloMaestro.findIndex(registro => 
                  registro.ZVERSION === ZVERSION && registro.ZID_DOCUMENTO === ZID_DOCUMENTO
                );
              
                if (indice !== -1) {
                  arregloMaestro[indice] = { ...arregloMaestro[indice], ...nuevosCampos };
                }
            },
            deleteRDocs : function () {   
                let oModel = this.getView().getModel("myParam");  

                let varPanel = "panelRDocsEdit"
                let varListTable = "/versionesDocSelect"
                let varOTableId = "tableRegistroDocs"
                let listTable = oModel.getProperty(varListTable); 

                var oTable = this.getView().byId(varOTableId);
                var indiceEdit = oTable.getSelectedIndices();
                console.log("indiceEdit",listTable[indiceEdit])
                // debugger
                debugger
                if (indiceEdit.length > 0 && indiceEdit < listTable.length  && listTable[indiceEdit] != undefined) {
                    if(!listTable[indiceEdit].ZVERSION){
                        let dataSelect= listTable[indiceEdit]
                        console.log("indice seleccionado")
                        // ELIMINAR
                        listTable.splice(indiceEdit, 1); // Eliminar 1 elemento desde el índice dado
                        oModel.setProperty("/versionesDocSelect",listTable); 
                        //logica replica de eliminacion en la tabla temporal de archivos subidos 
                        let listDocTempSubidos = oModel.getProperty("/listTempDocSubidos");  //documentos temporales subidos
                        listDocTempSubidos = this.eliminarRegistroPorClaves(listDocTempSubidos,dataSelect.ZID_DOCUMENTO)
                        //guardar en los modelos
                        oModel.setProperty("/listTempDocSubidos",listDocTempSubidos); 
                        MessageToast.show("Registro eliminado."); 
                    }else{ 
                        MessageToast.show("Este  documento ya esta registrado");
                    }
                } else {
                    MessageToast.show("Seleccione un registro");
                    console.log("Índice inválido, SELECCIONEE UNO");
                }  
            },
            eliminarRegistroPorClaves : function (arregloMaestro, key) {   
                const indice = arregloMaestro.findIndex(registro =>
                    // registro.ZVERSION === ZVERSION && registro.ZID_DOCUMENTO === ZID_DOCUMENTO
                    registro.ZID_DOCUMENTO === key
                );
                console.log(indice)
                if (indice !== -1) {
                    arregloMaestro.splice(indice, 1);
                } 
                debugger
                return arregloMaestro
            },
            editRDocs : function () {  
                // let oModel = this.getView().getModel("myParam");  
                // let list = oModel.getProperty("/versionesDocSelect");   
                // var oTable = this.getView().byId("tableRegistroDocs");
                // var indice = oTable.getSelectedIndices();
                // console.log("indice",list[indice]);
                // if (indice >= 0 && indice < list.length && list[indice] != undefined) {
                //     // list.splice(indice, 1); // Eliminar 1 elemento desde el índice dado
                //     oModel.setProperty("/temSelectDoc",list[indice]);
                //     oModel.setProperty("/temSelectDocIndice",indice);
                //     console.log("Registro eliminado.");
                // } else {
                //     MessageToast.show("Seleccione un registro");
                //     console.log("Índice inválido, no se eliminó ningún registro.");
                // }  
                ////
                let oModel = this.getView().getModel("myParam");  

                let varPanel = "panelRDocsEdit"
                let varListTable = "/versionesDocSelect"
                let varOTableId = "tableRegistroDocs"
                let varTemEdit = "/temSelectDoc"
                let varTemEditIndice = "/temSelectDocIndice" 
                let listTable = oModel.getProperty(varListTable); 

                var oTable = this.getView().byId(varOTableId);
                var indiceEdit = oTable.getSelectedIndices();
                console.log("indiceEdit",listTable[indiceEdit])
                // debugger
                if (indiceEdit.length > 0 && indiceEdit < listTable.length  && listTable[indiceEdit] != undefined) {
                    debugger
                    if(listTable[indiceEdit].ZVERSION){
                        console.log("indice seleccionado")
                        this.getView().byId(varPanel).setVisible(true)
                        // console.log("Registro A EDITAR.",listTable[indiceEdit]);
                        oModel.setProperty(varTemEdit,listTable[indiceEdit]); //nombre de modelo temporal a editar
                        oModel.setProperty(varTemEditIndice,indiceEdit); //indice de modelo temporal a editar 
                    }else{ 
                        MessageToast.show("Este  documento aun no esta registrado");
                    }
                } else {
                    MessageToast.show("Seleccione un registro");
                    console.log("Índice inválido, SELECCIONEE UNO");
                }  
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
            f_GetJson: function (p_url_path,client120=false) {
                if(client120){
                    usuario = usuario120;
                    password = password120;
                }
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
            f_PostJsonSinData:  function (url,client120=falsel) { 
                if(client120){
                    usuario = usuario120;
                    password = password120;
                }
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
            f_PostJsonData:  function (url, dataForm,client120=false) { 
                if(client120){
                    usuario = usuario120;
                    password = password120;
                }
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
            
        });
    });
