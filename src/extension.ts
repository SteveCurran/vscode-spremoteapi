'use strict';
import * as vscode from 'vscode';
import * as data from './services/remoteApiMetadata';
import * as content from './services/contentProvider';
import * as interfaceContent from './services/interfaceProvider';
let ds = new data.metaDataService();
var dataPathFile;
var externalsPathFile;



export function activate(context: vscode.ExtensionContext) {
    let config:any = vscode.workspace.getConfiguration("spremoteapi.options");
    if(config){
        if(config.apiType){
            if(config.apiType == "2013"){
                dataPathFile = context.asAbsolutePath("\\out\\src\\data\\remotes2013.json");
            }
        }    
    }

    if(!dataPathFile){   
        dataPathFile = context.asAbsolutePath("\\out\\src\\data\\remotes2016.json");
    }
    
    externalsPathFile = context.asAbsolutePath("\\out\\src\\data\\remotesExternal.json")

    vscode.workspace.registerTextDocumentContentProvider("spremotescheme",
        {provideTextDocumentContent(uri){
            var typeName = uri.query;
            var memberType = uri.fsPath.substring(uri.fsPath.indexOf('\\')+1,uri.fsPath.lastIndexOf('\\'));
            var opName = uri.fsPath.substring(uri.fsPath.lastIndexOf('\\')+1,(uri.fsPath.length-5));
            
            if(memberType === "interface"){
                let is = new interfaceContent.interfaceContentProvider();
                let con = is.buildAllInterfaces(typeName);
                return con;   
            }
            else{
                let cs = new content.metadataContentProvider();
                let con = cs.getContent(typeName,memberType,opName);
                return con;
            }
        }

        });

        

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.spremoteapi', () => {
         vscode.window.showQuickPick(new Promise((resolve, reject) => {
             ds.getRemoteTypes(dataPathFile).then(data=>{
                return resolve(data); 
             }).catch(err=>{
                return reject(err); 
             });
             ds.getExternalTypes(externalsPathFile);
        }),{matchOnDetail:true}).then(
            val => { 
                typeSelectOptionHandler(val);                      
        }, reason => {
            let v = reason;
        }
            
       );
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

export function typeSelectOptionHandler(type){
   
    if(type) {
        let item: any = type;
        let itemName = item.label.startsWith("$(octicon octicon-flame)") ? item.label.substr(24) : item.label;
        let typeInfo = ds.findTypeInfo(itemName);
        let optionMethods = <vscode.MessageItem>{title:"Methods (" +  typeInfo.methodCount + ")"};
        let optionProperties = <vscode.MessageItem>{title:"Properties (" +  typeInfo.propertyCount + ")"};
        let optionCreateInterface = <vscode.MessageItem>{title:"Create Interface"};

        let options:Array<vscode.MessageItem> = [];
        if(typeInfo.methodCount > 0)
            options.push(optionMethods);    
        if(typeInfo.propertyCount > 0) { 
            options.push(optionProperties);
            options.push(optionCreateInterface);
        }
        

        vscode.window.showInformationMessage<vscode.MessageItem>(itemName,...options).then(option => {
            if (typeof option == 'undefined') {
                return;
            }
            if(option.title.startsWith("Methods")){
                vscode.window.showQuickPick(new Promise((resolve,reject) => {                       
                    var methods = ds.findMethods(itemName); 
                    return resolve(methods);  
                }),{placeHolder:itemName + "#methods"}).then(val=>{
                    if(val){
                        let vval:any = val;
                        let methodName = vval.label.startsWith("$(octicon octicon-flame)") ? vval.label.substr(24) : vval.label;
                        let uri = vscode.Uri.parse('spremotescheme://remote/method/'+ methodName + ".json?" + itemName);
                        vscode.workspace.openTextDocument(uri).then(doc=>{
                            vscode.window.showTextDocument(doc,vscode.ViewColumn.Two,true);
                            return;
                        });        
                    }
                    
                });
            }
            else {    
               
                if(option.title.startsWith("Properties"))
                {
                    let uri = vscode.Uri.parse('spremotescheme://remote/properties/properties.json?' + itemName);
        
                    vscode.workspace.openTextDocument(uri).then(doc=>{
                        vscode.window.showTextDocument(doc,vscode.ViewColumn.Two);  
                        return;
                    });                      
                }
                else{
                    let uri = vscode.Uri.parse('spremotescheme://remote/interface/' + itemName + '.d.ts?' + itemName);
        
                    vscode.workspace.openTextDocument(uri).then(doc=>{
                        vscode.window.showTextDocument(doc,vscode.ViewColumn.Two);  
                        return;
                    }); 
                }

           
            }
                
            return;
        });
 
    }
  
}