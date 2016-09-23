'use strict'
import * as data from './remoteApiMetadata';
let ds = new data.metaDataService();

export class interfaceContentProvider{

    buildInterface = (rt:any):string => {
            let interfaceContent:string;
            let interfaceTemplate: string = "export interface !@iname {\r\n !@props \r\n}\r\n";
            let propTemplate:string = "\t !@propname?: !@typename;\r\n";
            let props:string = "";
            let interfaceName = rt.Name.substr(rt.Name.lastIndexOf(".")+1).replace("+","");
            
            if(rt){
                if(rt.Properties){
                    let seen:Array<string> = [];
                    for(let prop in rt.Properties){
                        
                        let tprop:any = rt.Properties[prop]
                        if(seen.indexOf(tprop.Name) === -1){
                            props = props + propTemplate.replace("!@propname",tprop.Name).replace("!@typename",
                            this.transToTypscriptType(tprop.Metadata));
                        }
                    
                        seen.push(tprop.Name);
                    }

                    interfaceContent = interfaceTemplate.replace("!@iname",interfaceName).replace("!@props",props.substr(0,(props.length - 2)));
                }
                else{
                    interfaceContent = interfaceTemplate.replace("!@iname",interfaceName).replace("!@props","");
                }
            }

            return interfaceContent;
    }
    public buildAllInterfaces = (type:string):string => {
        let interfaceContent:string = "";
        let interfaceQueue:Array<any> = [];
        let rt:any = ds.findType(type)

        if(rt){
            interfaceQueue.push(rt);
            this.lookupTypes(interfaceQueue,type)
        }

        interfaceQueue.forEach(remoteType => {
            interfaceContent = interfaceContent + this.buildInterface(remoteType); + "\r\n";  
        });

        return interfaceContent;
    }

    lookupTypes = (interfaceQueue:Array<any>,type:any):void =>{
        let rt:any = ds.findType(type) || ds.findExternalType(type);
        if(rt){
            if(rt.Properties){
                for(let prop in rt.Properties){
                    let discoveredType:string = null;
                    let tprop:any = rt.Properties[prop];
                    let odtype = tprop.Metadata.PropertyODataType.toLowerCase();
                    if(odtype != "primitive"){
                        if(odtype =="multivalue")
                        {
                            if(!tprop.Metadata.ItemType.startsWith("System.Collections.Generic.Dictionary") && 
                                !this.isPrimitiveType(tprop.Metadata.ItemType)){
                                if(tprop.Metadata.ItemType.indexOf("[") > 0){
                                    let start:number = tprop.Metadata.ItemType.indexOf("[") + 1;
                                    let end:number = tprop.Metadata.ItemType.indexOf("]");
                                    discoveredType = tprop.Metadata.ItemType.subString(start,(start-end));
                                }
                                else{
                                    discoveredType = tprop.Metadata.ItemType;    
                                }
                            }
                            else{
                                if(tprop.Metadata.ItemType.startsWith("System.Collections.Generic.Dictionary")){
                                    discoveredType = "SPProperty";
                                }   
                            }
                        }
                        else{
                            discoveredType = tprop.Metadata.PropertyType;
                        }
                    }

                    if(discoveredType){
                        let dt:any = ds.findType(discoveredType) || ds.findExternalType(discoveredType);
                        if(dt){
                            let dup:boolean = false;
                            interfaceQueue.forEach(element => {
                               if(element.Name === dt.Name){
                                   dup = true;
                               }
                            });
                           
                            if(!dup){
                                interfaceQueue.push(dt); 
                                this.lookupTypes(interfaceQueue,discoveredType);       
                            }
                        }
                        
                    }
                }
            }
        }
    }

    transPrimitiveType = (evalType:string):string =>{
        let typescriptType:string = "";
        
        switch(evalType){
            case "int32":
            case "int64":
            case "double":
            case "decimal":
                typescriptType = "number";
                break;
            case "string":
            case "guid":
                typescriptType = "string";
                break;
            case "boolean":
                typescriptType = "boolean";
                break;
            case "datetime":
                typescriptType = "date";
            case "timespan":
                typescriptType = "any";
            default:
                //enum
                typescriptType = "number"  
                break;
        }

        return typescriptType;
    }

    transToTypscriptType(metadata:any){
        let typescriptType:string = "";
        let odtype = metadata.PropertyODataType.toLowerCase();
        if(odtype == "primitive"){
            let evalType = metadata.PropertyType.substring(metadata.PropertyType.lastIndexOf(".") + 1).toLowerCase();
            typescriptType = this.transPrimitiveType(evalType);
        }
        else{
            if(odtype =="multivalue")
            {
                typescriptType = this.transMultiValueType(metadata);
            }
            else{
                typescriptType = metadata.PropertyType.substring(metadata.PropertyType.lastIndexOf(".") + 1).replace("+","");
            }
            
        }

        return typescriptType;

    }

    transMultiValueType(metadata:any){
        let typescriptType:string = "";
        let evalType = metadata.ItemType.substring(metadata.ItemType.lastIndexOf(".") + 1).toLowerCase();
        if(metadata.ItemType.startsWith("System.Collections.Generic.Dictionary")){
            typescriptType = "SPProperty" + "[]";
        }
        else{
            if(this.isPrimitiveType(metadata.ItemType)){
                typescriptType = this.transPrimitiveType(evalType) + "[]";
            }
            else{
                if(metadata.ItemType.indexOf("[") > 0){
                    let start:number = metadata.ItemType.indexOf("[") + 1;
                    let end:number = metadata.ItemType.indexOf("]");
                    let arrayType:string = metadata.ItemType.subString(start,(start-end));
                    if(this.isPrimitiveType(arrayType)){
                        typescriptType = this.transPrimitiveType(evalType) + "[]";    
                    }
                    else{
                        typescriptType = arrayType + "[]";        
                    }
                }
                else{
                    typescriptType = metadata.ItemType.substring(metadata.ItemType.lastIndexOf(".") + 1) + "[]";
                }
                
            }
        }
 
        return typescriptType;

    }

    isPrimitiveType(evalType:string){
        switch(evalType.toLowerCase()){
            case "system.int32":
            case "system.int64":
            case "system.double":
            case "system.decimal":
            case "system.string":
            case "system.guid":
            case "system.boolean":
            case "system.datetime":
            case "system.timespan":
                return true    
            default:
                if(evalType.toLowerCase().endsWith("type"))
                    return true
                else
                    return false;
        }
    }


}