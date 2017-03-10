import * as vscode from 'vscode';

var remotes;
var remoteNames = [];
var externals;


export class metaDataService {
       
public  getRemoteTypes = (filePath) => {
    var fs = require('fs');

    var resolve;
    var reject;
    var promise = new Promise((resolve, reject) =>{
        if(!remotes){
            fs.readFile(filePath, (err, data) =>{
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

public  getExternalTypes = (filePath) => {
    var fs = require('fs');

    var resolve;
    var reject;
    var promise = new Promise((resolve, reject) =>{
        if(!externals){
            fs.readFile(filePath, (err, data) =>{
                if (err) 
                    return reject(err);
                
                externals = JSON.parse(data);
                return resolve();
            });
        }
        else{
            return resolve();    
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
            return item.Name.toLowerCase() == typeName.toLowerCase();
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
            return item.Name.toLowerCase() == typeName.toLowerCase();
        });
    }
    
    return item;
    
}

public findExternalType = (typeName:string) =>{
   
    var item:any;

    if(externals){
        item = externals.find(function(item:any){
            return item.Name.toLowerCase() == typeName.toLowerCase();
        });
    }
    
    return item;
    
}

public findMethods = (remoteName) =>{
    
    var remoteMethods= [];
    
    if(remotes){
       var item = remotes.find(function(item:any){
            return item.Name.toLowerCase() == remoteName.toLowerCase();
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
            return item.Name.toLowerCase() == remoteName.toLowerCase();
        });
        
        if(item){
            if(item.Methods){
               var method = item.Methods.find(function(m:any){
                   return m.Name.toLowerCase() == methodName.toLowerCase();
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
            return item.Name.toLowerCase() == remoteName.toLowerCase();
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