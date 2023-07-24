sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox) {
        "use strict";

        return Controller.extend("appss.aplicationss.controller.vNewTrabajador", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {

            }, 
            onPageBack : function () {  
                this.getRouter().getTargets().display("TargetvMain");
            },
            idguardarnewtrabAC : function (e) {  
                console.log(e);
                var oModel = this.getView().getModel("myParam");  
                var oidcodigoAC = this.getView().byId("idcodigoAC").getValue(); 
                var oidapellidoAC = this.getView().byId("idapellidoAC").getValue(); 
                var oidnombreAC = this.getView().byId("idnombreAC").getValue(); 
                var oidAreaAC = this.getView().byId("idAreaAC").getValue(); 
                var oidPuestoAC = this.getView().byId("idPuestoAC").getValue(); 
                var datafilter = oModel.getProperty("/dataContratistafilter");
                var llave = {};
                llave.key=oidcodigoAC;
                llave.sociedad="1001";
                llave.name=oidnombreAC;
                llave.apellido=oidapellidoAC;
                llave.area=oidAreaAC;
                llave.puesto=oidPuestoAC;
                llave.DNI="";
                llave.activo="SI";
                
                datafilter.push(llave);
                oModel.setProperty("/dataContratistafilter",datafilter);
                MessageBox.success("Registro agregado correctamente");
       
                 
            }            
        });
    });
