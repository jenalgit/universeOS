//        This file is published by transparency - everywhere with the best deeds.
//        Check transparency - everywhere.com for further information.
//        Licensed under the CC License, Version 4.0 (the "License");
//        you may not use this file except in compliance with the License.
//        You may obtain a copy of the License at
//        
//        https://creativecommons.org/licenses/by/4.0/legalcode
//        
//        Unless required by applicable law or agreed to in writing, software
//        distributed under the License is distributed on an "AS IS" BASIS,
//        WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//        See the License for the specific language governing permissions and
//        limitations under the License.
//        @author nicZem for transparency-everywhere.com
//        @author pabst for transparency-everywhere.com
        

var elements = new function(){
    this.open = function(element, tabId){
        var elementData = this.getData(element);
        userHistory.push('element', element);
        applications.show('filesystem');
        if(typeof tabId === 'undefined')
            tabId = filesystem.tabs.addTab(elementData['title'], '', '');
        filesystem.tabs.updateTabContent(tabId, this.generate(element, tabId));
        
        //hide size and date in showElement
        var showElementWidth = document.getElementById("showElement").offsetWidth;
        if(showElementWidth < 700){
            $('#filesystem .frameRight span.size').hide();
        }
        if(showElementWidth < 850){
            $('#filesystem .frameRight span.date').hide();
        }        
    };
    this.generate = function(element, tabId){
        
        var elementData = this.getData(element);
        var elementAuthorData = this.getAuthorData(elementData['author']);
        var header = "<header class=\"white-header\">";
            header += filesystem.generateIcon('element', 'grey');
            header += "<span class=\"elementtitle\">" + gui.shorten(elementData['title'], 25) + "</span>";
            header += '<span class="headerbuttons">'; 
                header += filesystem.generateIcon('list', 'grey', 'greyList', 'listView()');
                header += filesystem.generateIcon('list', 'blue', 'blueList');
                header += filesystem.generateIcon('small_symbols', 'grey', 'greySmall', 'smallSymbols()');
                header += filesystem.generateIcon('small_symbols', 'blue', 'blueSmall');
                header += filesystem.generateIcon('large_symbols', 'grey', 'greyLarge', 'largeSymbols()');
                header += filesystem.generateIcon('large_symbols', 'blue', 'blueLarge');
//                header += '<span>|</span> ';
                header += '<div class="scoreButtonWhiteGradient">' + item.showScoreButton('element', element) + '</div>';
                header += '<a href=\"#\" id=\"settingsButton\" onclick=\"$(\'.elementSettings' + element + '\').slideToggle(\'slow\'); return false\" title=\"more...\">' + filesystem.generateIcon('settings', 'grey') + '</a>';  
            header += '</span>';
            header += '<div class="elementSettings dropdown"><ul class="elementSettings elementSettings' + element + '">';	
            
                header += '<li onclick="filesystem.openShareModal(\'collection\', ' + element + ')">' + filesystem.generateIcon('share', 'white') + '<span class="text">Share Collection</span></li>';
                header += '<li onclick="filesystem.showCreateUFFForm(\'' + element + '\'); ">' + filesystem.generateIcon('file', 'white') + '<span class="text">Create an UFF</span></li>';
                header += '<li onclick="window.links.showCreateLinkForm(\'' + element + '\');">' + filesystem.generateIcon('link', 'white') + '<span class="text">Add a link</span></li>';		  			
                header += '<li onclick="filesystem.openUploadTab(\'' + element + '\', \'' + tabId + '\');">' + filesystem.generateIcon('file', 'white') + '<span class="text">Upload files</span></li>';
            header += '</ul></div>';
        header += "</header>";
        var html = filesystem.generateLeftNav();
        html += '<div id="showElement" class="frameRight">';
        html += header;
        html += this.showFileList(element);
        return html;
        
    };
    
    this.showFileList = function(element_id, grid){
        if(typeof grid === 'undefined'){
            grid = false; //if grid=true itemsettings and rightclickmenu will be disabled
        }
        var fileList = this.getFileList(element_id);
        var i = 0;
        var html = "";
        var link = "";
        var elementIds = [];
        var elementTypes = [];
        var rightLink = "";
        var image = "";
        var date = "";
        var type = "";
        var handlerType;
        html += '<div id="attributes">';
        html += '<span class="icons">&nbsp;</span>';
        html += '<span class="title">| Name</span>';
        html += '<span class="buttons">| Settings</span>';
        html += '<span class="size">| Size</span>';
        html += '<span class="date">| Date</span>';
        html += '</div>';
        html += '<ul>';
        html += '<span class="heading">Files</span>';
        var f = 0; // count files
        $.each(fileList,function(index, value){
            elementIds.push(value['data']['id']);
            elementTypes.push(value['type']);
        });
        if(fileList.length !== 0){
            var scoreButtons = item.showScoreButton(elementTypes, elementIds);
            var settingButtons = item.showItemSettings(elementTypes, elementIds);
        }
        $.each(fileList, function(key, value){
            if(value['type'] === 'file' && value['data']['type'] !== 'image' && value['data']['type'] !== 'image/jpeg' && value['data']['type'] !== 'image/png' && value['data']['type'] !== 'image/gif' && value['data']['type'] !== 'image/tiff') {
                //generate fileList for an element with an unordered list <ul>
                var data = value['data'];
                i++;
                f++;
                if(value['type'] === 'file'){
                    handlerType = 'handlers.files.handler('+data['id']+');';
                }
                date = new Date(data['timestamp']*1000).toString().substr(11, 5) + new Date(data['timestamp']*1000).toString().substr(4, 4) + new Date(data['timestamp']*1000).toString().substr(8, 2); //year + month + day
                image = filesystem.generateIcon(data['type'], 'grey');
                html += '<li data-id="' + data['id'] + '" data-type="' + data['type'] + '" data-title="' + data['title'] + '" data-date="' + date + '" data-size="' + data['size'] + '">';
                    html += '<span class="icons"><a onclick="'+handlerType+' return false">' + image + '</a></span>';
                    html += '<span class="title"><a onclick="'+handlerType+' return false">' + gui.shorten(data['title'], 40) + '</a></span>';
                    html += '<span class="buttons">';
                        html += scoreButtons[key];
                        if(data['download']){
                            html += '<a href="./out/download/?fileId=' + data['id'] + '" target="submitter" class="btn btn-mini" title="download file">' + filesystem.generateIcon('download', 'grey') + '</a>';
                        }
                        if(!grid){
                            html += settingButtons[key];
                        }
                    html += '</span>';
                    var size = Math.round(data['size']/1024);
                    if(size <= 1000)
                        size = size + ' kB';
                    if(size >= 1000 && size < 1000000)
                        size = Math.round(size/1024) + ' MB';
                    if(size >= 1000000)
                        size = Math.round(size/1024/1024*100)/100 + ' GB';
                    html += '<span class="size">' + size + '</span>';
                    html += '<span class="date">' + date + '</span>';
                html += '</li>';
                if(!grid){
                    html += '';  //option for rightClick
                }
            }
        });
        if (f === 0) {
            html += '<span class="emptyFileList">No files uploaded. Click on the settings button above to upload or add them.</span>';
        }
        html += '<span class="heading">Images</span>';
        var f = 0;
        $.each(fileList, function(key, value){
            if(value['type'] === 'file' && (value['data']['type'] === 'image' || value['data']['type'] === 'image/jpeg' || value['data']['type'] === 'image/png' || value['data']['type'] === 'image/gif' || value['data']['type'] === 'image/tiff')) {
                //generate fileList for an element with an unordered list <ul>
                var data = value['data'];
                i++;
                f++;
                if(value['type'] === 'file'){
                    handlerType = 'handlers.files.handler('+data['id']+');';
                }
                date = new Date(data['timestamp']*1000).toString().substr(11, 5) + new Date(data['timestamp']*1000).toString().substr(4, 4) + new Date(data['timestamp']*1000).toString().substr(8, 2); //year + month + day
                image = filesystem.generateIcon(data['type'], 'grey');
                html += '<li data-id="' + data['id'] + '" data-type="' + data['type'] + '" data-title="' + data['title'] + '" data-date="' + date + '" data-size="' + data['size'] + '">';
                    html += '<span class="icons"><a onclick="'+handlerType+' return false">' + image + '</a></span>';
                    html += '<span class="title"><a onclick="'+handlerType+' return false">' + gui.shorten(data['title'], 40) + '</a></span>';
                    html += '<span class="buttons">'
                        html += scoreButtons[key];
                        if(data['download']){
                            html += '<a href="./out/download/?fileId=' + data['id'] + '" target="submitter" class="btn btn-mini" title="download file">' + filesystem.generateIcon('download', 'grey') + '</a>';
                        }
                        if(!grid){
                            html += settingButtons[key];
                        }
                    html += '</span>';
                    var size = Math.round(data['size']/1024);
                    if(size <= 1000)
                        size = size + ' kB';
                    if(size >= 1000 && size < 1000000)
                        size = Math.round(size/1024) + ' MB';
                    if(size >= 1000000)
                        size = Math.round(size/1024/1024*100)/100 + ' GB';
                    html += '<span class="size">' + size + '</span>';
                    html += '<span class="date">' + date + '</span>';
                html += '</li>';
                if(!grid){
                    html += '';  //option for rightClick
                }
            }
        });
        if (f === 0) {
            html += '<span class="emptyFileList">No images uploaded. Click on the settings button above to upload them.</span>';
        }
        html += '<span class="heading">Links</span>';
        var f = 0;
        $.each(fileList, function(key, value){
            if(value['type'] === 'link') {
                //generate fileList for an element with an unordered list <ul>
                var data = value['data'];
                i++;
                f++;
                if(value['type'] === 'link'){
                    handlerType = 'handlers.links.handler('+data['id']+');';
                }
                date = new Date(data['timestamp']*1000).toString().substr(11, 5) + new Date(data['timestamp']*1000).toString().substr(4, 4) + new Date(data['timestamp']*1000).toString().substr(8, 2); //year + month + day
                image = filesystem.generateIcon(data['type'], 'grey');
                html += '<li data-id="' + data['id'] + '" data-type="' + data['type'] + '" data-title="' + data['title'] + '" data-date="' + date + '" data-size="' + data['size'] + '">';
                    html += '<span class="icons"><a onclick="'+handlerType+' return false">' + image + '</a></span>';
                    html += '<span class="title"><a onclick="'+handlerType+' return false">' + gui.shorten(data['title'], 40) + '</a></span>';
                    html += '<span class="buttons">'
                        html += scoreButtons[key];
                        if(data['download']){
                            html += '<a href="./out/download/?fileId=' + data['id'] + '" target="submitter" class="btn btn-mini" title="download file">' + filesystem.generateIcon('download', 'grey') + '</a>';
                        }
                        if(!grid){
                            html += settingButtons[key];
                        }
                    html += '</span>';
                    var size = Math.round(data['size']/1024);
                    if(size <= 1000)
                        size = size + ' kB';
                    if(size >= 1000 && size < 1000000)
                        size = Math.round(size/1024) + ' MB';
                    if(size >= 1000000)
                        size = Math.round(size/1024/1024*100)/100 + ' GB';
                    html += '<span class="size">' + size + '</span>';
                    html += '<span class="date">' + date + '</span>';
                html += '</li>';
                if(!grid){
                    html += ''; //option for rightClick
                }
            }
        });
        if (f === 0) {
            html += '<span class="emptyFileList">No links added. Click on the settings button above to add them.</span>';
        }
        html += '</ul>';
        if(i === 0){
            html = '<ul><li>';
                html += '<span>';
                    html += '<span class="emptyFileList">This Collection is empty. Click on the settings button above to upload or add cool stuff.<span class="emptyFileList">';
                html += '</span>';
            html += '</li></ul>';
        }
        return html;
    };
    
    this.getFileList = function(element_id){
        return api.query('api/elements/getFileList/',{element_id : element_id});
    };
    
    this.getData = function(element_id){
        
        if(typeof element_id === 'object'){
            var requests = [];
            $.each(element_id,function(index, value){
                //you can also enter a single type instead of multiple values
                requests.push({element_id : value});
            });
                return api.query('api/elements/select/', { request: requests});
        }else
            return api.query('api/elements/select/',{request: [{element_id : element_id}]})[0];
        
    };
    
    this.getTitle = function(element_id){
        var elementData = this.getData(element_id);
        if(typeof element_id === 'object'){
            var results = [];
            $.each(elementData, function(index, value){
                results.push(value['title']);
            });
            return results;
        }
        return elementData['title'];
    };
    
    this.getAuthorData = function(user_id){
        return api.query('api/elements/getAuthorData/',{user_id : user_id});
    };
    
    this.getFileNumbers = function(element_id){
        return api.query('api/elements/getFileNumbers/',{element_id : element_id});
    };
    
    this.create = function(folder, title,  type, privacy, callback){
        var result="";
	$.ajax({
            url:"api/elements/create/",
            async: false,  
            type: "POST",
            data: $.param({folder : folder, title: title.replace(/[^a-zA-Z0-9 _-]/g,''), type: type})+'&'+privacy,
            success:function(data) {
               result = data;
               if(typeof callback === 'function'){
                   callback(); //execute callback if var callback is function
               }
            }
	});
	return result;
    };
    this.showCreateElementForm = function(parent_folder){
        var formModal = new gui.modal();
        
        var fieldArray = [];
        var options = [];
        options['headline'] = '';
        options['buttonTitle'] = 'Save';
        options['noButtons'] = true;
        
        var field0 = [];
        field0['caption'] = 'Title';
        field0['required'] = true;
        field0['inputName'] = 'title';
        field0['type'] = 'text';
        fieldArray[0] = field0;
        
        var captions = ['document', 'link', 'audio', 'video', 'image', 'execute', 'other'];
        var type_ids = ['document', 'link', 'audio', 'video', 'image', 'execute', 'other'];
        
        var field1 = [];
        field1['caption'] = 'Type';
        field1['inputName'] = 'type';
        field1['values'] = type_ids;
        field1['captions'] = captions;
        field1['type'] = 'dropdown';
        fieldArray[1] = field1;
        
        var field2 = [];
        field2['caption'] = '';
        field2['inputName'] = 'privacy';
        field2['type'] = 'privacy';
        fieldArray[2] = field2;
        
        
        
        var modalOptions = {};
        modalOptions['buttonTitle'] = 'Create Collection';
        
        modalOptions['action'] = function(){
            var callback = function(){
                gui.alert('The Collection has been added');
                $('.blueModal').remove();
                filesystem.tabs.updateTabContent(1 , filesystem.generateFullFileBrowser(parent_folder));
            };
            elements.create(parent_folder, $('#createElementFormContainer #title').val(), $('#createElementFormContainer #type').val(),  $('#createElementFormContainer #privacyField :input').serialize(),callback);
        };
        formModal.init('Create Collection', '<div id="createElementFormContainer"></div>', modalOptions);
        gui.createForm('#createElementFormContainer',fieldArray, options);
    };
    
    this.update = function(element_id, folder, title, type, privacy, callback){
        var result="";
	$.ajax({
            url:"api/elements/update/",
            async: false,  
            type: "POST",
            data: $.param({element_id:element_id,folder : folder, title: title.replace(/[^a-zA-Z0-9 _-]/g,''), type: type})+'&'+privacy,
            success:function(data) {
               result = data;
               if(typeof callback === 'function'){
                   callback(); //execute callback if var callback is function
               }
            }
	});
	return result;
    }
    
    this.showUpdateElementForm = function(element){
        var formModal = new gui.modal();
        var elementData = elements.getData(element);
        
        var fieldArray = [];
        var options = [];
        options['headline'] = '';
        options['buttonTitle'] = 'Save';
        options['noButtons'] = true;
        
        var field0 = [];
        field0['caption'] = 'Title';
        field0['required'] = true;
        field0['inputName'] = 'title';
        field0['type'] = 'text';
        field0['value'] = elementData['title'];
        fieldArray[0] = field0;
        
        var captions = ['document', 'link', 'audio', 'video', 'image', 'execute', 'other'];
        var type_ids = ['document', 'link', 'audio', 'video', 'image', 'execute', 'other'];
        
        var field1 = [];
        field1['caption'] = 'Type';
        field1['inputName'] = 'type';
        field1['values'] = type_ids;
        field1['captions'] = captions;
        field1['type'] = 'dropdown';
        field1['preselected'] = elementData['type'];
        fieldArray[1] = field1;
        
        var field2 = [];
        field2['caption'] = '';
        field2['inputName'] = 'privacy';
        field2['type'] = 'privacy';
        field2['value'] = elementData['privacy'];
        fieldArray[2] = field2;
        
        
        
        var modalOptions = {};
        modalOptions['buttonTitle'] = 'Update Collection';
        
        modalOptions['action'] = function(){
            var callback = function(){
                gui.alert('The collection has been updated');
                $('.blueModal').remove();
                filesystem.tabs.updateTabContent(1 , filesystem.generateFullFileBrowser(elementData.folder));
            };
            elements.update(element, elementData['folder'], $('#createElementFormContainer #title').val(), $('#createElementFormContainer #type').val(),  $('#createElementFormContainer #privacyField :input').serialize(),callback);
        };
        formModal.init('Update Collection', '<div id="createElementFormContainer"></div>', modalOptions);
        gui.createForm('#createElementFormContainer',fieldArray, options);
    };
    
    this.delete = function(elementId, callback){
        var result="";
	$.ajax({
            url:"api/elements/delete/",
            async: false,  
            type: "POST",
            data: {element_id : elementId},
            success:function(data) {
               result = data;
               if(typeof callback === 'function'){
                   callback(); //execute callback if var callback is function
               }
            }
	});
	return result;
    };
    
    this.verifyRemoval = function(elementId){
        var confirmParameters = {};
        var elementData = elements.getData(elementId);
        confirmParameters['title'] = 'Delete Element';
        confirmParameters['text'] = 'Are you sure to delete this element?';
        confirmParameters['submitButtonTitle'] = 'Delete';
        confirmParameters['submitFunction'] = function(){
            elements.delete(elementId);
            gui.alert('The collection has been deleted');
            filesystem.tabs.updateTabContent(1 , filesystem.generateFullFileBrowser(elementData.folder));
            
        };
        confirmParameters['cancelButtonTitle'] = 'Cancel';
        confirmParameters['cancelFunction'] = function(){
            //alert('cancel');
        };
        
        gui.confirm(confirmParameters);
        
    };
    
    this.elementIdToElementTitle = function(elementId){
            return elements.getData(elementId)['title'];
    };
              	
};
