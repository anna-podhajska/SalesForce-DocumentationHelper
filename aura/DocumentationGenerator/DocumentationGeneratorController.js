/**
 * Created by Anna on 30/09/2018.
 * @History: 22/10/2018 AniaP refactored and added handling picklist values.
 */
({
    doInit : function(component, event, helper) {
        //doinit
    },

    handleGetDescription : function(component, event, helper) {

        //hide input screen
        component.set("v.isRenderedInputPage", false);
        helper.handleGetObjDescription(component, event, helper);

    },

    handleShowInputPage : function (component, event, helper) {

        //reset the searched api name
        component.set("v.objToDescribeApi", null);
        //display input screen
        component.set("v.isRenderedInputPage", true);


    }

})