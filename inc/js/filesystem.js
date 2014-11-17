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
//        @author nicZem for Tranpanrency - everywhere.com
        


var filesystem =  new function() {
    this.init = function(){
        
        this.applicationVar = new application('filesystem');
        this.applicationVar.create('Filesystem', 'url', 'modules/filesystem/filesystem.php',{width: 6, height:  5, top: 0, left: 3});
			  			
        
	this.tabs = new tabs('#fileBrowserFrame');
        this.tabs.init();
	this.tabs.addTab('universe', '',gui.loadPage('modules/filesystem/fileBrowser.php'));
			  	
    };
    this.openShareModal = function(type, typeId){
              		
              		var title;
              		var content;
              		var kickstarterURL;
              		var embedURL;
              		switch(type){
              			case 'file':
              				var fileTitle = files.fileIdToFileTitle(typeId);
              				title = 'Share "'+fileTitle+'"';
              				kickstarterURL = sourceURL+'/out/kickstarter/files/?id='+typeId;
              				embedURL = sourceURL+'/out/?file='+typeId; //should be the same like fileBrowserURL 
              			break;
              			case 'element':
              				var elementTitle = elements.elementIdToElementTitle(typeId);
              				title = 'Share "'+elementTitle+'"';
              				kickstarterURL = sourceURL+'/out/kickstarter/elements/?id='+typeId;
              				embedURL = sourceURL+'/out/?element='+typeId; //should be the same like fileBrowserURL 
              			break;
              		}
              		
              		var facebook = 'window.open(\'http://www.facebook.com/sharer/sharer.php?u='+kickstarterURL+'&t='+fileTitle+'\', \'facebook_share\', \'height=320, width=640, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no\');';
              		var twitter = 'window.open(\'http://www.twitter.com/share?url='+kickstarterURL+'\', \'twitter_share\', \'height=320, width=640, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no\');';
					var googleplus = "window.open('https://plus.google.com/share?url="+kickstarterURL+"','', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;";
              		
              		content = '<ul class="shareList">';
	              		content += '<li onclick="$(\'.shareBox li\').hide(); $(\'.shareBox #facebook\').slideDown(); $(\'.shareList li\').removeClass(\'active\'); $(this).addClass(\'active\');">Facebook <img src="gfx/startPage/facebook.png"></li>';
	              		content += '<li onclick="$(\'.shareBox li\').hide(); $(\'.shareBox #twitter\').slideDown(); $(\'.shareList li\').removeClass(\'active\'); $(this).addClass(\'active\');">Twitter <img src="gfx/startPage/twitter.png"></li>';
	              		content += '<li onclick="$(\'.shareBox li\').hide(); $(\'.shareBox #googleplus\').slideDown(); $(\'.shareList li\').removeClass(\'active\'); $(this).addClass(\'active\');">Google+ <img src="gfx/startPage/googleplus.png"></li>';
	              		content += '<li onclick="$(\'.shareBox li\').hide(); $(\'.shareBox #embed\').slideDown(); $(\'.shareList li\').removeClass(\'active\'); $(this).addClass(\'active\');">Embed Code <img src="gfx/startPage/wikipedia.png"></li>';
	              		content += '<li onclick="$(\'.shareBox li\').hide(); $(\'.shareBox #url\').slideDown(); $(\'.shareList li\').removeClass(\'active\'); $(this).addClass(\'active\');">URL <img src="gfx/startPage/wikipedia.png"></li>';
              		content += '</ul>';
              		
              		content += '<ul class="shareBox">';
              			content += '<li id="facebook"><center><a target="_blank" href="#" onclick="'+facebook+'" class="btn btn-success"><img src="gfx/startPage/facebook.png" height="20"> Click Here To Share</a></center></li>';
              			content += '<li id="url"><center><textarea>'+kickstarterURL+'</textarea></center>Just place the HTML code for your Filebrowser wherever<br> you want the Browser to appear on your site.</li>';
              			content += '<li id="embed"><center><textarea><iframe src="'+embedURL+'"></iframe></textarea></center>Just place the HTML code for your Filebrowser wherever<br> you want the Browser to appear on your site.</li>';
              			content += '<li id="googleplus"><center><a href="#" onclick="'+googleplus+'" class="btn btn-success"><img src="gfx/startPage/googleplus.png" height="20"> Click Here To Share</a></center></li>';
              			content += '<li id="twitter"><center><a href="#" onclick="'+twitter+'" class="btn btn-success"><img src="gfx/startPage/twitter.png" height="20"> Click Here To Share</a></center></li>';
              		content += '</ul>';
              		
              		
              		modal.create(title, content);
              	};
    this.openFolder = function(folderId){
        this.tabs.updateTabContent(1, gui.loadPage('modules/filesystem/fileBrowser.php?reload=1&folder='+folderId));
    };
    
    this.createLink = function(element, title,  type, privacy, link, callback){
        var result="";
	$.ajax({
            url:"api/links/create/",
            async: false,  
            type: "POST",
            data: $.param({folder : element, title: title, type: type, link:link})+'&'+privacy,
            success:function(data) {
               result = data;
               if(typeof callback === 'function'){
                   callback(); //execute callback if var callback is function
               }
            }
	});
	return result;
    };
    this.showCreateLinkForm = function(element){
        var formModal = new gui.modal();
        
        var fieldArray = [];
        var options = [];
        options['headline'] = '';
        options['buttonTitle'] = 'Save';
        options['noButtons'] = true;
        
        var field0 = [];
        field0['caption'] = 'Link';
        field0['inputName'] = 'link';
        field0['type'] = 'text';
        field0['onChange'] = function(){
          var value = $('#link').val();
          //check if type is youtube
          if(isYoutubeURL(value)){
              //set type -> youtube
          }
          
        };
        fieldArray[0] = field0;
        
        var field1 = [];
        field1['caption'] = 'Title';
        field1['inputName'] = 'title';
        field1['type'] = 'text';
        fieldArray[1] = field1;
        
        var captions = ['Standard Link', 'RSS', 'Youtube', 'Soundcloud', 'File', 'Other'];
        var type_ids = ['link', 'RSS', 'youTube', 'soundcloud', 'file', 'other'];
        
        var field2 = [];
        field2['caption'] = 'Type';
        field2['inputName'] = 'type';
        field2['values'] = type_ids;
        field2['captions'] = captions;
        field2['type'] = 'dropdown';
        fieldArray[2] = field2;
        
        var field3 = [];
        field3['caption'] = 'Privacy';
        field3['inputName'] = 'privacy';
        field3['type'] = 'html';
        field3['value'] = "<div id=\'privacyField\'></div>";
        fieldArray[3] = field3;
        
        
        
        var modalOptions = {};
        modalOptions['buttonTitle'] = 'Add Link To Element';
        
        modalOptions['action'] = function(){
            var callback = function(){
                jsAlert('', 'The links has been added');
                $('.blueModal').remove();
                filesystem.tabs.updateTabContent(1 , gui.loadPage('modules/filesystem/fileBrowser.php?folder='+parent_folder));
            };
            filesystem.createElement(parent_folder, $('#createLinkFormContainer #title').val(), $('#createLinkFormContainer #type').val(),  $('#createLinkFormContainer #privacyField :input').serialize(),callback);
        };
        privacy.load('#privacyField', '', true);
        formModal.init('Add Link To Element', '<div id="createLinkFormContainer"></div>', modalOptions);
        gui.createForm('#createLinkFormContainer',fieldArray, options);
    };
    this.createElement = function(folder, title,  type, privacy, callback){
        var result="";
	$.ajax({
            url:"api/elements/create/",
            async: false,  
            type: "POST",
            data: $.param({folder : folder, title: title, type: type})+'&'+privacy,
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
        field2['caption'] = 'Privacy';
        field2['inputName'] = 'privacy';
        field2['type'] = 'html';
        field2['value'] = "<div id=\'privacyField\'></div>";
        fieldArray[2] = field2;
        
        
        
        var modalOptions = {};
        modalOptions['buttonTitle'] = 'Create Element';
        
        modalOptions['action'] = function(){
            var callback = function(){
                jsAlert('', 'The element has been added');
                $('.blueModal').remove();
                filesystem.tabs.updateTabContent(1 , gui.loadPage('modules/filesystem/fileBrowser.php?folder='+parent_folder));
            };
            filesystem.createElement(parent_folder, $('#createElementFormContainer #title').val(), $('#createElementFormContainer #type').val(),  $('#createElementFormContainer #privacyField :input').serialize(),callback);
        };
        privacy.load('#privacyField', '', true);
        formModal.init('Create Element', '<div id="createElementFormContainer"></div>', modalOptions);
        gui.createForm('#createElementFormContainer',fieldArray, options);
    };
    this.createFolder = function(parent_folder, name, privacy, callback){
        var result="";
	$.ajax({
            url:"api/folders/create/",
            async: false,  
            type: "POST",
            data: $.param({folder : parent_folder, name: name})+'&'+privacy,
            success:function(data) {
               result = data;
               if(typeof callback === 'function'){
                   callback(); //execute callback if var callback is function
               }
            }
	});
	return result;
    };
    this.showCreateFolderForm = function(parent_folder){
        var formModal = new gui.modal();
        
        var fieldArray = [];
        var options = [];
        options['headline'] = '';
        options['buttonTitle'] = 'Save';
        options['noButtons'] = true;
        
        var field0 = [];
        field0['caption'] = 'Title';
        field0['inputName'] = 'title';
        field0['type'] = 'text';
        fieldArray[0] = field0;
        
        var field1 = [];
        field1['caption'] = 'Privacy';
        field1['inputName'] = 'privacy';
        field1['type'] = 'html';
        field1['value'] = "<div id=\'privacyField\'></div>";
        fieldArray[1] = field1;
        
        
        var modalOptions = {};
        modalOptions['buttonTitle'] = 'Create Folder';
        
        modalOptions['action'] = function(){
            var callback = function(){
                jsAlert('', 'The folder has been added');
                $('.blueModal').remove();
                filesystem.tabs.updateTabContent(1 , gui.loadPage('modules/filesystem/fileBrowser.php?folder='+parent_folder));
            };
            filesystem.createFolder(parent_folder, $('#createElementFormContainer #title').val(), $('#createElementFormContainer #privacyField :input').serialize(),callback);
        };
        privacy.load('#privacyField', '', true);
        formModal.init('Create Element', '<div id="createElementFormContainer"></div>', modalOptions);
        gui.createForm('#createElementFormContainer',fieldArray, options);
    };
};

