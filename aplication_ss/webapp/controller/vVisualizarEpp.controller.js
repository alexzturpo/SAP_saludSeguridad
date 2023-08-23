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
        var usuario120 = "CONSULT_MM";
        var password120 = "Laredo2023.";
        var url_ini = "";
        var usuario = "CONSULT_PQ01";
        var password = "Rcom2023.."; 
        return Controller.extend("appss.aplicationss.controller.vVisualizar", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {

            }, 
            onPageBack : function () {  
                this.getRouter().getTargets().display("TargetvMain");
            }, 
            addEpp: function () {  
                this.getView().byId("panelEpp").setVisible(true)
            },
            cancelAddEpp: function () {  
                this.getView().byId("panelEpp").setVisible(false)
            },
            //input Epps
            changeEpps: function () { this._dgEpp().open() },
            _dgEpp: function () { 
                var e = this.getView();
                if (!this.dgEpp) {
                    this.dgEpp = sap.ui.xmlfragment("idDgEpp", "appss.aplicationss.view.fragments.dgInputEpp", this)
                }
                e.addDependent(this.dgEpp);
                return this.dgEpp 
            },
            dgSearchEpp: function (oEvent) { 
                var sValue = oEvent.getParameter("value");
                // console.log("sValue",sValue)
                let arrSearch = [
                    {atr:"id"},
                    {atr:"nombre"},
                    {atr:"stock"}
                ] 
                this.dialogsSearch(oEvent,arrSearch,sValue)
            },
            addEpp: function (oEvent) { 
                this.obtenerMaterialReservaEPP()
            },
            dgGetCloseEpp: function (oEvent) { 
                let idInput = "epp_desc"
                this.dialogGetValueClose(oEvent,idInput)
            },
            //input LALM
            obtenerMaterialReservaEPP: function(){ 
                var oModel = this.getView().getModel("myParam"); 
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_MAT_RES_EPPS/1000/0/0300/0/0/0/0?sap-client=120"; 
                var dataRes =  this.f_GetJson(url) 
                console.log('LISTMATRESERVA_EPP DATA ', dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/dataTabReserva_Material', dataRes);  
                }
            },
            actualizarStatusReservaEPP: function(){ 
                var oModel = this.getView().getModel("myParam"); 
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/UPD_LIST_EPPS_UPDATE/1000/0/0/0/0/0/0?sap-client=120"; 
                var dataRes =  this.f_GetJson(url) 
                console.log('UPDATEMATRESERVA_EPP DATA ', dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/dataTabReserva1_Material', dataRes);  
                }
            },
            deleteMaterialReservaEPP: function(){ 
                var oModel = this.getView().getModel("myParam"); 
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/UUPD_LIST_EPPS_DELETE/1000/0/0/0/0/0/0?sap-client=120"; 
                var dataRes =  this.f_GetJson(url) 
                console.log('UPDATEMATRESERVA_EPP DATA ', dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/dataTabReserva2_Material', dataRes);  
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
                console.log("ID INPUT",idInput)
                this.getView().byId(idInput).setValue(sDescription); 
                // this.byId(idInput).setValue(sDescription); 
            }, 

            buscarTrabajador:  function () {  
                console.log('getListEmpleado')
                var iCodTrabajador = this.getView().byId("rEpp_codTrab").getValue()
                console.log("iCodTrabajador",iCodTrabajador)
                // var oModel = this.getView().getModel("myParam");  
                let dataRes = this.buscarTrabajadorSociedad(iCodTrabajador) 
                console.log('getListEmpleado DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    // MessageToast.show("Error (" + dataRes.descripcion + ")");
                    MessageToast.show("No encontrado");
                }else{
                    dataRes= dataRes[0]
                    this.getView().byId("rEpp_nombres").setValue(dataRes.NOMBRE)
                    this.getView().byId("rEpp_apellido").setValue(dataRes.APELLIDO)
                    this.getView().byId("rEpp_dni").setValue(dataRes.DNI)
                    this.getView().byId("rEpp_cargo").setValue(dataRes.PUESTO)
                    this.getView().byId("rEpp_areaTrb").setValue(dataRes.AREA) 
                }
            },
            // FUNCIONES GENERALES 
            buscarTrabajadorSociedad:  function (iCodTrabajador) {   
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_PERSONAL/0/0/${iCodTrabajador}/0/0/0/0`;
                var dataRes =  this.f_GetJson(url) 
                return dataRes
            },
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
            f_PostJsonSinData:  function (url,client120=false) { 
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
