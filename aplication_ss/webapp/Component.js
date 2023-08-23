/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "appss/aplicationss/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("appss.aplicationss.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                var oData = {
                    "temEditAcciones":{},
                    "temEditInvolucrado":{},
                    "ListPersonal":{},
                    "newListMaterialReserva":[],
                    "listaDocumentoTrabajador":[],
                    "listTempDocSubidos":[],
                    // "listTempDocSubidos":[
                    //     {
                    //       "ZID_DOCUMENTO": "0001",
                    //       "ZDOCUMENTO": "Manual de Seguridad",
                    //       "ZOBLIGATORIO": true,
                    //       "ZFORMATO": "PDF",
                    //       "ZVERSION":""
                    //     },
                    //     {
                    //       "ZID_DOCUMENTO": "0002",
                    //       "ZDOCUMENTO": "Política de Calidad",
                    //       "ZOBLIGATORIO": true,
                    //       "ZFORMATO": "DOCX",
                    //       "ZVERSION":""
                    //     }
                    //   ]
                    //   ,
                    // "listReservas":[],
                    "listReservas":[
                        {
                          "ZID_RESERVA": "777",
                          "ZID_POSICION": 23,
                          "ZID_COD_TRABAJADOR": 1234,
                          "ZDNI": 98765432,
                          "ZCARGO": "Analista de Ventas",
                          "ZAREA": "Ventas",
                          "ZIND_CAMBIO": true,
                          "ZIND_VALORADO": false,
                          "ZRES_DEVOLUCION": "2023-08-15",
                          "ZIND_PERDIDA": true,
                          "ZOBSERVACIONES": "Producto defectuoso",
                          "ZESTADO_EPP": "Pendiente",
                          "ZLIBERADOR": "Juan Pérez",
                          "ZSTATUS": "Activo",
                          "ZSTAT_LIBER": "Liberado"
                        },
                        {
                          "ZID_RESERVA": "555",
                          "ZID_POSICION": 45,
                          "ZID_COD_TRABAJADOR": 5678,
                          "ZDNI": 54321678,
                          "ZCARGO": "Supervisor de Producción",
                          "ZAREA": "Producción",
                          "ZIND_CAMBIO": false,
                          "ZIND_VALORADO": true,
                          "ZRES_DEVOLUCION": "2023-08-10",
                          "ZIND_PERDIDA": false,
                          "ZOBSERVACIONES": "Sin problemas",
                          "ZESTADO_EPP": "Aprobado",
                          "ZLIBERADOR": "María López",
                          "ZSTATUS": "Activo",
                          "ZSTAT_LIBER": "Liberado"
                        }
                      ]
                      ,
                    "listurlBD": {
                        "bdClientes2": "cpbl/browse/",
                        "bdClientes": "cpdb/mydb/",
                    },
                    "listTablasOData": {
                        "clistTablasODataURL": "/odataent/odata2.svc/mydb",
                    },
                    "datanewtrabajador":{
                        "idcodigoAC":"",
                        "idapellidoAC":"",
                        "idnombreAC":"",
                        "idAreaAC":"",
                        "idPuestoAC":"",
                    },             
                    "dataContratistafilter":[],
                    "dataContratistadetalle":[
                        {"SCTRFV":"30/08/2024","SCTR":"SCTR","REQEVAL":"NO","VIG":"21/08/2024","APTITUD":"bueno","EXAMEN":"Sicosomatico","FECHAVENCINDESP":"21/08/2023","FECHAINDESP":"21/08/2023","FECHAVENCINDGRAL":"24/08/2023","FECHAINDG":"24/07/2023","NOTA":"10","KEY":"1","NAME":"Juan","APELLIDO":"Ugarte","DNI":"75612345"},
                        {"SCTRFV":"30/08/2024","SCTR":"SCTR","REQEVAL":"NO","VIG":"21/08/2024","APTITUD":"bueno","EXAMEN":"Sicosomatico","FECHAVENCINDESP":"21/08/2023","FECHAINDESP":"21/08/2023","FECHAVENCINDGRAL":"24/08/2023","FECHAINDG":"24/07/2023","NOTA":"10","KEY":"2","NAME":"Pedro","APELLIDO":"Torres","DNI":"78952463"},
                        {"SCTRFV":"30/08/2024","SCTR":"SCTR","REQEVAL":"NO","VIG":"21/08/2024","APTITUD":"bueno","EXAMEN":"Sicosomatico","FECHAVENCINDESP":"21/08/2023","FECHAINDESP":"21/08/2023","FECHAVENCINDGRAL":"24/08/2023","FECHAINDG":"24/07/2023","NOTA":"10","KEY":"3","NAME":"Mario","APELLIDO":"Tapia","DNI":"85296341"},
                        {"SCTRFV":"30/08/2024","SCTR":"SCTR","REQEVAL":"NO","VIG":"21/08/2024","APTITUD":"bueno","EXAMEN":"Sicosomatico","FECHAVENCINDESP":"21/08/2023","FECHAINDESP":"21/08/2023","FECHAVENCINDGRAL":"24/08/2023","FECHAINDG":"24/07/2023","NOTA":"10","KEY":"4","NAME":"Jose","APELLIDO":"Diaz","DNI":"96385274"},
              
                    ],
                    "dataContratistaSCTR":[
                        {"keySCTR":"1","fecha":"12/03/2023","key":"1","observaciones":"SCTR- sin comentarios","status":"vigente"},
                        {"keySCTR":"2","fecha":"12/03/2023","key":"1","observaciones":"SCTR- sin comentario","status":"vigente"},
                        {"keySCTR":"3","fecha":"12/03/2023","key":"1","observaciones":"SCTR- sin comentario","status":"vigente"},
                        {"keySCTR":"3","fecha":"12/03/2023","key":"1","observaciones":"SCTR- sin comentario","status":"vigente"},
                    ],
                    "dataContratistaMedicas":[
                        {"keymedic":"1","fecha":"12/03/2023","key":"1","observaciones":"sin comentarios","status":"vigente"},
                        {"keymedic":"2","fecha":"12/03/2023","key":"1","observaciones":"sin comentario","status":"vigente"},
                        {"keymedic":"3","fecha":"12/03/2023","key":"1","observaciones":"sin comentario","status":"vigente"},
                        {"keymedic":"3","fecha":"12/03/2023","key":"1","observaciones":"sin comentario","status":"vigente"},
                    ],
                    "dataContratista":[
                        {"key":"1","keycontract":"","sociedad":"1000","name":"Juan","apellido":"Ugarte","area":"RRHH","puesto":"analista","DNI":"75612345","ACTIVO":"SI"},
                        {"key":"2","keycontract":"","sociedad":"1000","name":"Pedro","apellido":"Torres","area":"RRHH","puesto":"consultor","DNI":"78952463","ACTIVO":"SI"},
                        {"key":"3","keycontract":"","sociedad":"1000","name":"Mario","apellido":"Tapia","area":"RRHH","puesto":"contador","DNI":"85296341","ACTIVO":"SI"},
                        {"key":"4","keycontract":"","sociedad":"1000","name":"Jose","apellido":"Diaz","area":"RRHH","puesto":"personal","DNI":"96385274","ACTIVO":"SI"},
                    ],
                    "dataInduccionfilter":[],
                    "dataInduccion":[
                        {"keyinduc":"1","sociedad":"1000","titulo":"Capacitacion enero","descrip":"programa modulo 1","fechaprog":"22/07/2023","tipoinducc":"General","status":"vigente"},
                        {"keyinduc":"2","sociedad":"1000","titulo":"Capacitacion marzo","descrip":"programa modulo 2","fechaprog":"22/07/2023","tipoinducc":"General","status":"vigente"},
                        {"keyinduc":"3","sociedad":"1000","titulo":"Capacitacion abril","descrip":"programa modulo 3","fechaprog":"22/07/2023","tipoinducc":"General","status":"vigente"},
                        {"keyinduc":"4","sociedad":"1000","titulo":"Capacitacion mayo","descrip":"programa modulo 4","fechaprog":"22/07/2023","tipoinducc":"General","status":"vigente"},
                    ],
                    "dataAsistenteInd":{},
                    "dataAsistenteIndNotas":{},
                    "dataasistentesInduccion":[
                        {"keyinduc":"1","key":"1","nota":"11","anexo":"doc1"},
                        {"keyinduc":"1","key":"2","nota":"12","anexo":"doc2"},
                        {"keyinduc":"1","key":"3","nota":"13","anexo":"doc3"},
                        {"keyinduc":"1","key":"4","nota":"14","anexo":"doc4"},
                    ],
                    "dataGerencia":[
                        {"key":"1","name":"Fábrica"},
                        {"key":"2","name":"Administración"},
                        {"key":"3","name":"Instalaciones y equipo"},
                        {"key":"4","name":"Rutinarias, No Rutinarias y administrativas"}
                    ],
                    // tablas de SYSO
                    "docTableIncidente":[],
                    "tableAccionesInformeIncidente":[],
                    "selectIncidenteInforme":[{
                            ZACTOS_SUBESTAND: "",
                            ZCOND_SUBESTAND: "",
                            ZFACT_PERSONALES: "", 
                            ZFACT_TRABAJO: "",
                            ZLECCIONES: "",
                            ZINVEST_POR: "", 
                            ZCARGO: "",
                            ZHORA: "", 
                            ZFIRMA: ""
                        }],
                    "dataEpps":[
                        {"id": 1,"nombre": "Casco de Seguridad","stock": 100},
                        {"id": 2,"nombre": "Gafas de Seguridad","stock": 150},
                        {"id": 3,"nombre": "Mascarilla N95","stock": 500},
                        {"id": 4,"nombre": "Guantes de Trabajo", "stock": 300},
                        {"id": 5,"nombre": "Protectores Auditivos","stock": 200}
                    ]
                    ,
                    "ZSYSO_GERENCIASet":[],
                    "ZSYSO_AREASet":[],
                    "ZSYSO_GERENCIA":[
                        {"ZGERENCIA":"001","ZDESCRIPCION":"Descrip 001","ZESTADO":"Activo"},
                        {"ZGERENCIA":"002","ZDESCRIPCION":"geren 002","ZESTADO":"Inactivo"},
                    ],
                    "ZSYSO_AREA":[
                        {"ZAREA":"001","ZGERENCIA":"001","ZDESCRIPCION":"Descrip area 001","ZESTADO":"Activo"},
                        {"ZAREA":"002","ZGERENCIA":"001","ZDESCRIPCION":"fa area 002","ZESTADO":"Activo"},
                    ],
                    "ZSYSO_DPTO":[
                        {"ZDPTO":"001","ZAREA":"001","ZGERENCIA":"001","ZDESCRIPCION":"Descrip DPTO 001","ZESTADO":"Activo"}, 
                        {"ZDPTO":"002","ZAREA":"002","ZGERENCIA":"001","ZDESCRIPCION":"Descrip DPTO 002","ZESTADO":"Activo"}, 
                        {"ZDPTO":"003","ZAREA":"002","ZGERENCIA":"001","ZDESCRIPCION":"Descrip DPTO 003","ZESTADO":"Inactivo"}, 
                    ],
                    "ZSYSO_CATEGORIA":[
                        {"ZCATEGORIA":"A","ZDESCRIPCION":"Condición o práctica con potencial de causar incapacidad permanente, fatalidad y/o ocasionar perdida mayor y/o demoras en atención a levantamiento."}, 
                        {"ZCATEGORIA":"B","ZDESCRIPCION":"Condición o práctica con potencial de causar lesiones, enfermedad seria, ocasionando incapacidad temporal o daño a la propiedad"},
                        {"ZCATEGORIA":"C","ZDESCRIPCION":"Condición o práctica con potencial de causar lesión o enfermedad menor y/o daño a la propiedad no considerable"}
                    ],
                    // "ZSYSO_INSPECCION":[
                    //     {"ZINSPECCION":"0001","ZDPTO":"0003","ZFEC_PROGRAM":"01/08/2023","ZESTADO":"N","ZFEC_CONCLUIDA":"02/08/2023","ZCATEGORIA":"A","ZTIPO":"1","ZFEC_REAL":"01/08/2023","ZHOR_REAL":"16:00","ZACTO":"vActo","ZCONDICION":"vCondicion","ZHALLAZGO":"ZHALLAZGO","ZACCIONES":"ZACCIONES","ZRECOMENDACION":"ZRECOMENDACION","ZUBICACION":"ZUBICACION","ZCAUSAS":"ZCAUSAS","ZREGISTRADO_POR":"user1","ZAFECTADO":"ZAFECTADO"},
                    //     {"ZINSPECCION":"0002","ZDPTO":"0002","ZFEC_PROGRAM":"01/08/2023","ZESTADO":"F","ZFEC_CONCLUIDA":"02/08/2023","ZCATEGORIA":"C","ZTIPO":"2","ZFEC_REAL":"01/08/2023","ZHOR_REAL":"16:00","ZACTO":"vActo","ZCONDICION":"vCondicion","ZHALLAZGO":"ZHALLAZGO","ZACCIONES":"ZACCIONES","ZRECOMENDACION":"ZRECOMENDACION","ZUBICACION":"ZUBICACION","ZCAUSAS":"ZCAUSAS","ZREGISTRADO_POR":"user1","ZAFECTADO":"ZAFECTADO"}
                    // ],

                    
                    "dataTab":[
                        {"key":"1","name":"Fábrica"},
                        {"key":"2","name":"Administración"},
                        {"key":"3","name":"Instalaciones y equipo"},
                        {"key":"4","name":"Rutinarias, No Rutinarias y administrativas"}
                    ],
                    
                    "dataCategoria":[
                        {"key":"A","name":"A","info":"Condición o práctica con potencial de causar incapacidad permanente, fatalidad y/o ocasionar perdida mayor y/o demoras en atención a levantamiento."},
                        {"key":"B","name":"B","info":"Condición o práctica con potencial de causar lesiones, enfermedad seria, ocasionando incapacidad temporal o daño a la propiedad"},
                        {"key":"C","name":"C","info":"Condición o práctica con potencial de causar lesión o enfermedad menor y/o daño a la propiedad no considerable"}
                    ],
                    "dataTipo":[
                        {"ZTIPO":"1","name":"Condición"},
                        {"ZTIPO":"2","name":"Acto"}
                    ], 
                    // "listIncidente":[
                    //     {"numIns":"0001","titulo":"holaMundo","afectado":{"codEmpleado":"01"},"testigo":{"codEmpleado":""},"fecha":"01/10/2022","status":"pendiente"},
                    //     {"numIns":"0002","titulo":"holaMundoFin","fecha":"03/03/2023","status":"completo","afectado":{"codEmpleado":"02"}},
                    // ],
                    "listInspeccion":[
                        {"codInsp":"888","gerencia":"1","area":"area1","departamento":"depa1","fechaP":"01/10/2023","afectado":"","status":"pendiente","categoria":"","tipo":"","desCausaOrigen":"ggg"},
                        {"codInsp":"777","gerencia":"2","area":"area2","departamento":"depa2","fechaP":"01/09/2023","afectado":"","status":"completo","categoria":"","tipo":"","desCausaOrigen":""},
                    ],
                    "tabPerInvolucrados":[],
                    "tabRiAsociados":[],
                    "tabMedCorrectiva":[],
                    "tabResponsables":[],
                    "estadoAccionCorrectiva":[
                        {"key":0,"state":"Pendiente"},
                        {"key":1,"state":"Subsanada"},
                        {"key":2,"state":"Devuelta"},
                        {"key":3,"state":"Completada"}
                    ],
                    "excelTabInsp":[
                        {
                        "codInsp": 1,
                        "area": "Produccion",
                        "departamento": "Destileria",
                        "jefaturaCargo": "Jefe de destileria",
                        "objs": "El 2022.Cuarto de insumos quimicos",
                        "freporte": "24/07/2023",
                        "mes": "Julio",
                        "anio": "2023",
                        "tipo": "Condicion",
                        "categoria": "A",
                        "recomendacion": "Reforzar Bisagra porton cuarto de insumos quimicos",
                        "daySinAten": 127,
                        "estado": "pendiente",
                        "fLiberacion": "24/07/2023",
                        "mesLib": "Julio",
                        "anioLib": "'2023",
                        "origen": "",
                        "resgistradoPor": "",
                        "fRegistroDesv": "24/07/2023"
                        },
                        {
                        "codInsp": 1,
                        "area": "Produccion",
                        "departamento": "Destileria",
                        "jefaturaCargo": "Jefe de destileria",
                        "objs": "El 2022.Cuarto de insumos quimicos",
                        "freporte": "24/07/2023",
                        "mes": "Julio",
                        "anio": "2023",
                        "tipo": "Condicion",
                        "categoria": "A",
                        "recomendacion": "Reforzar Bisagra porton cuarto de insumos quimicos",
                        "daySinAten": 127,
                        "estado": "pendiente",
                        "fLiberacion": "24/07/2023",
                        "mesLib": "Julio",
                        "anioLib": "'2023",
                        "origen": "",
                        "resgistradoPor": "",
                        "fRegistroDesv": "24/07/2023"
                        }
                    ],
                    "personas":[
                        { nombre: "Juan", edad: 30, ciudad: "Madrid" },
                        { nombre: "María", edad: 25, ciudad: "Barcelona" },
                        { nombre: "Carlos", edad: 40, ciudad: "Valencia" }
                      ],
                    "reporteICR":[
                        {
                          "gerencia": "Administracion",
                          "conRepMesAnt_A": "",
                          "conRepMesAnt_B": "",
                          "conRepMesAnt_C": "",
                          "conCorMesAnt_A": "",
                          "conCorMesAnt_B": "",
                          "conCorMesAnt_C": "",
                          "conRepMes_A": "",
                          "conRepMes_B": "",
                          "conRepMes_C": "",
                          "conCor_mes_A":"",
                          "conCor_mesAnt_A":"",
                          "conCor_mes_B":"",
                          "conCor_mesAnt_B":"",
                          "conCor_mes_C":"",
                          "conCor_mesAnt_C":"",
                          "porICRmes_A":"",
                          "porICRmes_B":"",
                          "porICRmes_C":"",
                          "porICRmes_Total":"",
                          "porICRacum_A":"",
                          "porICRacum_B":"",
                          "porICRacum_C":"",
                          "porICRacum_Total":"",
                        },
                        {
                          "gerencia": "Campo",
                          "conRepMesAnt_A": 35,
                          "conRepMesAnt_B": 23,
                          "conRepMesAnt_C": 5,
                          "conCorMesAnt_A": 11,
                          "conCorMesAnt_C": 0,
                          "conCorMesAnt_B": 0,
                          "conRepMes_A": 16,
                          "conRepMes_B": 11,
                          "conRepMes_C": 0,
                          "conCor_mes_A": 0,
                          "conCor_mesAnt_A": 0,
                          "conCor_mes_B": 0,
                          "conCor_mesAnt_B": 0,
                          "conCor_mes_C": 0,
                          "conCor_mesAnt_C": 0,
                          "porICRmes_A":"0%",
                          "porICRmes_B":"0%",
                          "porICRmes_C":"",
                          "porICRmes_Total":"0%",
                          "porICRacum_A":"22%",
                          "porICRacum_B":"0%",
                          "porICRacum_C":"0%",
                          "porICRacum_Total":"12%",
                        },
                        {
                          "gerencia": "Fábrica",
                          "conRepMesAnt_A": 72,
                          "conRepMesAnt_B": 10,
                          "conRepMesAnt_C": 1,
                          "conCorMesAnt_A": 21,
                          "conCorMesAnt_B":1,
                          "conCorMesAnt_C": 0,
                          "conRepMes_A": 0,
                          "conRepMes_B": 1,
                          "conRepMes_C": 0,
                          "conCor_mes_A": 0,
                          "conCor_mesAnt_A": 0,
                          "conCor_mes_B": 0,
                          "conCor_mesAnt_B": 0,
                          "conCor_mes_C": 0,
                          "conCor_mesAnt_C": 0,
                          "porICRmes_A":"",
                          "porICRmes_B":"0%",
                          "porICRmes_C":"",
                          "porICRmes_Total":"0%",
                          "porICRacum_A":"29%",
                          "porICRacum_B":"9%",
                          "porICRacum_C":"0%",
                          "porICRacum_Total":"26%",
                        },
                      ]
                      
                    
                };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                this.setModel(oModel);
                this.setModel(oModel, "myParam"); 
            }
        });
    }
);