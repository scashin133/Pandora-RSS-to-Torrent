//a "static" class to handle our app settings
var Settings = {
    //some static properties to hold db connection and the inital state
    __db: null,
    __result: null,
    
    //this method will load the settings from the db
    __load: function(dbconn) {
        Settings.__db = dbconn;
        
        //execute simple select * on the settings table
        var stmt = new air.SQLStatement();
            stmt.sqlConnection = dbconn;
            stmt.text = "select IdSetting, name, value, namespace from settings";
            stmt.execute();
        
        var result = stmt.getResult().data;
        
        //save the settings in the class property __result
        Settings.__result = result;
        
        //cycle trough the db result and make properties into the class itself
        for( var i=0; i<result.length; i++ ){
        
            //if the property has namespace create one for it
            if (result[i].namespace!=null) {
                //fetch setting property with namespace
                if (!Settings[result[i].namespace]) {
                    Settings[result[i].namespace] = {};
                }
                Settings[result[i].namespace][result[i].name] = result[i].value;
            } else {
                //a plain setting property - create it directly in the class
                Settings[result[i].name] = result[i].value;
            }
        }
        //make sure we don't cause memory leaks
        stmt = null;
        result = null;
    },
    
    //this method will save all changed settings
    __save: function() {
        var stmt = new air.SQLStatement();
            stmt.sqlConnection = Settings.__db;
        
        //walk trough all settings INITALLY loaded from the database
        for (var i = 0; i < Settings.__result.length; i++) {
            
            //check if the current property has namespace
            if (Settings.__result[i].namespace!=null) {
                //check if the initial value is equal to the current value
                if ( Settings[Settings.__result[i].namespace][Settings.__result[i].name] != Settings.__result[i].value ) {
                    //update the db. bound parameters are always better
                    stmt.text = "update settings set value= :value where name= :name and namespace= :namespace";
                    stmt.parameters[":name"] = Settings.__result[i].name;
                    stmt.parameters[":value"] = Settings[Settings.__result[i].namespace][Settings.__result[i].name];
                    stmt.parameters[":namespace"] = Settings.__result[i].namespace;
                    stmt.execute();
                }
            }
             else {
                //check if the initial value is equal to the current value
                if (Settings[Settings.__result[i].name] != Settings.__result[i].value) {
                    //update the db, look for namespace equals NULL
                    stmt.text = "update settings set value= :value where name= :name and namespace IS NULL";
                    stmt.parameters[":name"] = Settings.__result[i].name;
                    stmt.parameters[":value"] = Settings[Settings.__result[i].name];
                    stmt.execute();
                }
                
            }
            
            
        }
        stmt = null;
    }
};