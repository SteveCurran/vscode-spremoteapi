
var remotes;
var remoteNames = [];

export class metaDataService {
       
public  getRemoteTypes = () => {
    var fs = require('fs');

    var resolve;
    var reject;
    var promise = new Promise((resolve, reject) =>{
        //check configuration for which data file.
        if(!remotes){
            fs.readFile('C:\\spremoteapi\\src\\data\\remotes2016.json', (err, data) =>{
                if (err) 
                return reject(err);
                
                remotes = JSON.parse(data);
                for(var remote in remotes){
                    let labelText = remotes[remote].Metadata.IsNew ?
                    "$(octicon octicon-flame)" + remotes[remote].Name:remotes[remote].Name
                    let detailText = this.buildTypeItemDetail(remotes[remote].Metadata);
                    remoteNames.push({label:labelText,detail:detailText}); 
                }
                return resolve(remoteNames);
            });
        }
        else{
            return resolve(remoteNames);    
        }
    });
    return promise;

};

public buildTypeItemDetail = (metadata:any) =>{
    
    let restDetail = metadata.Rest?"Rest | ":"";
    let jsDetail = metadata.JavaScript?"JavaScript | ":"";
    let newDetail = metadata.IsNew ? "New | ":"";
    let detail = restDetail + jsDetail + newDetail;
    return detail.substring(0,detail.length - 2);
}

public buildMethodItemDetail = (metadata:any) =>{
    
    let restDetail = metadata.Rest?"Rest | ":"";
    let jsDetail = metadata.JavaScript?"JavaScript | ":"";
    let newDetail = metadata.IsNew ? "New | ":"";
    let detail = restDetail + jsDetail + newDetail;
    return detail.substring(0,detail.length - 2);
}

public buildPropertyItemDetail = (metadata:any) =>{
    
    let typeDetail = "Type | " + metadata.PropertyType;
    return typeDetail ;
}

public findTypeInfo = (typeName:string) =>{
    var typeInfo = {methodCount:0, propertyCount:0};
    if(remotes){
       var item = remotes.find(function(item:any){
            return item.Name == typeName;
        });
        
        if(item){
            if(item.Methods){
               typeInfo.methodCount = item.Methods.length;
            }
            if(item.Properties){
                typeInfo.propertyCount = item.Properties.length;
            }
        }
    }
    
    return typeInfo;
    
}

public findType = (typeName:string) =>{
   
    var item:any;

    if(remotes){
        item = remotes.find(function(item:any){
            return item.Name == typeName;
        });
    }
    
    return item;
    
}

public findMethods = (remoteName) =>{
    
    var remoteMethods= [];
    
    if(remotes){
       var item = remotes.find(function(item:any){
            return item.Name == remoteName;
        });
        
        if(item){
            if(item.Methods){
               for(var method in item.Methods){
                   let tmp:any = method
                   let labelText = item.Methods[tmp].Metadata.IsNew ? 
                    "$(octicon octicon-flame)" + item.Methods[tmp].Name:item.Methods[tmp].Name
                   let detailText = this.buildMethodItemDetail(item.Methods[tmp].Metadata);
                   remoteMethods.push({label: labelText,description:"",detail:detailText}); 
                } 
            }
        }
    }
    
    return remoteMethods;
    
}

public findMethod = (remoteName:string, methodName:string) =>{
    var remoteMethod;
    if(remotes){
       var item = remotes.find(function(item:any){
            return item.Name == remoteName;
        });
        
        if(item){
            if(item.Methods){
               var method = item.Methods.find(function(m:any){
                   return m.Name == methodName;
               });
               remoteMethod = method;
            }
        }
    }
    
    return remoteMethod;
    
}

public findProperties = (remoteName) =>{
    
    var remoteProperties= [];
    
    if(remotes){
       var item = remotes.find(function(item:any){
            return item.Name == remoteName;
        });
        
        if(item){
            if(item.Properties){
               for(var prop in item.Properties){
                   let tmp:any = prop
                   let labelText = item.Properties[tmp].Metadata.IsNew ? 
                    "$(octicon octicon-flame)" + item.Properties[tmp].Name:item.Properties[tmp].Name
                   let detailText = this.buildPropertyItemDetail(item.Properties[tmp].Metadata);
                   remoteProperties.push({label: labelText,description:"",detail:detailText}); 
                } 
            }
        }
    }
    
    return remoteProperties;
    
}
}