sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("appss.aplicationss.controller.vTrabajador", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {

            }, 
            onPageBack : function () {  
                this.getRouter().getTargets().display("TargetvMain");
            },
            //PANEL TABLE DE REGISTRO MEDICO
            addRMedico: function () { this.getView().byId("panelRegistroMedico").setVisible(true) },
            cancelRMedico: function () { this.getView().byId("panelRegistroMedico").setVisible(false) }, 
            saveRMedico : function () {  
                console.log("saveRMedico")
                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty("/ListRegistroMedico");  
                var formData = { 
                    ZFEC_EMISION : this.getView().byId("RMedico_fecha").getValue(),
                    ZOBSERVACIONES : this.getView().byId("RMedico_obs").getValue(),
                    ZESTADO : this.getView().byId("RMedico_estado").getSelectedKey(),
                    ZFEC_VENCIMIENTO : this.getView().byId("RMedico_fechaVenc").getValue(), 
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
            cancelSCTR: function () { this.getView().byId("panelRegistroSCTR").setVisible(false) }, 
            saveSCTR : function () {  
                console.log("saveRMedico")
                let oModel = this.getView().getModel("myParam");  
                let list = oModel.getProperty("/ListRegistroSCTR");  
                var formData = { 
                    ZFEC_EMISION : this.getView().byId("SCTR_fecha").getValue(),
                    ZOBSERVACIONES : this.getView().byId("SCTR_obs").getValue(),
                    ZESTADO : this.getView().byId("SCTR_estado").getSelectedKey(),
                    ZFEC_VENCIMIENTO : this.getView().byId("SCTR_fechaVenc").getValue(), 
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
                var oTable = this.getView().byId("tableSCTR");
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
            //funciones generales 
            limpiarObjeto: function (arrayClean) {   
                // console.log(`arrayClean: ${arrayClean}`)
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
