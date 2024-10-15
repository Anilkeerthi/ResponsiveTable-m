sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/Device',
    'sap/ui/model/Filter',
    'sap/ui/model/Sorter',
    'sap/ui/model/json/JSONModel',
    'sap/m/Menu',
    'sap/m/MenuItem',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    './Formatter'
],
function (Controller, Device , Filter, Sorter, JSONModel, Menu, MenuItem, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("responsivetable.controller.SettingsMenus", {
        onInit: function () {
              var oModel = this.getOwnerComponent().getModel('jsonModel');
              this.getView().setModel(oModel,"JSONModel");
              console.log(oModel);


              var oView = this.getView();

              Fragment.load({
                  id: this.getView().getId(),
                  name: "responsivetable.view.ColumnMenu",
                  controller: this
              }).then(function(oMenu) {
                  oView.addDependent(oMenu);
                  return oMenu;
              });


			// Keeps reference to any of the created ViewSettingsDialog-s in this sample
//to store references to view setting dialogs (for sorting, filtering, grouping).
			this._mViewSettingsDialogs = {};

            this.mGroupFunctions = {
				SupplierName: function(oContext) {
					var name = oContext.getProperty("SupplierName");
					return {
						key: name,
						text: name
					};
				},
				Price: function(oContext) {
					var price = oContext.getProperty("Price");
					var currencyCode = oContext.getProperty("CurrencyCode");
					var key, text;
					if (price <= 100) {
						key = "LE100";
						text = "100 " + currencyCode + " or less";
					} else if (price <= 1000) {
						key = "BT100-1000";
						text = "Between 100 and 1000 " + currencyCode;
					} else {
						key = "GT1000";
						text = "More than 1000 " + currencyCode;
					}
					return {
						key: key,
						text: text
					};
				}
			};
        },

        resetGroupDialog: function(oEvent) {
			this.groupReset =  true;
		},


        getViewSettingsDialog: function (sDialogFragmentName) {
			var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!pDialog) {
				pDialog = Fragment.load({
					id: this.getView().getId(),
					name: sDialogFragmentName,
					controller: this
				}).then(function (oDialog) {
					if (Device.system.desktop) {
						oDialog.addStyleClass("sapUiSizeCompact");
					}
					return oDialog;
				});
				this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
			}
			return pDialog;
		},


		handleSortButtonPressed: function () {
			this.getViewSettingsDialog("responsivetable.view.SortDialog")
				.then(function (oViewSettingsDialog) {
					oViewSettingsDialog.open();
				});
		},

		handleFilterButtonPressed: function () {
			this.getViewSettingsDialog("responsivetable.view.FilterDialog")
				.then(function (oViewSettingsDialog) {
					oViewSettingsDialog.open();
				});
		},

		handleGroupButtonPressed: function () {
			this.getViewSettingsDialog("responsivetable.view.GroupDialog")
				.then(function (oViewSettingsDialog) {
					oViewSettingsDialog.open();
				});
		},

        handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId("idProductsTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},

        handleFilterDialogConfirm: function (oEvent) {
			var oTable = this.byId("idProductsTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];

			mParams.filterItems.forEach(function(oItem) {
				var aSplit = oItem.getKey().split("___"),
					sPath = aSplit[0],
					sOperator = aSplit[1],
					sValue1 = aSplit[2],
					sValue2 = aSplit[3],
					oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});

			// apply filter settings
			oBinding.filter(aFilters);

			// update filter bar
			this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			this.byId("vsdFilterLabel").setText(mParams.filterString);
		},

        handleGroupDialogConfirm: function (oEvent) {
			var oTable = this.byId("idProductsTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				vGroup,
				aGroups = [];

			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
				// apply the selected group settings
				oBinding.sort(aGroups);
			} else if (this.groupReset) {
				oBinding.sort();
				this.groupReset = false;
			}
		},

        onToggleContextMenu: function (oEvent) {
			var oToggleButton = oEvent.getSource();
			if (oEvent.getParameter("pressed")) {
				oToggleButton.setTooltip("Disable Custom Context Menu");
				this.byId("idProductsTable").setContextMenu(new Menu({
					items: [
						new MenuItem({text: "{Name}"}),
						new MenuItem({text: "{ProductId}"})
					]
				}));
			} else {
				oToggleButton.setTooltip("Enable Custom Context Menu");
				this.byId("idProductsTable").destroyContextMenu();
			}
		},

		onActionItemPress: function() {
			MessageToast.show('Action Item Pressed');
		}

    });

    return SettingsMenusController;

});
