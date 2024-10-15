sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("responsivetable.controller.Dashboard", {
        onInit: function () {

        },

        onclickSettingsandMenus:function(){
            var route = this.getOwnerComponent().getRouter();
            route.navTo("RouteSettingsMenus")
        },
        onClickEditableTable:function(){
            var route = this.getOwnerComponent().getRouter();
            route.navTo("RouteEditableTable")
        }

    });
});
