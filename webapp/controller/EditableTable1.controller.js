sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
],
function (Controller,JSONModel) {
    "use strict";

    return Controller.extend("responsivetable.controller.EditableTable1", {
        onInit: function () {
            var oModel = this.getOwnerComponent().getModel('jsonModel');
            this.getView().setModel(oModel,"JSONModel");
            console.log(oModel);

            
            var aProducts = oModel.getProperty("/ProductCollection");
    
            aProducts.forEach(function(product) {
                product.editable = false;  // Initialize editable to false
            });
        
            oModel.refresh(); 

                 
          
        },
        onItemPress: function(oEvent) {
            // Get the selected item
            var oItem = oEvent.getParameter("listItem");
            var oContext = oItem.getBindingContext("JSONModel");
        
            // Set editable to true for the selected item
            oContext.getModel().setProperty(oContext.getPath() + "/editable", true);

             // Show Save and Cancel buttons
             this.getView().byId("saveButtonn").setVisible(true);
             this.getView().byId("cancelButtonn").setVisible(true);
        },
        onSave: function() {
            // Logic to save the changes and set editable to false
            var oModel = this.getView().getModel("JSONModel");
            var aProducts = oModel.getProperty("/ProductCollection");
        
            // Set all items' editable to false after saving
            aProducts.forEach(function(product) {
                product.editable = false;
            });
        
            oModel.refresh();  // Refresh the model to update the UI

                // Hide Save and Cancel buttons
                this.getView().byId("saveButtonn").setVisible(false);
                this.getView().byId("cancelButtonn").setVisible(false);
        },
        
        onCancel: function() {
            // Logic to cancel editing and set editable to false
            var oModel = this.getView().getModel("JSONModel");
            var aProducts = oModel.getProperty("/ProductCollection");
        
            // Set all items' editable to false
            aProducts.forEach(function(product) {
                product.editable = false;
            });
        
            oModel.refresh();

                
            // Hide Save and Cancel buttons
            this.getView().byId("saveButtonn").setVisible(false);
            this.getView().byId("cancelButtonn").setVisible(false);
        }

    });
});
