'use strict'
import * as data from './remoteApiMetadata';
let ds = new data.metaDataService();

export class metadataContentProvider{
    
    public getContent = (type:string, memberType:string, member:string):string => {
        var content:string;
        
        switch(memberType){
            case  "method":
                content = this.buildMethodContent(type,member);
                break;
            case "properties":
                content = this.buildPropertyContent(type);
                break;
            case "info":
                content = this.buildInfoContent(type);
                break;  
            default:
                content = JSON.stringify({error:"Type member not found"}) ;    
                break;        
                                           
        }
        
        return content;
        
        
    }
    
    buildMethodContent = (type:string, member:string):string => {
        var method = ds.findMethod(type, member)
        var remoteMethod;
        if(method){
            var parms = [];
            if(method.Parameters){
                for(let parm in method.Parameters){
                    let tparm:any = method.Parameters[parm]
                    parms.push({
                        name:tparm.Name,
                        optional:tparm.Metadata.IsOptional,
                        type:tparm.Metadata.ParameterType,
                        odataType:tparm.Metadata.ParameterODataType
                    }); 
                }
            }
            var response:any;
            if(method.Response){
                response = {};
                response.odataType = method.Response.Type;
                response.isNew = method.Response.Metadata.IsNew;
                if(method.Response.Metadata.TargetTypeScriptClientFullName){
                    response.type = method.Response.Metadata.TargetTypeScriptClientFullName;
                }
                else{
                    if(method.Response.Metadata.ParameterTypeFullName)
                        response.type = method.Response.Metadata.ParameterTypeFullName;
                    else
                        if(method.Response.Metadata.PropertyType)
                            response.type = method.Response.Metadata.PropertyType;
                }

                if(response.type){
                    let rt = ds.findType(response.type);
                    if(!rt)
                        rt = ds.findType(method.Response.Metadata.TargetType);
                    if(!rt)
                        rt = ds.findType(method.Response.Metadata.ServerType);
                        
                    if(rt)
                        response.body = this.generateJson(rt);
                    else
                        response.body = null;
                }

            }
            else{
                response = "void";
            }
            remoteMethod = {
                name:type + "." + method.Name,
                serverName:method.Metadata.ServerMethod,
                javaScript:method.Metadata.JavaScript,
                rest:method.Metadata.Rest,
                intrinsicRestful:method.Metadata.IntrinsicRestful,
                static:method.Metadata.IsStatic,
                parameters:parms,
                postBody:this.generateJsonForPostMethod(method),
                response:response,
            };
            
        }
        return JSON.stringify(remoteMethod,null,"\t")
    }
    
    buildPropertyContent = (type:string):string => {
        var rt:any = ds.findType(type)
        var propertyContent:any = {};
        propertyContent.name = type;
        
        if(rt){
            if(rt.Properties){
                for(let prop in rt.Properties){
                    let tprop:any = rt.Properties[prop]
                    let propMetadata:any = {};
                    propMetadata.defaultValue = tprop.Metadata.DefaultValue;
                    propMetadata.excludeFromDefaultRetrieval = tprop.Metadata.ExcludeFromDefaultRetrieval;
                    propMetadata.propertyODataType = tprop.Metadata.PropertyODataType;
                    propMetadata.propertyType = tprop.Metadata.PropertyType;
                    propMetadata.readOnly = tprop.Metadata.ReadOnly;
                    propMetadata.isNew = tprop.Metadata.IsNew;
                    propertyContent[tprop.Name] = propMetadata;
                }
            }
        }
        return JSON.stringify(propertyContent,null,"\t");
        
    }
    
    buildInfoContent = (type:string):string => {
        return JSON.stringify({info:"You found " + type});
        
    }

    generateJsonForMultiValueType = (pi:any) => {
        
            var complexJson;
            var jsonObj;
            let rt = ds.findType(pi.ItemType);
            if(rt){
                complexJson = this.generateJson(rt);   
                if (pi.PropertyType.endsWith("[]"))
                {
                    jsonObj = {}; 
                    jsonObj["results"] =[];
                    jsonObj["results"].push(complexJson);             
                }
                else
                {
                    jsonObj = [];
                    jsonObj.push(complexJson);
                }
            }
            else{
                jsonObj = {}; 
                jsonObj["results"] =[]; 
            }
            

            return jsonObj;

        }

