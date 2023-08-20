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
        var usuario = "CONSULT_MM";
        var password = "Laredo2023.";
        var url_ini = "";
        return Controller.extend("appss.aplicationss.controller.vNewRequerimientoEpp", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {
                //this.getDataINSRESERVAEPP()
                this.getDataILISTMAT_RESERVAEPP()
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
            /*getDataINSRESERVAEPP:  function () { 
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/INS_RESERVA_EPPS/1000/0/0/0/0/0/0?sap-client=100"; 
               
                var dataRes =  this.f_GetJson(url) 
                console.log('INS_RESERVA_EPPS EPP DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/dataTab_Nuevo',dataRes);  
                }
            },*/
            getDataILISTMAT_RESERVAEPP:  function () { 
                var oModel = this.getView().getModel("myParam"); 
                var url = url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_MAT_EPPS/1000/1001/0300/0/0/0/0?sap-client=120"; 
                var dataRes =  this.f_GetJson(url) 
                console.log('LISTMAT_RESERVAEPP DATA ',dataRes)
                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                }else{
                    oModel.setProperty('/dataTab_Material',dataRes);  
                }
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
            dgGetCloseEpp: function (oEvent) { 
                let idInput = "epp_desc"
                this.dialogGetValueClose(oEvent,idInput)
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
            
        });
    });
