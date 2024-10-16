sap.ui.define(
    [
        'sap/base/util/deepExtend',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/m/ColumnListItem',
        'sap/m/Input',
        'sap/m/MessageToast'
    ],
    function(deepExtend, Controller, JSONModel, ColumnListItem, Input, MessageToast) {
      "use strict";
  
      return Controller.extend("responsivetable.controller.EditableTable", {
        onInit: function() {

            var oModel = this.getOwnerComponent().getModel('jsonModel');
            this.getView().setModel(oModel,"JSONModel");
            console.log(oModel);

       
            this.oTable = this.byId("idProductsTableEditable");
			this.getView().setModel(this.oModel);
			this.oReadOnlyTemplate = this.byId("idProductsTableEditable").removeItem(0);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new Input({
						value: "{JSONModel>Product} "
					 }),
					  new Input({
						value: "{JSONModel>Quantity}",
						description: "{JSONModel>UoM}",


// coloum doesnot editable 
            //               new sap.m.Text({
            // text: "{JSONModel>Quantity}"


			
					}), new Input({
						value: "{JSONModel>Weight}",
						description: "{JSONModel>WeightUnit}"
					}), new Input({
						value: "{JSONModel>Price}",
						description: "{JSONModel>CurrencyCode}"
					})
				]
			});


        },

        rebindTable: function(oTemplate, sKeyboardMode) {
			this.oTable.bindItems({
				path: "JSONModel>/ProductCollection",
				template: oTemplate,
				templateShareable: true,
				key: "ProductId"
			});
		},

        

        onEdit: function() {
			//this.aProductCollection = deepExtend([], this.oModel.getProperty("/ProductCollection"));

			var oModel = this.getView().getModel("JSONModel");
    
			// Deep copy of the ProductCollection data
			this.aProductCollection = deepExtend([], oModel.getProperty("JSONModel>/ProductCollection"));
			this.byId("editButton").setVisible(false);
			this.byId("saveButton").setVisible(true);
			this.byId("cancelButton").setVisible(true);
			this.rebindTable(this.oEditableTemplate, "Edit");
		},

		onSave: function() {
			this.byId("saveButton").setVisible(false);
			this.byId("cancelButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		},

		onCancel: function() {

			var oModel = this.getView().getModel("JSONModel");
    
			this.byId("cancelButton").setVisible(false);
			this.byId("saveButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			oModel.setProperty("JSONModel>/ProductCollection", this.aProductCollection);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		},

		onOrder: function() {
			MessageToast.show("Order button pressed");
		},

		onExit: function() {
			this.aProductCollection = [];
			this.oEditableTemplate.destroy();
			this.oModel.destroy();
		},
        onPaste: function(oEvent) {
			var aData = oEvent.getParameter("data");
			MessageToast.show("Pasted Data: " + aData);
		}
      });
    }
  );
  