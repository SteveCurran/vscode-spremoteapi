'use strict';
import * as vscode from 'vscode';
import * as data from './services/remoteApiMetadata';
import * as content from './services/contentProvider';
let ds = new data.metaDataService();
var dataPathFile;


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
    
    
    vscode.workspace.registerTextDocumentContentProvider("spremotescheme",
        {provideTextDocumentContent(uri){
        var typeName = uri.authority;
        var memberType = uri.fsPath.substring(uri.fsPath.indexOf('\\')+1,uri.fsPath.lastIndexOf('\\'));
        var opName = uri.fsPath.substring(uri.fsPath.lastIndexOf('\\')+1,(uri.fsPath.length-5));
        let cs = new content.metadataContentProvider();
        let con = cs.getContent(typeName,memberType,opName);
        return con;}

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
    
   
        vscode.window.showInformationMessage(itemName,optionMethods,optionProperties).then(option => {
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
                        let uri = vscode.Uri.parse('spremotescheme://' + itemName + '/method/'+ methodName + ".json");
                                        
                        vscode.workspace.openTextDocument(uri).then(doc=>{
                            vscode.window.showTextDocument(doc,vscode.ViewColumn.Two,true).then((textEditor)=>{
                                //var t:vscode.TextEditor = textEditor;
                            });  
                            return;
                        });        
                    }
                    
                });
            }
            else {    
               
                   
                let uri = vscode.Uri.parse('spremotescheme://' + itemName + '/properties/properties.json');
        
                vscode.workspace.openTextDocument(uri).then(doc=>{
                    vscode.window.showTextDocument(doc,vscode.ViewColumn.Two);  
                    return;
                });                      
                   
           
            }
                
            return;
        });
 
    }
  
}