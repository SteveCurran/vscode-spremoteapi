# README

## SPRemoteAPI VSCode Extension 
 Discover what is available in SharePoint and Office 365 REST and JavaScript API without having to have SharePoint installed. You can type in a namespace and browse the methods and properties. You can determine if they are available to be used with REST and JavaScript. You can also see what is new in SharePoint 2016. Finally when looking at specific methods or functions the extension gives the required JSON post bodies and response payloads, allowing the developer to easily copy and paste this into his code. 
 

### New in version 1.5 Create TypeScript Interfaces
Select the REST type and click the "Create Interface" options
![Alt Text](https://c1.staticflickr.com/9/8070/29240483853_992658bbea_b.jpg)


![Alt Text](https://c2.staticflickr.com/6/5526/29240480373_8b6178e500_z.jpg)

Copy interfaces into your own Typescript file. Import and get intellisense and type checking.
![Alt Text](https://c1.staticflickr.com/9/8348/29753385412_3e0f7201e4_o.png)

### Using SPRemoteAPI Extension (Step 1)
In VSCode just hit F1 and start typing SPRemoteAPI and you will see it appear in the drop down list.
![Alt Text](https://c2.staticflickr.com/8/7631/28047195465_b8a1b7d59d_o.png)

### Using SPRemoteAPI Extension (Step 2)
After selecting the SPRemoteAPI command you will be presented with all the available types in the SharePoint Office 365 remote API. You can start typing and the list will automatically filter as you type. The example below shows typing “move” and the list is filtered down to types with the word move contained in them. This list shows a github icon (flame) next to types that are new in SharePoint 2016. It also lists whether the type can be used in REST or JavaScript. Some types are not available for both.

![Alt Text](https://c2.staticflickr.com/8/7117/27433483154_a2c1cae464_b.jpg)

### Using SPRemoteAPI Extension (Step 3)
Once you have selected the type, you are presented an information dialog showing you the type along with options for displaying properties and methods or creating a TypeScript interface. The options also shows you the number of each contained in the type. 
![Alt Text](https://c2.staticflickr.com/8/7334/28047195335_1eaf28fdd8_b.jpg)

### Using SPRemoteAPI Extension (Step 4)
Select the methods options and you are presented a list of available methods to choose.
![Alt Text](https://c2.staticflickr.com/8/7390/28047195515_d8e37fb564_o.png)

### Using SPRemoteAPI Extension (Step 5)
Choose a method and then you are presented a new code window (virtual document) containing a JSON representation of all the method’s information needed to call it remotely using REST. It shows you the parameter types, required post body and response body. The post body can be copied into whatever REST calling framework you are using such as FETCH or JQuery. The response can be used to guide you in what to expect in the payload response from the call. This gives you ability to write remote REST calls without having to do all the extra experimentation to see what the call returns. Having both the body and response JSON templates will save you a lot of time searching on the internet.
![Alt Text](https://c2.staticflickr.com/8/7336/27969723211_275dfeb3a5_b.jpg)

### What about properties?
Below is example of the code window you are given when you select properties. It shows you all the available properties for the type and the information you need to determine what is available remotely from SharePoint Office 365.
![Alt Text](https://c2.staticflickr.com/8/7436/27969745441_2a79474539_b.jpg)

### SPRemoteAPI in action
![Alt Text](https://c2.staticflickr.com/8/7458/27907653992_724924a479_o.gif)

### Supports SharePoint 2013
This also supports SharePoint 2013, just add the following to your user settings:
![Alt Text](https://c2.staticflickr.com/8/7535/27458815184_30d13313c6_o.png)


**Enjoy!**