    generateJson = (source:any) => {

            var json;
            var nestedJson;
            var jsonObj = {};
            jsonObj["__metadata"] = {};

            //adjustment for complex types used with intrinsic restful methods
            let index = source.Metadata.TargetTypeScriptClientFullName.lastIndexOf("EntityData");
            jsonObj["__metadata"]["type"] = source.Metadata.TargetTypeScriptClientFullName.endsWith("EntityData") ? 
                source.Metadata.TargetTypeScriptClientFullName.substring(0, index) : 
                source.Name;

            for(let p in source.Properties)
            {
                let pv:any = source.Properties[p];
                let pi = pv.Metadata;
                if (pi.PropertyODataType.toLowerCase() == "complextype")
                {
                    let rt = ds.findType(pi.PropertyType);
                    if(rt){
                        nestedJson = this.generateJson(rt);
                        jsonObj[pv.Name] = nestedJson;        
                    }
                }
                else
                {
                    jsonObj[pv.Name];
                    if (pi.PropertyODataType.toLowerCase() == "multivalue")
                    {
                        let mv = this.generateJsonForMultiValueType(pi);
                        jsonObj[pv.Name] = mv;
                    }
                    else
                    {
                        jsonObj[pv.Name] = null;
                    }
                }
            }

            if (source.Metadata.CollectionChildItemType)
            {
                jsonObj["Items"] = [];
                let rt = ds.findType(source.Metadata.CollectionChildItemType);
                if(rt){
                    nestedJson = this.generateJson(rt);
                    jsonObj["Items"][0] = nestedJson;        
                }
            }

            return jsonObj;
         
        }

    generateJsonForPostMethod = (method:any) => {
            var jsonPayload:any = {};
            var methodInfo:any = method.Metadata;
            
            for(let p in method.Parameters)
            {
                let pi:any = method.Parameters[p];
                var complexJson; 
                var parameterType;
                var parameterODataType:string;
                var parameterItemType; 
                var rt:any;        

                if(pi.Metadata.$type ==  "SPRemoteAPIAnalytics.Metadata.RemoteComplexTypeNodeInfo, SPRemoteAPIAnalytics"){
                    parameterType = pi.Metadata.ParameterType;
                    parameterODataType = pi.Metadata.ParameterODataType;
                    parameterItemType = pi.Metadata.ItemType;
                }
                else{
                    if(pi.Metadata.$type ==  "SPRemoteAPIAnalytics.Metadata.RemoteParameterNodeInfo, SPRemoteAPIAnalytics"){
                        parameterType = pi.Metadata.ParameterType;
                        parameterODataType = pi.Metadata.ParameterODataType;
                        parameterItemType = pi.Metadata.ItemType;
                    }
                }
                
                if (parameterType && parameterODataType){
                    if (parameterODataType.toLowerCase() == "complextype")
                    {
                        if (!method.Metadata.IntrinsicRestful){
                            jsonPayload[pi.Name];
                            rt = ds.findType(parameterType);
                            //sometimes unable to find based on parameter type if named with an alias like SP
                            if(!rt) {
                                rt = ds.findType(pi.Metadata.ServerType);
                            }
                        }
                        else{
                            var entityType = this.getEntityforIntrinsicCall(pi.Metadata.ServerType)
                            if(entityType){
                                rt = ds.findType(entityType);    
                            }
                            else{
                                rt = ds.findType(pi.Metadata.ServerType);
                            }
                        }

                        
                        if(rt){
                            complexJson = this.generateJson(rt);    
                        }
    
                        if (!method.Metadata.IntrinsicRestful){
                           jsonPayload[pi.Name] = complexJson;
                        }
                        else{
                            jsonPayload = complexJson;
                        }
                        
                    }
                    else
                    {
                        jsonPayload[pi.Name] = "";
                        if (parameterODataType == "multivalue")
                        {
                            let mv = this.generateJsonForMultiValueType(parameterItemType);
                            jsonPayload[pi.Name] = mv;
                        }
                        else
                        {
                            jsonPayload[pi.Name] = null;
                        }

                    }
                }

            }  
            return jsonPayload;
            
        }

        getEntityforIntrinsicCall = (type:string) =>{
            let index = type.lastIndexOf("EntityData");
            let entityType = type.endsWith("EntityData") ? 
                type.substring(0, index) : 
                null;
            return entityType;

        }
    
}