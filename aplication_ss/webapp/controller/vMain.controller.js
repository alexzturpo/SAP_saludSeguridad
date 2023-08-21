 sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/core/Fragment", 
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet", 
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,Filter,FilterOperator,FilterType,Fragment,MessageToast,Spreadsheet) {
        "use strict";
        // var usuario = "CONSULT_MM";
        // var password = "Laredo2023.";
        var url_ini = "";
        var usuario = "CONSULT_PQ01";
        var password = "Rcom2023..";
        // var url_ini = "";

        return Controller.extend("appss.aplicationss.controller.vMain", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {
                
            },
            onAfterRendering:async function () {
                this.onPressBuscaerDocReporte()
                // console.log('INICIO GET LIST')
                this.getGerenciaAreaDepartamento()
                this.getListInc() 
                // this.getDataRESERVAEPP() 
                // this.getListEmpleado() 

                //datos iniciales inspecciones
                // this.getDataGerencia()
                // this.getDataArea()
                // this.getDataDepartamento()
                // this.getListInspeccion()
            },
            
            buscarTrabajadorAfectado:  function () {  
                console.log('getListEmpleado')
                var iCodTrabajador = this.getView().byId("gi_codEmp_afectado").getValue()
                console.log("iCodTrabajador",iCodTrabajador)
                var oModel = this.getView().getModel("myParam");  
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_PERSONAL/0/0/${iCodTrabajador}/0/0/0/0`;
                var dataRes =  this.f_GetJson(url) 
                console.log('getListEmpleado DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    // MessageToast.show("Error (" + dataRes.descripcion + ")");
                    MessageToast.show("No encontrado");
                }else{
                    dataRes= dataRes[0]
                    this.getView().byId("gi_codEmp_nombreAfec").setValue(dataRes.NOMBRE)
                    this.getView().byId("gi_codEmp_apellidoAfec").setValue(dataRes.APELLIDO)
                    this.getView().byId("gi_codEmp_dniAfec").setValue(dataRes.DNI)
                    this.getView().byId("gi_codEmp_areaTrabajoAfec").setValue(dataRes.AREA)
                    // oModel.setProperty('/listEmpleados',dataRes);  
                }
            },
            buscarTrabajadorTestigo:  function () {  
                console.log('getListEmpleado')
                var iCodTrabajador = this.getView().byId("gi_codEmp_informante").getValue()
                var oModel = this.getView().getModel("myParam");  
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_PERSONAL/0/0/${iCodTrabajador}/0/0/0/0`;
                var dataRes =  this.f_GetJson(url) 
                console.log('getListEmpleado DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    // MessageToast.show("Error (" + dataRes.descripcion + ")");
                    MessageToast.show("No encontrado");
                }else{
                    dataRes= dataRes[0]
                    this.getView().byId("gi_codEmp_nombreInf").setValue(dataRes.NOMBRE)
                    this.getView().byId("gi_codEmp_apellidoInf").setValue(dataRes.APELLIDO)
                    this.getView().byId("gi_codEmp_dniInf").setValue(dataRes.DNI)
                    this.getView().byId("gi_codEmp_areaTrabajoInf").setValue(dataRes.AREA)
                    // oModel.setProperty('/listEmpleados',dataRes);  
                }
            },
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
            getDataRucEmpresa: function () {

                var oView = this.getView();
                var oModel = oView.getModel("myParam");
                oView.setModel(oModel);
    
                //var url = "/odatabnv/odata2.svc/";
                var url = "" + this.varTableURL + "/";
                var oModelJson = new sap.ui.model.odata.v2.ODataModel(url, true);
                //oModelJson.read("/T_CENs?$format=json", {
                /*oModelJson.read("/" + this.varTableT_CEN + "?$format=json", {*/
                $.ajax({
                    type: "GET",                  
                    url: this.oBDURl + "T_CEN" ,
                    success: function (response) {
                        //var oModelJSON = new sap.ui.model.json.JSONModel(response.d.results);
                        console.log(response);
                        var tamTabla = oModelJSON.getData().length;
                        var vector = [];
                        var llave = {};
                        for (var i = 0; i < tamTabla; i++) {
                            llave = {};
                            llave.descripcion = oModelJSON.getData()[i].DES_EM;
                            llave.codigo = oModelJSON.getData()[i].RUC_EM;
                            vector.push(llave);
                        }
                        console.log(vector);
                    }.bind(this),
                    error: function (oError) {
                       
                        // Mensaje de Alerta de que termino el tiempo de sesión
                        console.log(oError);
                    }.bind(this)
                });
            },
            


            addTrabajador: function () {
                this.getRouter().getTargets().display("vNewTrabajador");
            },
            onSelectTrabajador: function (oEvent) {
                var oModel = this.getView().getModel("myParam"); 
                var ovalor= oEvent.mParameters.rowBindingContext.sPath;
                var oModel = this.getView().getModel("myParam");  
                var tipo = oModel.setProperty('/tipoConsultaPersonal');  
                var oDato= oModel.getProperty(ovalor);  
                console.log("onSelectTrabajador data",oDato);
                oModel.setProperty('/tempTrabajadorSelect',oDato);  
                
                var ocodigo=oDato.COD_PERSONAL;
                //ibtener tablas correspondientes del trabajador 
                this.onPressBuscaerInduccion(ocodigo,tipo);
                this.onPressBuscaerListRegistroMED(ocodigo,tipo);
                this.onPressBuscaerListRegistroSCTR(ocodigo,tipo);
                this.onPressBuscaerDocTrabajador(ocodigo,tipo);
                this.getRouter().getTargets().display("vTrabajador");
            },
            //ASSITENCIA
            //GMT//
            onPressBuscaerGCASISV1:function(e){
                console.log('getListPersonal')
                var oModel = this.getView().getModel("myParam");   
                let prov =  this.getView().byId("dateProv").getValue()  
                // let provNombre =  this.getView().byId("dateNombreProv").getValue()  
                let provRuc =  this.getView().byId("dateRucProv").getValue()  
                //definimos si consulta en el filtro es tipo P proveedor - S sociedad  
                let tipo
                let sociedad =  this.getView().byId("idsociedadAC").getValue()  
                if(sociedad){
                    //lista personal  por sociedad
                    console.log("lista personal  por sociedad")
                    var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_PERSONAL/${sociedad}/0/0/0/0/0/0`;
                    var dataRes =  this.f_GetJson(url) 
                    console.log('getListPersonal DATA ',dataRes)
                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error (" + dataRes.descripcion + ")");
                    }else{
                        oModel.setProperty('/ListPersonal',dataRes);  
                        this.getView().byId("btnAddContratista").setVisible(false)  
                        tipo = "S"
                    } 
                }
                if(prov){
                    //lista personal por proveedor
                    console.log("lista personal  por sociedad")
                    var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_PERSONAL/0/0/${prov}/0/0/0/0`;
                    var dataRes =  this.f_GetJson(url) 
                    console.log('getListPersonal DATA ',dataRes)
                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error (" + dataRes.descripcion + ")");
                    }else{
                        oModel.setProperty('/ListPersonal',dataRes);  
                        this.getView().byId("btnAddContratista").setVisible(true)  
                        tipo = "P"
                    } 
                }
                if(provRuc){
                    //lista personal por RUC
                    var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_CONTRATISTA/0/0/0/${provRuc}/0/0/0`;
                    var dataRes =  this.f_GetJson(url) 
                    console.log('getListPersonal DATA ',dataRes)
                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error (" + dataRes.descripcion + ")");
                    }else{
                        oModel.setProperty('/ListPersonal',dataRes);  
                        this.getView().byId("btnAddContratista").setVisible(true)  
                        tipo = "P"
                    } 
                }
                oModel.setProperty('/tipoConsultaPersonal',tipo);
            },
            onPressBuscaerInduccion:function(ocodigo,tipo){
                console.log('getListInducciong')
                var oModel = this.getView().getModel("myParam");  
                var sociedad = this.getView().byId("idsociedadAC").getValue();  
                // var tipo
                // contratista P
                // sociedad    S
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_INDUCCION/${sociedad}/0/${ocodigo}/${tipo}/0/0/0`;
                var dataRes =  this.f_GetJson(url) 
                console.log('getListInducciong DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/ListPersonalInduccion',dataRes);  
                }
        
            },
            onPressBuscaerListRegistroMED:function(ocodigo,tipo){
                console.log('getListRgstrMedico') 
                var oModel = this.getView().getModel("myParam");  
                var sociedad = this.getView().byId("idsociedadAC").getValue();  
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_REGISTRO/${sociedad}/0/${ocodigo}/${tipo}/0/0/0`;
                var dataRes =  this.f_GetJson(url) 
                console.log('getListRgstrMedico DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/ListRegistroMedico',dataRes);  
                }
        
            },
            onPressBuscaerListRegistroSCTR:function(ocodigo,tipo){
                console.log('getListRgstrSCTR')
                var oModel = this.getView().getModel("myParam");  
                var sociedad = this.getView().byId("idsociedadAC").getValue(); 
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_REGISTRO/${sociedad}/0/${ocodigo}/${tipo}/0/0/0`;
                var dataRes =  this.f_GetJson(url) 
                console.log('getListRgstrSCTR DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/ListRegistroSCTR',dataRes);  
                }
        
            },
            onPressBuscaerDocTrabajador:function(ocodigo,tipo){
                console.log('getListRgstrDOC')
                var oModel = this.getView().getModel("myParam");  
                var sociedad = this.getView().byId("idsociedadAC").getValue(); 
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_DOC_TRABAJADOR/${sociedad}/0/${ocodigo}/${tipo}/0/0/0`;
                var dataRes =  this.f_GetJson(url) 
                console.log('getListRgstrDOC DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/getListRgstrDOC',dataRes);  
                }
        
            },
            onPressBuscaerDocReporte:function(){
                console.log('getListRgstrREPORTE')               
                var oModel = this.getView().getModel("myParam");  
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_REP_CAP_TRABAJADOR/0/0/0/0/0/0/0 ";
                var dataRes =  this.f_GetJson(url) 
                console.log('getListRgstrREPORTE DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/getListRgstrREPORTE',dataRes);  
                }
        
            },
            onPressBuscaerGCASIS:function(e){
                var oModel = this.getView().getModel("myParam");  
                var t = this.getView().byId("idsociedadAC").getValue(); 
                var odataContratista= oModel.getProperty("/dataContratista") 
                if (t && t.length > 0) {
                    console.log(t, "sQuery");
                    var tabla = odataContratista.filter(e=>e.sociedad == t);
                    console.log(tabla);
                    oModel.setProperty("/dataContratistafilter", tabla);
                } else {
                    oModel.setProperty("/dataContratistafilter", []);
                }
        
            },
            onPressBuscaerRAASIS:function(e){
                var oModel = this.getView().getModel("myParam");  
                var t = this.getView().byId("dCodinducc").getValue(); 
                var odataInduccion= oModel.getProperty("/dataInduccion");
                var odataAsistente= oModel.getProperty("/dataasistentesInduccion");  
               
                console.log(odataInduccion);
                if (t && t.length > 0) {
                    console.log(t, "sQuery");
                    var tabla = odataInduccion.filter(e=>e.keyinduc == t);
                    var odataAsistente = odataAsistente.filter(e=>e.keyinduc == t);
                    var odataContratista= oModel.getProperty("/dataContratista"); 
                    var ListFasist=odataContratista.filter(e=>odataAsistente.find(x=>x.key === e.key));  
                    console.log(tabla);
                    if (tabla && tabla.length > 0) {
                        this.byId("dTituinducc").setValue(tabla[0].titulo);
                        this.byId("dDescrip").setValue(tabla[0].descrip);
                        this.byId("dFechaprog").setValue(tabla[0].fechaprog);
                    }else{
                        this.byId("dTituinducc").setValue("");
                        this.byId("dDescrip").setValue("");
                        this.byId("dFechaprog").setValue("");
                    };      
                    if (ListFasist.length > 0) {
                        oModel.setProperty("/dataAsistenteInd", ListFasist);
                    }else{
                        oModel.setProperty("/dataAsistenteInd", []);
                    }                  
                    //
                } else {
                    oModel.setProperty("/dataAsistenteInd", []);
                    this.byId("dTituinducc").setValue("");
                    this.byId("dDescrip").setValue("");
                    this.byId("dFechaprog").setValue("");

                }
        
            },
            onPressBuscaerRCAS:function(e){
                var oModel = this.getView().getModel("myParam");  
                var t = this.getView().byId("dCodinduccRC").getValue(); 
                var odataInduccion= oModel.getProperty("/dataInduccion");
                var odataAsistente= oModel.getProperty("/dataasistentesInduccion");  
               
                console.log(odataInduccion);
                if (t && t.length > 0) {
                    console.log(t, "sQuery");
                    var tabla = odataInduccion.filter(e=>e.keyinduc == t);
                    var odataAsistente = odataAsistente.filter(e=>e.keyinduc == t);
                    var odataContratista= oModel.getProperty("/dataContratista"); 
                    var ListFasist=odataContratista.filter(e=>odataAsistente.find(x=>x.key === e.key));  

                  
                    
      
                    if (tabla && tabla.length > 0) {
                        this.byId("dTituinduccRC").setValue(tabla[0].titulo);
                        this.byId("dDescripRC").setValue(tabla[0].descrip);
                        this.byId("dFechaprogRC").setValue(tabla[0].fechaprog);
                    }else{
                        this.byId("dTituinduccRC").setValue("");
                        this.byId("dDescripRC").setValue("");
                        this.byId("dFechaprogRC").setValue("");
                    };      
                    if (ListFasist.length > 0) {
                        console.log(tabla);
                        var llave={};
                        var vector=[];
                        for (var i = 0; i < ListFasist.length; i++) {
                            llave={};
                            llave=ListFasist[i];
                            llave.nota=odataAsistente.filter(e=>e.key==ListFasist[i].key).map(e=>e.nota).reduce((a,b)=>a+b);
                            llave.anexo=odataAsistente.filter(f=>f.key==ListFasist[i].key).map(f=>f.anexo).reduce((a,b)=>a+b);
                            vector.push(llave);
                        }

                        oModel.setProperty("/dataAsistenteIndNotas", ListFasist);
                    }else{
                        oModel.setProperty("/dataAsistenteIndNotas", []);
                    }                  
                    //
                } else {
                    oModel.setProperty("/dataAsistedataAsistenteIndNotasnteInd", []);
                    this.byId("dTituinduccRC").setValue("");
                    this.byId("dDescripRC").setValue("");
                    this.byId("dFechaprogRC").setValue("");

                }
        
            },
            onDialogUserAgregar: function () {
                this._setUserAgregar().open()
            },
            _setUserAgregar: function () {
                var e = this.getView();
                if (!this.dUserAgregar) {
                    this.dUserAgregar = sap.ui.xmlfragment("idFragmentUserAgregar", "appss.aplicationss.view.fragments.dialogAsisAgregar", this)
                }
                e.addDependent(this.dUserAgregar);
                return this.dUserAgregar
            },
            onDuserAgregarAceptar: function () { 
                var model = this.getView().getModel("myParam");
                var centrog = sap.ui.core.Fragment.byId("idFragmentUserAgregar", "dUserAdd004i").getValue();
                var descentro = sap.ui.core.Fragment.byId("idFragmentUserAgregar", "dUserAdd005i").getValue();
                var realizador = sap.ui.core.Fragment.byId("idFragmentUserAgregar", "dUserAdd006i").getValue();
                var revisor = sap.ui.core.Fragment.byId("idFragmentUserAgregar", "dUserAdd007i").getValue();
                var cegepa = sap.ui.core.Fragment.byId("idFragmentUserAgregar", "dUserAdd008i").getValue();                     
                                              
                var n = {
                    CENTROG: centrog,
                    DESCCENTRO: descentro,
                    REALIZADOR: realizador,
                    REVISOR: revisor,
                    USERMOD: "admin",
                    FECHAMOD: this.oGlobalFechaZ,
                    CEGEPA: cegepa, 
                    CODAREA: codarea.AREA
                };
                console.log("objeto",n);         
                this._setUserAgregar().close()
            },
            onDuserAgregarCancelar: function () {
                this._setUserAgregar().close()
            },
            //REGISTRAR CALIFICACION
            onDialogcalifeditar: function () {
                var e = this.getView().getModel("myParam");
                var a = this.byId("table01AsisCalif");
                var t = a.getSelectedIndex();
                
                var r;
                if (t < 0) {
                    r = "No existe item seleccionado";
                    sap.m.MessageToast.show(r)
                } else {
                    //var o = e.getProperty("/tbl_T_USUARIOS/" + t);
                    var objeto=a.getContextByIndex(t).getObject()
                    var s = [objeto];
                    console.log(s);
                    e.setProperty("/datosTableUserEdit", s);
                    this._getDialogUsuario().open()
                }
            },
            _getDialogUsuario: function () {
                var e = this.getView();
                if (!this.dialogUser) {
                    this.dialogUser = sap.ui.xmlfragment("idFragmentUsuario", "appss.aplicationss.view.fragments.dialogUsuario", this)
                }
                e.addDependent(this.dialogUser);
                return this.dialogUser
            },
            onDuserAgregarCalifAceptar: function () { 
                var oModel = this.getView().getModel("myParam");
                var datafilter = oModel.getProperty("/datosTableUserEdit");              
                 
                MessageBox.success("Registro actualizado correctamente");      
                this._getDialogUsuario().close()
            },
            onDuserAgregarCalifCancelar: function () {
                this._getDialogUsuario().close()
            },
            //REPORTE
            excelDownloadREPASIS: function (ele) { 
                console.log("excelDownload",ele);            
                let objEstruc = [
                    {label:"Empresa",property:"KEY",type:"string"},
                    {label:"Apellidos",property:"APELLIDO",type:"string"},
                    {label:"Nombres",property:"NAME",type:"string"},
                    {label:"DNI",property:"DNI",type:"string"},
                    {label:"Nota de evaluación",property:"NOTA",type:"string"},
                    {label:"Fecha de inducción general",property:"FECHAINDG",type:"string"},
                    {label:"Fecha vencimiento indución general",property:"FECHAVENCINDGRAL",type:"string"},
                    {label:"Fecha indución especifica",property:"FECHAINDESP",type:"string"},
                    {label:"Fecha vencimiento indución especifica",property:"FECHAVENCINDESP",type:"string"},
                    {label:"Examen médico",property:"EXAMEN",type:"string"},
                    {label:"Aptitud",property:"APTITUD",type:"string"},
                    {label:"Vigencia de examen médico ocupacional",property:"VIG",type:"string"},
                    {label:"Requiere evaluación médica",property:"REQEVAL",type:"string"},
                    {label:"SCTR",property:"SCTR",type:"string"},
                    {label:"Fecha de vencimiento del SCTR",property:"SCTRFV",type:"string"},                
                ]
                console.log("objEstruc",objEstruc); 
                // var oModel = this.getView().getModel("myParam");  
                // let listInspeccion = oModel.getProperty("/listInspeccion"); 
                let list = this.getView().getModel("myParam").getProperty("/" + ele);
                let oSettings = {
                    workbook: {
                        columns: objEstruc
                    },
                    dataSource: list,
                    fileName: "Reporte.xlsx"
                };
                let oSheet = new sap.ui.export.Spreadsheet(oSettings);           
                console.log("oSheet",oSheet);            
                oSheet.build().then(function () {
                    sap.m.MessageToast.show("Se realizó la exportación con éxito.")
                }.bind(this)).finally(function () {
                    oSheet.destroy()
                }.bind(this)) 
            }, 
            //GENERAR CODIGO 4 DIGITOS
            getCod: function () {
                var min = 1000; // Mínimo valor de 4 dígitos (1000)
                var max = 9999; // Máximo valor de 4 dígitos (9999)
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            // GESTION DE INCIDENTES 
                        
            newIncidente: function () {
                let oModel = this.getView().getModel("myParam");  
                // creando nuevo incidentes 
                let newIncidenteForm = [{
                    ZTITULO: this.getView().byId("gi_new_titulo").getValue(),
                    ZDESCRIPCION: this.getView().byId("gi_new_descrip").getValue(),
                    ZACCIONES: this.getView().byId("gi_new_accionInmediata").getValue(),
                    
                    ZSOCIEDAD: this.getView().byId("gi_new_sociedad").getValue(),
                    ZUBICACION: this.getView().byId("gi_new_ubicacion").getValue(),
                    ZDETALLE: this.getView().byId("gi_new_detalle").getValue(),
                    // invPreliminar: "",

                    ZFECHA: this.cambiarFormatoFecha(this.getView().byId("gi_new_fecha").getValue()),
                    ZHORA: this.getView().byId("gi_new_hora").getValue(),

                    ZID_COD_TRABAJADOR: this.getView().byId("gi_codEmp_afectado").getValue(), //codigo de empleado afectado
                    ZID_COD_INFORMANTE: this.getView().byId("gi_codEmp_informante").getValue(), //codigo de empleado informante
                    ZMANIFESTACION: this.getView().byId("gi_codEmp_detalleInf").getValue(), 
                    ZESTADO: "N"
                }]
                console.log("newIncidenteForm",newIncidenteForm)

                var urlAjax = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/INS_INC/1000/0/0/0/0/0/0" 
                var dataRes = this.f_PostJsonData(urlAjax, newIncidenteForm) // envia nuevo registro

                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{ 
                    MessageToast.show("Solicitud exitosa")
                    let objClean = [
                        {id:"gi_new_titulo"},
                        {id:"gi_new_descrip"},
                        {id:"gi_new_accionInmediata"},
                        {id:"gi_new_sociedad"},
                        {id:"gi_new_ubicacion"},
                        {id:"gi_new_detalle"},
                        {id:"gi_new_fecha"},
                        {id:"gi_new_hora"},
                        {id:"gi_codEmp_afectado"},
                        {id:"gi_codEmp_informante"},

                        {id:"gi_codEmp_nombreAfec"},
                        {id:"gi_codEmp_apellidoAfec"},
                        {id:"gi_codEmp_dniAfec"},
                        {id:"gi_codEmp_areaTrabajoAfec"},

                        {id:"gi_codEmp_nombreInf"},
                        {id:"gi_codEmp_apellidoInf"},
                        {id:"gi_codEmp_dniInf"},
                        {id:"gi_codEmp_areaTrabajoInf"},
                        {id:"gi_codEmp_detalleInf"},
                    ] 
                    this.limpiarObjeto(objClean) // vuelve a consultar toda los incidentes y actualizar los registros 
                    this.getListInc() 
                }
                //creando nuevo INFORME de incidente
                // let newInformeIncidente = {
                //     ZACTOS_SUBESTAND: "",
                //     ZCOND_SUBESTAND: "",
                //     ZFACT_PERSONALES: "", 
                //     ZFACT_TRABAJO: "",
                //     ZLECCIONES: "",
                //     ZINVEST_POR: "", 
                //     ZCARGO: "",
                //     ZHORA: "", 
                //     ZFIRMA: ""
                // } 
                // oModel.setProperty("/tableAccionesInformeIncidente",[newInformeIncidente]); 
                // selectIncidenteInforme
            },
            f_PostJsonData:  function (url, dataForm) { 
                // console.log("INICIO f_PostJsonData")
                const credentials = btoa(`${usuario}:${password}`); 
                // let url= url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/INS_INC/1000/0/0/0/0/0/0"
                var res = null
                var oVector = dataForm
                $.ajax(url, {
					type: "POST",
                    data: JSON.stringify(oVector),
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
            onSelectTbIncidente: function (evt) {
                let oModel = this.getView().getModel("myParam");   
                var context = evt.getParameters().rowBindingContext; 
                // console.log("context", context)
                var objeto = context.getObject(); 
                // console.log("objeto", objeto)

                //consulta sobre el INCIDENTE seleccionado  | consultar data de INFORME para el incidente seleccionado
                var urlIncidente = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_INC/1000/0/${objeto.ZINCIDENTE}/0/0/0/0`;
                var dataIncidente = this.f_GetJson(urlIncidente)
                    console.log('onSelectTbIncidente DATA ',dataIncidente[0])
                    if(dataIncidente.cod != undefined && dataIncidente.cod == 'Error'){
                        MessageToast.show("Error (" + dataIncidente.descripcion + ")");
                    }else{ 
                        dataIncidente = dataIncidente[0]
                        console.log("selectIncidente",dataIncidente)
                        oModel.setProperty("/selectIncidente",dataIncidente);
                    }
                //consulta sobre la tabla de DOCUMENTOS del incidente seleccionado
                var urlListDocIncidente = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_DOC_INC/1000/0/${objeto.ZINCIDENTE}/0/0/0/0`;
                var dataListDoc = this.f_GetJson(urlListDocIncidente) 
                    console.log('dataListDoc DATA ',dataListDoc)
                    if(dataListDoc.cod != undefined && dataListDoc.cod == 'Error'){
                        MessageToast.show("Error (" + dataListDoc.descripcion + ")");
                    }else{ 
                        oModel.setProperty("/docTableIncidente",dataListDoc);
                    } 
                // OBTENER TABLA DE ACCIONES CORERCTIVA Y PREEVENTIVAS INFORME
                var urlInforme = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_INFORME2/1000/0/${objeto.ZINCIDENTE}/0/0/0/0`;
                var dataInforme = this.f_GetJson(urlInforme) 
                console.log('DATA TB CORRECTIVO PREVENTICO',dataInforme)
                if(dataInforme.cod != undefined && dataInforme.cod == 'Error'){
                    MessageToast.show("Error (" + dataInforme.descripcion + ")");
                }else{ 
                    oModel.setProperty("/tableAccionesInformeIncidente",dataInforme);
                }  
                // oModel.setProperty("/selectIncidente",objeto); //modelo de data de incidente sin. consultar a JSON.  BORRAR
                if(objeto.ZESTADO != 'T'){
                    //redirigir a la vista de incidente detalle 
                    this.getRouter().getTargets().display("vIncidente"); 
                }else{
                    MessageToast.show("Estado del incidente TERMINADO")  
                    //vista de de incidente de detalle que no se puede modificar nada 
                    // this.getRouter().getTargets().display("vIncidente"); 
                } 
            },
            idguardarnewINDAI : function (e) {  
                console.log(e);
                var oModel = this.getView().getModel("myParam");  
                var oidcodigoAI = this.getView().byId("idcodigoAI").getValue(); 
                var oidtituloAI = this.getView().byId("idtituloAI").getValue(); 
                var oiddescripcionAI = this.getView().byId("iddescripcionAI").getValue(); 
                var oidfechaprogAI = this.getView().byId("idfechaprogAI").getValue(); 
             
                var datafilter = oModel.getProperty("/dataInduccion");
                var llave = {};
                llave.keyinduc=oidcodigoAI;
                llave.key="1";
                llave.sociedad="1001";
                llave.titulo=oidtituloAI;
                llave.descrip=oiddescripcionAI;
                llave.fechaprog=oidfechaprogAI;
             
                MessageBox.success("Registro agregado correctamente");
                datafilter.push(llave);
                oModel.setProperty("/dataInduccion",datafilter); 
            },
            buscarIncidentes: function () { 
                console.log("buscarIncidentes")
                let oTable = this.getView().byId("tbIncidentes"); 
                let objBusqueda = [
                    {id:"bNIncidente",tabAtr:"ZINCIDENTE"},
                    {id:"bCodAfectado",tabAtr:"ZID_COD_TRABAJADOR"},
                    {id:"bFechaInc",tabAtr:"ZFECHA", iFecha:true},
                    {id:"bStatus",tabAtr:"ZESTADO", iSelect:true},
                 ] 
                 let comFil = this.comFilBusqueda(objBusqueda) 
                 console.log("array que filtra",comFil);
                 var oFilter = new sap.ui.model.Filter({
                     filters: comFil,
                     and: true
                 });
                 oTable.getBinding("rows").filter(oFilter, FilterType.Application);
            },
            comFilBusqueda: function (miArray) {
                let result = [];
                miArray.forEach(item => {
                    let valor
                    if(item.iSelect){
                        valor = this.getView().byId(item.id).getSelectedKey(); 
                    }else{
                        valor = this.getView().byId(item.id).getValue(); 
                    }
                    console.log("valor item FILTRO "+item.tabAtr,valor)
                    if (valor) {
                        console.log("prime if CON DATO" ,item.id)
                        if (item.iFecha) {
                            const fechaFormateada = this.cambiarFormatoFecha(valor);
                            console.log("fechaFormateada",fechaFormateada)
                            result.push(new sap.ui.model.Filter(item.tabAtr, sap.ui.model.FilterOperator.Contains, fechaFormateada));
                        } else {
                            result.push(new sap.ui.model.Filter(item.tabAtr, sap.ui.model.FilterOperator.Contains, valor));
                        }
                    }
                });
                return result;

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
                //informe de incidentes
            addInfoCorrectivo: function () {  
                this.getView().byId("panelInfoCorrectivo").setVisible(true)
            },
            cancelInfoCorrectivo: function () {  
                this.getView().byId("panelInfoCorrectivo").setVisible(false)
            },

            addInfoPreventivo: function () {  
                this.getView().byId("panelInfoPreventivo").setVisible(true)
            },
            cancelInfoPreventivo: function () {  
                this.getView().byId("panelInfoPreventivo").setVisible(false)
            },

            //GESTION DE INSPECCION DE TRABAJO
            //NUEVA INSPECCION
            // funciones generales para los input con fragment
            dialogsSearch: function (oEvent,arrSearch,sValue) { 
                let comFil = []; 
                for (const objeto of arrSearch) { 
                    console.log("objeto BUSQUEDA",objeto )
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
                console.log("ID INPUT",sDescription)
                this.getView().byId(idInput).setValue(sDescription); 
                // this.byId(idInput).setValue(sDescription); 
            }, 
             
            //input EMPLEADO
                // changeListEmpleado: function () { this._dgListEmpleado().open() },
                // _dgListEmpleado: function () { 
                //     var e = this.getView();
                //     if (!this.dgListEmpleado) {
                //         this.dgListEmpleado = sap.ui.xmlfragment("idDgInputListEmpleado", "appss.aplicationss.view.fragments.dgInputListEmpleado", this)
                //     }
                //     e.addDependent(this.dgListEmpleado);
                //     return this.dgListEmpleado 
                // },
                // dgSearchListEempleado: function (oEvent) { 
                //     var sValue = oEvent.getParameter("value"); 
                //     let arrSearch = [
                //         {atr:"ZGERENCIA"},
                //         {atr:"ZDESCRIPCION"}
                //     ] 
                //     this.dialogsSearch(oEvent,arrSearch,sValue)
                // }, 
                // dgGetCloseListEempleado: function (oEvent) { 
                //     let idInput = "gInsp_gerencia"
                //     this.dialogGetValueClose(oEvent,idInput)
                // },
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
                    {atr:"STEXT"},
                    {atr:"ORGEH"}
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
                    {atr:"DESCRIP"},
                    {atr:"DIVISION"}
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
                    {atr:"DESCRIP"},
                    {atr:"DEPARTAM"}
                ] 
                this.dialogsSearch(oEvent,arrSearch,sValue)
            }, 
            dgGetCloseDtpo: function (oEvent) {
                let idInput = "gInsp_departamento"
                this.dialogGetValueClose(oEvent,idInput)
            },
            //funciones MODULOS EPPs
            vDevolucionEpp: function () {
                this.getRouter().getTargets().display("vDevolucionEpp");
            },
            addRequerientoEpp: function () {
                this.getRouter().getTargets().display("vNewRequerimientoEpp");
            },
            visualizarEpp: function () {
                this.getRouter().getTargets().display("vVisualizarEpp");
            },
            entregaEpp: function () {
                this.getRouter().getTargets().display("vEntregarEpp");
            },
            getDataRESERVAEPP:  function () { 
                var oModel = this.getView().getModel("myParam");

                /*let incidenteForm = {"cabecera" : {
                    ZRESERVA:this.getView().byId("gi_codEmp_afectado").getValue(),
                    ZID_COD_TRABAJADOR: this.getView().byId("gi_codEmp_afectado").getValue(), //codigo de empleado afectado
                    ZFECHA: this.cambiarFormatoFecha(this.getView().byId("gi_new_fecha").getValue()),
                    ZHORA: this.getView().byId("gi_new_hora").getValue(),
                    ZSTATUS: this.cambiarFormatoFecha(this.getView().byId("gi_new_fecha3").getValue()),             
                },}*/
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_RESERVA_EPPS/0/0/1/0/0/0/0?sap-client=100"; 
               
                var dataRes = this.f_PostJsonData(url, incidenteForm) // envia nuevo registro
                console.log('getListReserva EPP DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/dataTab',dataRes);  
                }
            },
            getDataINSRESERVAEPP:  function () { 
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/INS_RESERVA_EPPS/1000/0/0/0/0/0/0?sap-client=100"; 
               
                var dataRes =  this.f_GetJson(url) 
                console.log('INS_RESERVA_EPPS EPP DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/dataTab_Nuevo',dataRes);  
                }
            },

            getGerenciaAreaDepartamento:  function () { 
                var oModel = this.getView().getModel("myParam");
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_NIVEL/1000/0/0/0/0/0/0"; 
               
                var dataRes =  this.f_GetJson(url) 
                dataRes = dataRes[0]
                console.log('getGerenciaAreaDepartamento DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/ZSYSO_GERENCIASet',dataRes.GERENCIA);  
                    oModel.setProperty('/ZSYSO_AREASet',dataRes.AREA); 
                    oModel.setProperty('/ZSYSO_DPTO',dataRes.DEPARTAMENTO);   
                }
            },

            // getDataGerencia:  function () { 
            //     var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_INC/1000/0/0/0/0/0/0?sap-client=100"; 
               
            //     var dataRes =  this.f_GetJson(url) 
            //     console.log('getDataGerencia DATA ',dataRes)
            //     if(dataRes.cod != undefined && dataRes.cod == 'Error'){
            //         MessageToast.show("Error (" + dataRes.descripcion + ")");
            //     }else{
            //         oModel.setProperty('/ZSYSO_GERENCIASet',dataRes);  
            //     }
            // },
            // getDataArea:  function () { 
            //     var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_INC/1000/0/0/0/0/0/0?sap-client=100";
                
            //     var dataRes =  this.f_GetJson(url) 
            //     console.log('getDataArea DATA ',dataRes)
            //     if(dataRes.cod != undefined && dataRes.cod == 'Error'){
            //         MessageToast.show("Error (" + dataRes.descripcion + ")");
            //     }else{
            //         oModel.setProperty('/ZSYSO_AREASet',dataRes);  
            //     }
            // },
            // getDataDepartamento:  function () { 
            //     var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_INC/1000/0/0/0/0/0/0?sap-client=100";
                
            //     var dataRes =  this.f_GetJson(url) 
            //     console.log('getDataArea DATA ',dataRes)
            //     if(dataRes.cod != undefined && dataRes.cod == 'Error'){
            //         MessageToast.show("Error (" + dataRes.descripcion + ")");
            //     }else{
            //         oModel.setProperty('/ZSYSO_DPTO',dataRes);  
            //     }
            // },
    
            //Nueva Inspeccion
                    // setCod: function (array) {
                    //     let maxCodigo = 0; 
                    //     // Recorre el array para encontrar el mayor valor de ZINSPECCION
                    //     for (const item of array) {
                    //         const codigoActual = parseInt(item.ZINSPECCION, 10);
                    //         if (!isNaN(codigoActual) && codigoActual > maxCodigo) {
                    //         maxCodigo = codigoActual;
                    //         }
                    //     } 
                    //     // Genera el nuevo código consecutivo sumándole 1 al mayor valor y formateándolo con ceros a la izquierda
                    //     const nuevoCodigo = (maxCodigo + 1).toString().padStart(4, '0'); 
                    //     return nuevoCodigo;
                    // },
            getListInspeccion:  function () { 
                var filtro = {
                    ZINSPECCION: this.getView().byId("Iinspeccion").getValue(),
                    ZGERENCIA: this.getView().byId("Igerencia").getValue(),
                    ZAREA: this.getView().byId("Iarea").getValue(),
                    ZDPTO: this.getView().byId("Idepartamento").getValue(),
                    ZFEC_PROGRAM: this.getView().byId("Ifechap").getValue(),
                    ZESTADO: this.getView().byId("Istatus").getValue(),
                }
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_INSP/1000/0/0/0/0/0/0?sap-client=100";
                
                var dataRes = this.f_PostJsonData(url, filtro) // envia nuevo registro

                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{ 
                    MessageToast.show("Solicitud exitosa")
                    // this.limpiarObjeto(objClean) // vuelve a consultar toda los incidentes y actualizar los registros 
                    // this.getListInc() 
                } 
            },
            test: async function () {
                let objInspeccionClean = [
                    {id:"gInsp_gerencia"},
                    {id:"gInsp_area"},
                    {id:"gInsp_departamento"},
                    {id:"gInsp_programada"}
                ] 
                this.limpiarObjeto(objInspeccionClean)
            },
            seveNewInspeccion: async function () {
                let typeMsm = "information",
                    titleMsm = "¿Deseas continuar?"
                let ok = await this.MessageBoxPress(typeMsm,titleMsm)
                if(ok){
                    var oModel = this.getView().getModel("myParam");  
                    // let listInspeccion = oModel.getProperty("/listInspeccion");
                    // let listInspeccion = oModel.getProperty("/ZSYSO_INSPECCION");
                    let objInspeccion = [{ 
                        // ZINSPECCION: this.setCod(listInspeccion),
                        ZGERENCIA: this.getView().byId("gInsp_gerencia").getValue(),
                        ZAREA: this.getView().byId("gInsp_area").getValue(),
                        ZDPTO: this.getView().byId("gInsp_departamento").getValue(),
                        ZFEC_PROGRAM: this.cambiarFormatoFecha(this.getView().byId("gInsp_programada").getValue()),
                        ZESTADO: "N"
                    }]
                    console.log("objInspeccion antes de SAVE",objInspeccion) 
                    //GUARDAR LA INSPECCION POST 

                    // listInspeccion.push(objInspeccion)
                    var urlAjax = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/INS_INSP/1000/0/0/0/0/0/0` 
                    var dataRes = this.f_PostJsonData(urlAjax, objInspeccion) // envia nuevo registro

                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error (" + dataRes.descripcion + ")");
                    }else{ 
                        console.log("RESPUESTA DE GRABADO",dataRes)
                        MessageToast.show(`Solicitud exitosa INSPECCION: ${dataRes.ITAB[0].PARAMETER}`)
                        // this.limpiarObjeto(objClean) // vuelve a consultar toda los incidentes y actualizar los registros 
                        // this.getListInc() 
                    } 

                    // oModel.setProperty("/ZSYSO_INSPECCION",listInspeccion); 

                    // sap.m.MessageToast.show("Realizado correctamente")

                    let objInspeccionClean = [
                        {id:"gInsp_gerencia"},
                        {id:"gInsp_area"},
                        {id:"gInsp_departamento"},
                        {id:"gInsp_programada"}
                    ] 
                    this.limpiarObjeto(objInspeccionClean)
                }else{
                    sap.m.MessageToast.show("Cancelado") 
                }
                console.log("CONFIRMACION : ",ok)

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
            // actionOK: function () { console.log(" FUNCION A EJECUTAR OK")},

            //ver inspeccion
            buscarInspecciones: function () { 
                let oModel = this.getView().getModel("myParam");  
                console.log("buscarInspecciones") 
                var filtro = {
                    ZINSPECCION: this.getView().byId("Iinspeccion").getValue(),
                    ZGERENCIA: this.getView().byId("Igerencia").getValue(),
                    ZAREA: this.getView().byId("Iarea").getValue(),
                    ZDPTO: this.getView().byId("Idepartamento").getValue(),
                    ZFEC_PROGRAM: this.getView().byId("Ifechap").getValue(),
                    ZESTADO: this.getView().byId("Istatus").getValue(),
                }
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_INSP/1000/0/0/0/0/0/0?sap-client=100";
                
                console.log("buscarInspecciones filtro",filtro)
                var dataRes = this.f_PostJsonData(url, filtro) // envia nuevo registro

                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{ 
                    dataRes = dataRes.ITAB
                    console.log("dataRes",dataRes)
                    MessageToast.show("Solicitud exitosa")
                    oModel.setProperty("/ZSYSO_INSPECCION",dataRes);
                    // ZSYSO_INSPECCION
                    // this.limpiarObjeto(objClean) // vuelve a consultar toda los incidentes y actualizar los registros 
                    // this.getListInc() 
                } 

                //LOGICA DE ABAJO FILTRA CUANDO TE EL INICIAR LA VISTA YA TE TRAER TODAS LAS INSPECCIONES
                // let idTable = "tbInspecciones"; 
                // let objBusqueda = [
                //     {id:"Iinspeccion",tabAtr:"ZINSPECCION"},
                //     {id:"Igerencia",tabAtr:"gerencia"},
                //     {id:"Iarea",tabAtr:"area"},
                //     {id:"Idepartamento",tabAtr:"ZDPTO"},
                //     {id:"Ifechap",tabAtr:"ZFEC_PROGRAM",fecha:true},
                //     {id:"Istatus",tabAtr:"ZESTADO"},
                //  ] 
                //  this.fBusqueda(objBusqueda,idTable)
                 
            },
            fBusqueda: function (objBusqueda,idTable) {
                let comFil = [];
                let oTable = this.getView().byId(idTable); 
                for (var i = 0; i < objBusqueda.length; i++) { 
                    let valor = this.getView().byId( objBusqueda[i].id ).getValue();
                    if (valor != "") {
                        if (objBusqueda[i].fecha) {
                            console.log("valor I",valor)
                            valor = valor
                            console.log("valor F",valor)
                        }  
                        var oFilter = new sap.ui.model.Filter (objBusqueda[i].tabAtr, sap.ui.model.FilterOperator.Contains, valor);
                        comFil.push(oFilter);
                    }  
                } 
                 var oFilter = new sap.ui.model.Filter({
                     filters: comFil,
                     and: true
                 });
                 oTable.getBinding("rows").filter(oFilter, FilterType.Application)
              }, 

            updateKey: function (miArray,nuevoObjeto,codigoBuscado) {   
                //LOGICA DE ACTUALIZAR 
                for (var i = 0; i < miArray.length; i++) {
                    if (miArray[i].codigo === codigoBuscado) {
                    miArray[i] = nuevoObjeto; // Reemplazar el objeto si tiene el mismo código
                    }
                }
                return miArray  
            },
            selectTabInspecciones: function (evt) {
                let oModel = this.getView().getModel("myParam");  
                // this.getRouter().getTargets().display("vIncidente"); 
                let objTab = evt.getParameters().rowBindingContext.getObject();
                console.log("objeto", objTab) 
                if(objTab.ZESTADO !== "F"){
                    // consulta ala inspeccion seleccionada  traer la data de esa inspeccion 
                    var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_INSP/1000/0/${objTab.ZINSPECCION}/0/0/0/0?sap-client=100`;
                    
                    var dataRes =  this.f_GetJson(url) 
                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error (" + dataRes.descripcion + ")");
                    }else{
                        dataRes = dataRes[0]
                        console.log('selectTabInspecciones DATA ',dataRes)
                        oModel.setProperty("/tempInspecciones",dataRes);
                        this.getRouter().getTargets().display("vInspeccion");  
                    } 
                    //CONSULTAS PARA OBTENER TABLAS 
                    //TABLA INVOLUCRADOS
                    var urlTabInv = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_PERS_INVOLUC/1000/0/${objTab.ZINSPECCION}/0/0/0/0?sap-client=100`
                    var dataRes =  this.f_GetJson(urlTabInv) 
                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error (" + dataRes.descripcion + ")");
                    }else{
                        console.log('tabPerInvolucrados DATA ',dataRes)
                        oModel.setProperty("/tabPerInvolucrados",dataRes);
                    }  
                    //TABLA ASOCIADOS - OK
                    var urlTabAsoc = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_RIESGO_ASOC/1000/0/${objTab.ZINSPECCION}/0/0/0/0?sap-client=100`
                    var dataRes =  this.f_GetJson(urlTabAsoc) 
                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error (" + dataRes.descripcion + ")");
                    }else{
                        console.log('tabRiAsociados DATA ',dataRes)
                        oModel.setProperty("/tabRiAsociados",dataRes);
                    }  
                    //TABLA CORRECTIVA - OK
                    var urlTabCorr = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_MEDIDA_CORR/1000/0/${objTab.ZINSPECCION}/0/0/0/0?sap-client=100`
                    var dataRes =  this.f_GetJson(urlTabCorr) 
                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error (" + dataRes.descripcion + ")");
                    }else{
                        console.log('tabMedCorrectiva DATA ',dataRes)
                        oModel.setProperty("/tabMedCorrectiva",dataRes);
                    } 
                    //TABLA RESPONSABLES - OK
                    var urlTabResp = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_RESP_RIESGO/1000/0/${objTab.ZINSPECCION}/0/0/0/0?sap-client=100`
                    var dataRes =  this.f_GetJson(urlTabResp) 
                    if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                        MessageToast.show("Error (" + dataRes.descripcion + ")");
                    }else{
                        console.log('tabResponsables DATA ',dataRes)
                        oModel.setProperty("/tabResponsables",dataRes);
                    }  
                    //ENVIAR ALA VISTA DE INSPECCION
                    this.getRouter().getTargets().display("vInspeccion");  
                } 
            },
            excelDownload: function (ele) { 
                console.log("excelDownload",ele);            
                let objEstruc = [
                    {label:"Cod. Inspección",property:"codInsp",type:"string"},
                    {label:"Área",property:"area",type:"string"},
                    {label:"Departamento",property:"departamento",type:"string"},
                    {label:"Jefatura a cargo",property:"jefaturaCargo",type:"string"},
                    {label:"Observación",property:"objs",type:"string"},
                    {label:"Fecha reporte",property:"freporte",type:"string"},
                    {label:"Mes",property:"mes",type:"string"},
                    {label:"Año",property:"anio",type:"string"},
                    {label:"Tipo",property:"tipo",type:"string"},
                    {label:"Categoria",property:"categoria",type:"string"},
                    {label:"Recomendación",property:"recomendacion",type:"string"},
                    {label:"Días sin atención",property:"daySinAten",type:"string"},
                    {label:"Estado",property:"estado",type:"string"},
                    {label:"Fecha liberación",property:"fLiberacion",type:"string"},
                    {label:"MesLib",property:"mesLib",type:"string"},
                    {label:"AñoLib",property:"anioLib",type:"string"},
                    {label:"Origen",property:"origen",type:"string"},
                    {label:"Registrado por",property:"resgistradoPor",type:"string"},
                    {label:"Fecha registro",property:"fRegistroDesv",type:"string"}
                ]
                console.log("objEstruc",objEstruc); 
                // var oModel = this.getView().getModel("myParam");  
                // let listInspeccion = oModel.getProperty("/listInspeccion"); 
                let list = this.getView().getModel("myParam").getProperty("/" + ele);
                let oSettings = {
                    workbook: {
                        columns: objEstruc
                    },
                    dataSource: list,
                    fileName: "Reporte.xlsx"
                };
                let oSheet = new sap.ui.export.Spreadsheet(oSettings);           
                console.log("oSheet",oSheet);            
                oSheet.build().then(function () {
                    sap.m.MessageToast.show("Se realizó la exportación con éxito.")
                }.bind(this)).finally(function () {
                    oSheet.destroy()
                }.bind(this)) 
            }, 
            excelDownloadICR: function (ele) { 
                console.log("excelDownload",ele);            
                let objEstruc = [
                    {label:"Gerencia",property:"gerencia"},
                    {label:"Condiciones reportadas mese anteriores A",property:"conRepMesAnt_A"},
                    {label:"Condiciones reportadas mese anteriores B",property:"conRepMesAnt_B"},
                    {label:"Condiciones reportadas mese anteriores C",property:"conRepMesAnt_C"},
                    {label:"Condiciones corregidas mese anteriores A",property:"conCorMesAnt_A"},
                    {label:"Condiciones corregidas mese anteriores B",property:"conCorMesAnt_B"},
                    {label:"Condiciones corregidas mese anteriores C",property:"conCorMesAnt_C"},
                    {label:"Condiciones reportadas en el mes A",property:"conRepMes_A"},
                    {label:"Condiciones reportadas en el mes B",property:"conRepMes_B"},
                    {label:"Condiciones reportadas en el mes C",property:"conRepMes_C"},
                    {label:"Condiciones corregidas en el mes A",property:"conCor_mes_A"},
                    {label:"Condiciones corregidas meses anteriores A",property:"conCor_mesAnt_A"},
                    {label:"Condiciones corregidas en el mes B",property:"conCor_mes_B"},
                    {label:"Condiciones corregidas meses anteriores B",property:"conCor_mesAnt_B"},
                    {label:"Condiciones corregidas en el mes C",property:"conCor_mes_C"},
                    {label:"Condiciones corregidas meses anteriores C",property:"conCor_mesAnt_C"},
                    {label:"% ICR mes A",property:"porICRmes_A"},
                    {label:"% ICR mes B",property:"porICRmes_B"},
                    {label:"% ICR mes C",property:"porICRmes_C"},
                    {label:"% ICR mes Total",property:"porICRmes_Total"},
                    {label:"% ICR acumulado A",property:"porICRacum_A"},
                    {label:"% ICR acumulado B",property:"porICRacum_B"},
                    {label:"% ICR acumulado C",property:"porICRacum_C"},
                    {label:"% ICR acumulado Total",property:"porICRacum_Total"},
                ]
                console.log("objEstruc",objEstruc); 
                // var oModel = this.getView().getModel("myParam");  
                // let listInspeccion = oModel.getProperty("/listInspeccion"); 
                let list = this.getView().getModel("myParam").getProperty("/" + ele);
                let oSettings = {
                    workbook: {
                        columns: objEstruc
                    },
                    dataSource: list,
                    fileName: "ReporteICR.xlsx"
                };
                let oSheet = new sap.ui.export.Spreadsheet(oSettings);           
                console.log("oSheet",oSheet);            
                oSheet.build().then(function () {
                    sap.m.MessageToast.show("Se realizó la exportación con éxito.")
                }.bind(this)).finally(function () {
                    oSheet.destroy()
                }.bind(this)) 
            }, 
            limpiarObjeto: function (arrayClean) {   
                console.log(`arrayClean: ${arrayClean}`)
                for (const item of arrayClean) {
                    // console.log(`${item.id}`)
                    // if (item.tipo == "fecha") {
                    //     this.getView().byId(item.id).setDateValue("") 
                    // }
                    // this.getView().byId(item.id).setValue("")
                    this.getView().byId(item.id).setValue(''); 
                }
            },

            //FILTRA EL ARRAY O MODELO SEGUN EL ARRAY DE FILTROS (eliminar)
            // filterArrayByAttributes: function (listArray, filterCriteria) {
            //     if (!Array.isArray(listArray) || !Array.isArray(filterCriteria)) {
            //       throw new Error('Entrada inválida. Ambos argumentos deben ser matrices.');
            //     }
              
            //     return listArray.filter(item => {
            //       return filterCriteria.every(filterObj => {
            //         if (!filterObj || typeof filterObj !== 'object' || !('atr' in filterObj) || !('valor' in filterObj)) {
            //           throw new Error('Objeto de filtro no válido. Se esperaba un objeto con propiedades "atr" y "valor"');
            //         }
              
            //         const { atr, valor } = filterObj;
            //         if (typeof atr !== 'string') {
            //           throw new Error('"atr" debe ser una cadena que represente el nombre del atributo.');
            //         }
              
            //         return item[atr] === valor;
            //       });
            //     });
            //   }
              

        });
    });
