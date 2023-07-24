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
    function (Controller,MessageBox,MessageToast,Fragment,Filter,FilterOperator,FilterType) {
        "use strict";

        return Controller.extend("appss.aplicationss.controller.vMain", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {

            },
            
            addTrabajador: function () {
                this.getRouter().getTargets().display("vNewTrabajador");
            },
            onSelectTrabajador: function () {
                this.getRouter().getTargets().display("vTrabajador");
            },
            //ASSITENCIA
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
            // onSelectTbIncidente: function () {
            //     this.getRouter().getTargets().display("vIncidente");
            // },
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
            //GENERAR CODIGO 4 DIGITOS
            getCod: function () {
                var min = 1000; // Mínimo valor de 4 dígitos (1000)
                var max = 9999; // Máximo valor de 4 dígitos (9999)
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            // GESTION DE INCIDENTES 
                        
            newIncidente: function () {
                let oModel = this.getView().getModel("myParam"); 
                let listIncidente = oModel.getProperty("/listIncidente");
                console.log("listIncidente",listIncidente);
                // let vector = [];
                let codGenerado = this.getCod();  
                let newIncidenteForm = {
                    numIns: codGenerado,
                    titulo: this.getView().byId("gi_new_titulo").getValue(),
                    descrip: this.getView().byId("gi_new_descrip").getValue(),
                    accionInmediata: this.getView().byId("gi_new_accionInmediata").getValue(),
                    
                    sociedad: this.getView().byId("gi_new_sociedad").getValue(),
                    ubicacion: this.getView().byId("gi_new_ubicacion").getValue(),
                    detalle: this.getView().byId("gi_new_detalle").getValue(),
                    invPreliminar: "",

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
                // console.log("newIncidenteForm",newIncidenteForm)
                // vector.push(newIncidenteForm)
                // miArray.splice(indice, 0, nuevoObjeto);
                listIncidente.push(newIncidenteForm)
                oModel.setProperty("/listIncidente",listIncidente); 
            },
            onSelectTbIncidente: function (evt) {
                this.getRouter().getTargets().display("vIncidente");
                let oModel = this.getView().getModel("myParam");  

                var context = evt.getParameters().rowBindingContext; 
                console.log("context", context)
                var objeto = context.getObject();
                console.log("objeto", objeto)
                oModel.setProperty("/selectIncidente",objeto);
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
                    {id:"bNIncidente",tabAtr:"numIns"},
                    {id:"bCodAfectado",tabAtr:"afectado/codEmpleado"},
                    {id:"bFechaInc",tabAtr:"fecha"},
                    {id:"bStatus",tabAtr:"status"},
                 ] 
                 let comFil = this.comFilBusqueda(objBusqueda) 
                //  var num = this.getView().byId("bNIncidente").getValue();
                //  console.log("num",num)
                //  if (num != "") {
                //      var oFilter = new Filter("numIns", FilterOperator.Contains, num);
                //      comFil.push(oFilter);
                //  }
                 console.log("array que filtra",comFil);
                 //filtrado
                 var oFilter = new sap.ui.model.Filter({
                     filters: comFil,
                     and: true
                 });
                 oTable.getBinding("rows").filter(oFilter, FilterType.Application);
            },
            comFilBusqueda: function (miArray) {
                let result = [];
                for (var i = 0; i < miArray.length; i++) { 
                    let valor = this.getView().byId( miArray[i].id ).getValue();
                    if (valor != "") {
                        if (miArray[i].tabAtr == "fecha") {
                            console.log("valor I",valor)
                            valor = this.cambiarFormatoFecha(valor) 
                            console.log("valor F",valor)
                        }  
                        var oFilter = new sap.ui.model.Filter (miArray[i].tabAtr, sap.ui.model.FilterOperator.Contains, valor);
                        result.push(oFilter);
                    }  
                } 
                return result;
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

            //GESTION DE INSPECCION DE TRABAJO
            //NUEVA INSPECCION
            setCod: function () {
                let cod = this.getCod()
                this.getView().byId("gInsp_codInsp").setValue(cod); 
            },
            seveNewInspeccion: function () {
                var oModel = this.getView().getModel("myParam");  
                let listInspeccion = oModel.getProperty("/listInspeccion");
                let objInspeccion = { 
                    codInsp: this.getView().byId("gInsp_codInsp").getValue(),
                    gerencia: this.getView().byId("gInsp_gerencia").getSelectedKey(),
                    area: this.getView().byId("gInsp_area").getValue(),
                    departamento: this.getView().byId("gInsp_departamento").getValue(),
                    fechaP: this.getView().byId("gInsp_programada").getValue(),
                    afectado: "",
                    status: "pendiente",
                }
                // console.log("objInspeccion",objInspeccion) 
                listInspeccion.push(objInspeccion)
                oModel.setProperty("/listInspeccion",listInspeccion); 
            },
            buscarInspecciones: function () { 
                console.log("buscarInspecciones") 
                let oTable = "tbInspecciones"; 
                let objBusqueda = [
                    {id:"Iinspeccion",tabAtr:"codInsp"},
                    {id:"Igerencia",tabAtr:"gerencia"},
                    {id:"Iarea",tabAtr:"area"},
                    {id:"Idepartamento",tabAtr:"departamento"},
                    {id:"Ifechap",tabAtr:"fechaP",fecha:true},
                    {id:"Istatus",tabAtr:"status"},
                 ] 
                 this.fBusqueda(objBusqueda,oTable)
                 
            },
            fBusqueda: function (objBusqueda,idTable) {
                let comFil = [];
                let oTable = this.getView().byId(idTable); 
                for (var i = 0; i < objBusqueda.length; i++) { 
                    let valor = this.getView().byId( objBusqueda[i].id ).getValue();
                    if (valor != "") {
                        if (objBusqueda[i].fecha) {
                            console.log("valor I",valor)
                            valor = this.cambiarFormatoFecha(valor) 
                            console.log("valor F",valor)
                        }  
                        var oFilter = new sap.ui.model.Filter (objBusqueda[i].tabAtr, sap.ui.model.FilterOperator.Contains, valor);
                        comFil.push(oFilter);
                    }  
                } 
                // let comFil = this.comFilBusqueda(objBusqueda)  
                //  console.log("array que filtra",comFil);
                 //filtrado
                 var oFilter = new sap.ui.model.Filter({
                     filters: comFil,
                     and: true
                 });
                 oTable.getBinding("rows").filter(oFilter, FilterType.Application);
                // return result;
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
                if(objTab.status == "pendiente"){
                    oModel.setProperty("/tempInspecciones",objTab);
                    this.getRouter().getTargets().display("vInspeccion");
                    // tempInspecciones
                }
                // oModel.setProperty("/selectIncidente",objeto);
            },
            // onSelectTab: function () {
            //     console.log("CLIC EN CELDA")
            //     this.getRouter().getTargets().display("vInspeccion");
            // },

        });
    });
