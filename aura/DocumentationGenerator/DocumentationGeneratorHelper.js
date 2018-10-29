/**
 * Created by Anna on 7/10/2018.
 * Created by Anna on 30/09/2018.
 * @History: 22/10/2018 AniaP refactored and added handling picklist values.
 */
({
    handleGetObjDescription : function (component, event, helpler) {

        var objToDescribeApi = component.get("v.objToDescribeApi");

        //if there an api has been provided on UI:
        if(objToDescribeApi != null) {

            //call backend:
            var action  = component.get("c.getObjectDescription");
            action.setParams({objApiName: objToDescribeApi});

            action.setCallback(this, function(response){

                var state = response.getState();
                if(state === "SUCCESS"){

                        let resp = JSON.parse(response.getReturnValue())[0];
                        this.manageTheResponse(component, resp);

                    }else{
                        this.handleErrors(component, response, 'dismissible');
                        //display input screen
                        component.set("v.isRenderedInputPage", true);
                    }

                    //reset the searched api name
                    component.set("v.objToDescribeApi", null);

                });
                $A.enqueueAction(action);

        }
    },

    manageTheResponse : function(component, resp){

        var response = resp;

        for (var i = 0; i<response.Fields.length; i++){

            //change incoming field type to lower case with only first letter capitalized
            response.Fields[i].Type = response.Fields[i].Type.charAt(0).toUpperCase() + response.Fields[i].Type.substr(1).toLowerCase();

        }
        console.log(response);
        //set aura attribute with whole response:
        component.set("v.receivedDescription", resp);
        //set aura attribute with array of fields:
        component.set("v.receivedDescriptionFieldsList", resp.Fields);
        //set aura attribute with array of record types:
        component.set("v.receivedRecordTypes", resp.RecordTypes)

    },

    handleErrors : function(component, response, mode) {

        var errors = response.getError();
        //console.log('errors: ', errors);
        if(errors && errors.length > 0){									//Null check errors array before looping through this.
            for(var i = 0; i < errors.length; i++){							//More than one error may be returned, so loop through errors array from response.

                var errorToast = $A.get("e.force:showToast");
                errorToast.setParams({
                    "mode" : mode,
                    "message" : errors[i].message,
                    "type" : "error"
                });

                errorToast.fire();
            }
        }
    }

})