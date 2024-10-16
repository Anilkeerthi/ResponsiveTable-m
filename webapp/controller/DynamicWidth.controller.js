sap.ui.define([
    "sap/ui/core/mvc/Controller",
    	'sap/ui/model/json/JSONModel',
		'sap/ui/Device'
],
function (Controller,JSONModel, Device) {
    "use strict";

    return Controller.extend("responsivetable.controller.DynamicWidth", {
        onInit: function () {

            var oModel = this.getOwnerComponent().getModel('jsonModel');
            this.getView().setModel(oModel,"JSONModel");
            console.log(oModel);
            
        },

       
    });
});
