/**
 * Created by Anna Podhajska on 30/09/2018 -> personal project supporting Sales Force documentation.
 * Apex class to support creating solution work book via DocumentationGenerator.cmp
 * @History:
 * 22/20/2018 AniaP added handling picklist values
 */

public class DocumentationGeneratorCC {

    @AuraEnabled
    public static String getObjectDescription(String objApiName) {

        List<ObjectDescription> objectDescriptionList = new List<ObjectDescription>();

        try {

            String[] sObjectTypes = new String[]{objApiName};
            Schema.DescribeSObjectResult[] sObjectDescriptions = Schema.describeSObjects(sObjectTypes);

            for(Schema.DescribeSObjectResult result : sObjectDescriptions){

                //get object description
                ObjectDescription describedObject = new ObjectDescription();

                describedObject.Name = result.getLabel();
                describedObject.ApiName = result.getName();

                List<FieldDescription> fieldsList = new List<FieldDescription>();
                describedObject.Fields = fieldsList;

                Map<String, RecordTypeInfo> recordTypes = result.SObjectType.getDescribe().getRecordTypeInfosByName();
                describedObject.RecordTypes = new List<String>();
                for(RecordTypeInfo rec : recordTypes.values()){
                    describedObject.RecordTypes.add(rec.getName());
                }

                //get fields description
                for(SObjectField field : result.fields.getMap().values()) {
                    DescribeFieldResult describeFieldResult = field.getDescribe();

                    FieldDescription fieldDescription = new FieldDescription();
                    fieldDescription.ApiName = describeFieldResult.getName();
                    fieldDescription.Description = describeFieldResult.getInlineHelpText();
                    fieldDescription.Name = describeFieldResult.getLabel();
                    fieldDescription.Type = describeFieldResult.getType().name();
                    //if field type is a picklist then and get the values
                    if(describeFieldResult.getType().name() == 'PICKLIST'){
                        fieldDescription.TypeInfo = '';
                        List<Schema.PicklistEntry> ple = describeFieldResult.getPicklistValues();
                        for(Schema.PicklistEntry pickListVal : ple){
                            fieldDescription.TypeInfo +=  pickListVal.getLabel() + '; ';
                        }
                    }
                    fieldsList.add(fieldDescription);
                }

                objectDescriptionList.add(describedObject);
            }
        }
        catch (Exception e) {
            throw new AuraHandledException('Please ... are you kidding me? Give me a real object.');
        }
        return System.JSON.serialize(objectDescriptionList);


    }

    public class ObjectDescription {
        public String Name;
        public String ApiName;
        List<FieldDescription> Fields;
        List<String> RecordTypes;
    }
    public class FieldDescription {
        public String Name;
        public String ApiName;
        public String Description;
        public String Type;
        public String TypeInfo;
    }

}