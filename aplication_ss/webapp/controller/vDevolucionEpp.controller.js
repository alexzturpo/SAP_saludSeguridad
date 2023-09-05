sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/core/Fragment", 
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,Filter,FilterOperator,FilterType,Fragment,MessageToast) {
        "use strict";
        var usuario120 = "CONSULT_MM";
        var password120 = "Laredo2023**";
        var url_ini = "";
        var usuario = "CONSULT_MM";
        var password = "Laredo2023**"; 
        return Controller.extend("appss.aplicationss.controller.vDevolucionEpp", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {

            }, 
            onPageBack : function () {  
                this.getRouter().getTargets().display("TargetvMain");
            }, 
            onAfterRendering:async function () {  
                this.buscarTrabajador()
            },
            buscarTrabajador:  function () {  
                // console.log('getListEmpleado')
                var iCodTrabajador = this.getView().byId("rEpp_codTrab").getValue()
                // console.log("iCodTrabajador",iCodTrabajador)
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
            // devolverTotalEpp22: function () {
            //     let arrayEpps = this.selectMultipleTable()
            //     if(arrayEpps){
            //         console.log("lista de epps", arrayEpps)
            //     }
            // },
            devolverTotalEpp:async function () {
                let arrayEpps = this.selectMultipleTable()
                if(arrayEpps.length > 0){
                    let typeMsm = "information",
                    titleMsm = "¿Deseas continuar?"
                    let ok = await this.MessageBoxPress(typeMsm,titleMsm)
                    if(ok){
                        console.log("arrayEpps", arrayEpps)
                        let oModel = this.getView().getModel("myParam");  
                        let ZID_RESERVA = oModel.getProperty("/ZID_RESERVA_select")
                        let fechaActual = this.fechaActual()
                            let partesFecha = fechaActual.split("-"); // Divide la fecha en partes
                            let fechaFormateada = partesFecha.join("");
                        for (let epp of arrayEpps) {
                            debugger
                            if(epp.ZSTATUS == 'E'){ 
                                let sendPost = [{
                                    "RSPOS": epp.ZID_POSICION,
                                    "ZIND_PERDIDA": epp.ZIND_PERDIDA,
                                    "ZOBSERVACIONES": epp.ZOBSERVACIONES,
                                    "ZESTADO_EPP": epp.ZESTADO_EPP,
                                    "ZFEC_CESE" : this.cambiarFormatoFecha(this.getView().byId("dvEpp_fechaCese").getValue()),
                                    "ZFEC_TRANSFERENCIA" : this.cambiarFormatoFecha(this.getView().byId("dvEpp_fechaTrans").getValue()),
                                    "ZFEC_DEVOLUCION" : this.cambiarFormatoFecha(this.getView().byId("dvEpp_devolucion").getValue()),
                                }]
                                // debugger
                                console.log("material a liberar",sendPost)
                                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/PROCESAR_RESERVA/1000/0/${ZID_RESERVA}/D/${fechaFormateada}/0/0?sap-client=120`;
                                var dataRes = this.f_PostJsonData(url, sendPost,true) // envia nuevo registro
                                if(dataRes.cod != undefined && dataRes.cod == 'Error'){
                                    MessageToast.show("Error (" + dataRes.descripcion + ")");
                                }else{ 
                                    MessageToast.show("Solicitud exitosa")
                                    epp.ZSTATUS = 'D'
                                    // MessageBox.success("Realice de nuevo la busqueda para actualizar los registros"); 
                                    // this.onPageBack() 
                                }
                            }else{ MessageToast.show(`El material tiene que estar entregado`) } 
                        } 
                        oModel.refresh();
                    }else{ MessageToast.show("Solicitud cancelada") }
                }else{MessageToast.show("Selecciona un material")}
            },
            selectMultipleTable: function () {
                let arrayEpps = []
                var miTabla = this.byId("idTableMateriales");
                var indicesSeleccionados = miTabla.getSelectedIndices();

                // Iterar a través de los índices seleccionados
                indicesSeleccionados.forEach(function(indice) {
                    var contexto = miTabla.getContextByIndex(indice); // Obtener el contexto de la fila
                    var datosFila = contexto.getObject();
                    console.log("datosFila", datosFila)
                    arrayEpps.push(datosFila)
                });
                return arrayEpps 
            },
            // FUNCIONES GENERALES 
            buscarTrabajadorSociedad:  function (iCodTrabajador) {   
                var url = url_ini + `https://172.16.22.30:44300/sap/bc/ZSISMART/smart/GET_LIST_PERSONAL/0/0/${iCodTrabajador}/0/0/0/0?sap-client=120`;
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
                // let url= url_ini + "https://172.16.22.30:44300/sap/bc/ZSISMART/smart/INS_INC/1000/0/0/0/0/0/0?sap-client=120"
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
                const fechaActual = new Date();

                const anio = fechaActual.getFullYear();
                const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
                const dia = fechaActual.getDate().toString().padStart(2, '0');
              
                return `${anio}-${mes}-${dia}`;
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
