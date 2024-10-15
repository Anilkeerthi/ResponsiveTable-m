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
						value: "{Name}"
					}), new Input({
						value: "{Quantity}",
						description: "{UoM}"
					}), new Input({
						value: "{WeightMeasure}",
						description: "{WeightUnit}"
					}), new Input({
						value: "{Price}",
						description: "{CurrencyCode}"
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
			this.aProductCollection = deepExtend([], this.oModel.getProperty("/ProductCollection"));
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
			this.byId("cancelButton").setVisible(false);
			this.byId("saveButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			this.oModel.setProperty("JSONModel>ProductCollection", this.aProductCollection);
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
  