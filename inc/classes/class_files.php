<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of newPHPClass
 *
 * @author niczem
 */
class files {
    public $id;
    
    function __construct($id=NULL){
        if($id != NULL){
            $this->id = $id;
        }
    }
    //uploads temporary file which is validated with files->validateTempFile()
    function uploadTempfile($file, $element, $folder, $privacy, $user, $lang=NULL, $download=true){
	 	//upload file
                $target_path = basename( $file['tmp_name']);
                $filename = $file['name'];
                
                if($filename == '.htaccess'){
                    return false;
                }
                $thumbname = "$filename.thumb";
                $size = $file['size'];
                $time = time();
                $classFiles = new files();
                $type = $classFiles->getMime($file['name']);

                $dbClass = new db();
                
                $FileElementData = $dbClass->select('elements', array('id', $element), array('title', 'folder'));
		
		if(empty($folder)){
			$folder = $FileElementData['folder'];
		}
		
                //folderdata might be unesseccary
                $fileFolderData = $dbClass->select('folders', array('id', $FileElementData['folder']));
                
                
                $folderClass = new folder($folder);
                $folderpath = $folderClass->getPath();
			
			
                $thumbPath = universeBasePath.'/'.$folderpath."thumbs/";
                $imgName = basename($FileElementData['title']."_".$file['name']);
                $elementName = rawurlencode($FileElementData['title'].'_');
                
                //sanitize text to avoid xss via filenames
                $finalName = sanitizeText($FileElementData['title']."_".$file['name']);


                //move uploaded file to choosen folder and add .temp 
                if(move_uploaded_file($file['tmp_name'], universeBasePath.'/'.$folderpath.$file['name'])){
                    rename(universeBasePath.'/'.$folderpath.$file['name'], universeBasePath.'/'.$folderpath.$finalName);
		
                    //if type is image => create thumbnail before .temp suffix is added
                    if($type == "image/jpg" || $type == "image/jpeg" || $type == "image/png"){
                                $thumbPath= "$thumbPath";
                                $path = "$folderpath";
                                $imageClass = new image();
                                if(is_dir($thumbPath)){
                                    $imageClass->mkthumb($finalName, 600, 600, universeBasePath.'/'.$folderpath, $thumbPath);
                                }else{
                                    $oldmask = umask(0);
                                    mkdir($thumbPath,0755);
                                    umask($oldmask);
                                    $imageClass->mkthumb($finalName, 600, 600, universeBasePath.'/'.$folderpath, $thumbPath);
                                }
                    }

                    rename(universeBasePath.'/'.$folderpath.$finalName, universeBasePath.'/'.$folderpath.$finalName.".temp");
                            //add db entry and add temp value
                            $fileValues['folder'] = $element;
                            $fileValues['title'] = $imgName;
                            $fileValues['size'] = $size;
                            $fileValues['timestamp'] = $time;
                            $fileValues['filename'] = $imgName;
                            $fileValues['language'] = $lang;
                            $fileValues['type'] = $type;
                            $fileValues['owner'] = $user;
                            $fileValues['votes'] = '';
                            $fileValues['temp'] = 1;
                            $fileValues['score'] = '';
                            $fileValues['privacy'] = $privacy;
                            $fileValues['var1'] = '';
                            $fileValues['download'] = $download;
                            $fileValues['status'] = true;
                            $db = new db();
                            $insertid = $db->insert('files', $fileValues);

                    if($insertid){
                            return $insertid;
                    }else{
                            return false;
                    }
                }else{
                    echo 'the file hasn\'t been uploaded';
                }
                
	 }
         
    function addFile($file, $element, $folder, $privacy, $user, $lang=NULL, $download=true, $addFeed=true){
        $user_id = $user;
        
        //upload file
        $target_path = basename( $file['tmp_name']);
        $filename = $file['name'];
        $thumbname = "$filename.thumb";
        $size = $file['size'];
        $time = time();
        
        $classFiles = new files();
        $type = $classFiles->getMime($filename);
        $dbClass = new db();
        $fileFolderData = $dbClass->select('folders', array('id', $folder));
        
        
        //if element == userpictureelement, userpictureupload and thumb creation
        $additionalPath = '';
        if(!empty($user_id)){
            
            $user = new user($user_id);
            $userData  = $user->getData();
            $element = $userData['profilepictureelement'];
            if($userData['profilepictureelement'] === $element){
                $additionalPath = 'userPictures';
            }
        }
        
        $FileElementData = $dbClass->select('elements', array('id', $element), array('title'));
        $folderClass = new folder($folder);
        $folderpath = universeBasePath.'/'.$folderClass->getPath();

        $imgName = basename($file['name']);
        $elementName = $FileElementData['title'].'_';
        $imgName = $elementName.$imgName;

        move_uploaded_file($file['tmp_name'], $folderpath.$file['name']);
        rename($folderpath.$filename, $folderpath.$imgName);
        
        if($type == "image/jpg" || $type == "image/jpeg" || $type == "image/png"){
            
            
        $thumbPath = $folderpath."thumbs";
            
            $imageClass = new image();
            //extra case for userpictures
            if($additionalPath == 'userPictures'){
                       $imageClass -> mkthumb($imgName,1024,1024,$folderpath,$folderpath);
                       $imageClass -> mkthumb($imgName,25,25,$folderpath,$folderpath.'/thumb/25');
                       $imageClass -> mkthumb($imgName,40,40,$folderpath,$folderpath.'/thumb/40');
                       $imageClass -> mkthumb($imgName,300,300,$folderpath,$folderpath.'/thumb/300');
            }
            $thumbPath= $thumbPath;
            if(!is_dir($thumbPath)){
                        mkdir($thumbPath,0755);
            }
            $imageClass -> mkthumb($imgName,600,600,$folderpath,$thumbPath);
        }
        
        //add db entry and add temp value
        $fileValues['folder'] = $element;
        $fileValues['title'] = $imgName;
        $fileValues['size'] = $size;
        $fileValues['timestamp'] = $time;
        $fileValues['filename'] = $imgName;
        $fileValues['language'] = $lang;
        $fileValues['type'] = $type;
        $fileValues['owner'] = $user_id;
        $fileValues['votes'] = '';
        $fileValues['score'] = '';
        $fileValues['privacy'] = $privacy;
        $fileValues['var1'] = '';
        $fileValues['download'] = $download;
        $fileValues['status'] = true;
        
                        
        $fileId = $this->insertRecordDB($fileValues);
        
        if($fileId){
        	
            jsAlert("The file has been uploaded :)");
        }else{
        	jsAlert("Opps, something went wrong.");
        }
        
        
        echo '<script>';?>
                filesystem.tabs.updateTabContent('<?=substr($FileElementData['title'], 0, 10);?>' ,gui.loadPage('modules/filesystem/showElement.php?element=<?=$element;?>&reload=1'));
        <?php
        echo '</script>';
        
        //add feed entry
        if($addFeed){
            $feed = "has uploaded a file";
            $feedClass = new feed();
            $feedClass->create($user_id, $feed, "", "showThumb", $privacy, "file", $fileId);
        }
        return $fileId;
    }
    
    
    
    function createFile($element, $title, $filename, $fileValue=NULL, $privacy=NULL){
        
        $type = $this->getMime($filename);
        $filename = sanitize_file_name(sanitizeText($filename));
        
        $user = getUser();
        
        $elementClass = new element($element);
        $path = $elementClass->getPath();
        $myfile = fopen(universeBasePath.'/'.$path.'/'.$filename, "w");
        fwrite($myfile, $fileValue);
        fclose($myfile);

        
        
        //add db entry and add temp value
        $fileValues['folder'] = $element;
        $fileValues['title'] = $title;
        $fileValues['size'] = 0;
        $fileValues['timestamp'] = time();
        $fileValues['filename'] = $filename;
        $fileValues['type'] = $type;
        $fileValues['owner'] = $user;
        $fileValues['privacy'] = $privacy;
        
                        
        return $this->insertRecordDB($fileValues);
    }
    
    function updateFileContent($file_id, $content){
        $myfile = fopen(universeBasePath.'/'.$this->getPath($file_id), "w");
        fwrite($myfile, $content);
        fclose($myfile);
    }
    
    function insertRecordDB($values){
        $dbClass = new db();
        return $dbClass->insert('files', $values);
    }
    
    function getPath($fileId){
       $file = new file($fileId);
               return $file->getPath();
    }
    
    
    function getMime($filename) {
    	//when we use the finfo class to much erros - safer way
    	//http://php.net/manual/de/function.mime-content-type.php - thx to svogal

        $mime_types = array(

            'txt' => 'text/plain',
            'htm' => 'text/html',
            'html' => 'text/html',
            'php' => 'text/php',
            'css' => 'text/css',
            'csv' => 'text/csv',
            'js' => 'application/javascript',
            'json' => 'application/json',
            'xml' => 'application/xml',
            'swf' => 'application/x-shockwave-flash',
            'flv' => 'video/x-flv',

            // images
            'png' => 'image/png',
            'jpe' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'jpg' => 'image/jpeg',
            'gif' => 'image/gif',
            'bmp' => 'image/bmp',
            'ico' => 'image/vnd.microsoft.icon',
            'tiff' => 'image/tiff',
            'tif' => 'image/tiff',
            'svg' => 'image/svg+xml',
            'svgz' => 'image/svg+xml',

            // archives
            'zip' => 'application/zip',
            'rar' => 'application/x-rar-compressed',
            'exe' => 'application/x-msdownload',
            'msi' => 'application/x-msdownload',
            'cab' => 'application/vnd.ms-cab-compressed',

            // audio/video
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/wav',
            'ogg' => 'audio/ogg',
            'qt' => 'video/quicktime',
            'mov' => 'video/quicktime',
            'mp4' => 'video/mp4',
            'm4v' => 'video/mp4',
            'ogv' => 'video/ogg',

            // adobe
            'pdf' => 'application/pdf',
            'psd' => 'image/vnd.adobe.photoshop',
            'ai' => 'application/postscript',
            'eps' => 'application/postscript',
            'ps' => 'application/postscript',

            // ms office
            'doc' => 'application/msword',
            'rtf' => 'application/rtf',
            'xls' => 'application/vnd.ms-excel',
            'ppt' => 'application/vnd.ms-powerpoint',

            // open office
            'odt' => 'application/vnd.oasis.opendocument.text',
            'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
        );

        $ext = strtolower(array_pop(explode('.',$filename)));
        if (array_key_exists($ext, $mime_types)) {
            return $mime_types[$ext];
        }
		
        elseif (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME);
            $mimetype = finfo_file($finfo, $filename);
            finfo_close($finfo);
            return $mimetype;
        }
        else {
            return 'application/octet-stream';
        }
    }
    function tidyTempFiles(){
            $db->query("DELETE FROM `files` WHERE temp='true' AND timestamp<'".(time()-86400)."'");
	 }
    function getFileIcon($fileType, $full=false){
        //turns filetype into src of icon
        //used in showFileList(); showItemThum();
        switch($fileType){
            case "audio/mpeg":
                    $image = "mp3.png";
            break;
            case "audio/wav":
                    $image = "mp3.png";
            break;
            case "audio":
                    $image = "mp3.png";
            break;
            case "video/mp4":
                    $image = "movie.png";
            break;
            case "video":
                    $image = "movie.png";
            break;
        
            //documents
            case "UFF";
                    $image = "txt.png";
            break;
        
            case "text/plain":
                    $image = "txt.png";
                
            break;
            case "text/x-c++":
                    $image = "txt.png";
                
            break;
            case "application/pdf":
                    $image = "pdf.png";
            break;
        
            //excel/open office table
            case "application/vnd.ms-office":
                    $image = "list.png";
            break;
        
            case "application/zip":
                    $image = "zip.png";
            break;
        
            //images
            case "image/jpeg":
                    $image = "img.png";
            break;
            case "image/png":
                    $image = "img.png";
            break;
            case "image/tiff":
                    $image = "img.png";
            break;
            case "image/gif":
                    $image = "img.png";
            break;
            case "image":
                    $image = "img.png";
            break;
        
            //links
            case "youTube":
                    $image = "youTube.png";
            break;
            case "wiki":
                    $image = "wikipedia.png";
            break;
            case "RSS":
                    $image = "rss.png";
            break;
            default:
                    $image = "unknown.png";
        }

		if($full)
			$image = "<img src=\"gfx/icons/fileIcons/$image\">";
        
        return $image;
    }
    
    
    function getMyFiles($userid){
        $dbClass = new db();
        $files = $dbClass->select('files', array('owner', $userid, 'AND', 'status', '1'));
        $folder = $dbClass->select('folders', array('creator', $userid));
        $elements = $dbClass->select('elements', array('author', $userid));
        $data = array( 'files' => $files, 'folder' => $folder, 'elements' => $elements);
        return $data;
    }
         
    //put your code here
}

class file{
    
    public $id;
    
    function __construct($id=NULL){
        if($id != NULL){
            $this->id = $id;
        }
            
    }

    function getPath(){
        $fileId = $this->id;
        $db = new db();
        
        $documentData = $db->select('files', array('id', $fileId), array('id', 'folder', 'filename'));
            $documentElementData = $db->select('elements', array('id', $documentData['folder']), array('id', 'title', 'folder'));
			$folderClass = new folder($documentElementData['folder']);
			$path = $folderClass->getPath();
			$path .= $documentData['filename'];
			
            return $path;
    }
    function validateTempFile($privacy){
                $fileId = $this->id;
	 	$path = $this->getPath();
                echo $path;
		$oldpath = $path.'.temp';
		if(rename(universeBasePath.'/'.$oldpath, universeBasePath.'/'.$path)){
                        chmod(universeBasePath.'/'.$path, 0777);
                        $db = new db();
                        $values['temp'] = '0';
                        $values['status'] = '1';
                        $values['privacy'] = $privacy;
		 	if($db->update('files', $values, array('id', $fileId))){
		 		return true;
		 	}else{
		 		return false;
		 	}
		}
	 }
    
    
    function getFullFilePath($fileId=NULL){
        if($fileId === NULL){
            $fileId = $this->id;
        }
        $db = new db();
        $documentData = $db->select('files', array('id', $fileId), array('folder', 'filename'));
            
            $documentElementData = $db->select('elements', array('id', $documentData['folder']), array('folder'));
            $path = "upload/";
            $folderClass = new folder($documentElementData['folder']);
            $folderArray = $folderClass->loadFolderArray("path");
            $folderArray = array_reverse($folderArray['names'], true);
            if(is_array($folderArray))
            foreach($folderArray as &$folder){
                $path .= "$folder/";
            }
            $dbClass = new db();
            $documentFolderData = $dbClass->select('folders', array('id', save($documentElementData['folder'])));
            $path = urldecode($path);
            $filePath = $path.$documentData['filename'];
            return $filePath;
    }

    function getFileData(){
        $fileId = $this->id;

        $dbClass = new db();
        $fileData = $dbClass->select('files', array('id', save($fileId)));
        $fileData['realpath'] = $this->getPath();
        if(authorize($fileData['privacy'], 'show', $fileData['owner']))
        return $fileData;
    }

    function getTitle(){
                    $fileData = $this->getFileData();
                    return $fileData['title'];
            }
            
    function read(){
        
               
                $filePath = universeBasePath.'/'.$this->getFullFilePath();

                $file = fopen($filePath, 'r');
                $return = fread($file, filesize($filePath));
                fclose($file);
                
                return $return;
        
    }
    
    function readJson(){
        //based on: http://stackoverflow.com/questions/4811844/csv-to-json-with-php
            if(!$this->getFileType() === 'text/csv')
                return 'NOT A CSV!';
            
            $csv = $this->read();
            $rows = explode("\n", trim($csv));
            $result = array();
            foreach($rows AS $row){
                $fieldResults = str_getcsv ($row);
                $result[] = $fieldResults;
            }
            return json_encode($result);
    }
    
    function overwrite($string){
        
        
        $files = new files($this->id);
        $filedata = $this->getFileData();
        if(authorize($fileData['privacy'], 'show', $fileData['owner']))
         $files->updateFileContent($this->id, $string);
    }


    function getFileType(){
            $fileId = $this->id;
            $db = new db();
        
            $fileData = $db->select('files', array('id', $fileId), array('type'));
            return $fileData['type'];
        }
        
        
        
    function delete(){
        $fileId = $this->id;
        $dbClass = new db();
        $fileData = $dbClass->select('files', array('id', $fileId));
        $parentElement = $fileData['folder'];
        
        $fileElementData =$dbClass->select('elements', array('id', $parentElement), array('id', 'title', 'folder'));

        $type = $fileData['type'];

        //for all standard files
        $title = $fileData['filename'];




        //file can only be deleted if uploader = deleter
        if(authorize($fileData['privacy'], "edit")){
            
            $user = new user();
            $userData = $user->getData(getUser());
            if(($parentElement == $userData['profilepictureelement'])&&($fileData['filename'] == $userData['userPicture'])){
                echo 'You can not delete your current userpicture.';
            }else if($parentElement == $userData['profilepictureelement']){
                           $additionalPath = 'userPictures';
            }
            
            $folderClass = new folder($fileElementData['folder']);
            $folderPath = universeBasePath.'/'.$folderClass->getPath();
            
            $filePath = $folderPath.'/'.$title;
            
            if(unlink($filePath)){
                if($dbClass->delete('files', array('id', $fileId))){

                   //delete comments
                   $commentClass = new comments();
                   $commentClass->deleteComments("file", $fileId);

                   
                   //delete feeds
                   $classFeed = new feed();
                   $classFeed->deleteFeeds("file", $fileId);

                   
                   //delete shortcuts
                   $classShortcut = new shortcut();
                   $classShortcut->deleteInternLinks("file", $fileId);

                   //delete thumbnails
                   if($type == "image/jpg" || $type == "image/jpeg" || $type == "image/png"){
                       
                       
                       
                        $thumbPath = $folderPath.'thumbs/'.$title;
                       
                        if($additionalPath = 'userPictures'){
                            unlink($folderPath.$title);
                            unlink($folderPath.'thumb/25'.'/'.$title);
                            unlink($folderPath.'thumb/40'.'/'.$title);
                            unlink($folderPath.'thumb/300'.'/'.$title);
                        }
                        unlink($thumbPath);
                        return true;
                   }else{
                       return true;
                   }
               }
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    
}
    
/**
 * from Chyrp
 * Function: sanitize
 * Returns a sanitized string, typically for URLs.
 *
 * Parameters:
 *     $string - The string to sanitize.
 *     $force_lowercase - Force the string to lowercase?
 *     $anal - If set to *true*, will remove all non-alphanumeric characters.
 */
function sanitize_file_name($string, $force_lowercase = true, $anal = false) {
    $strip = array("~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "=", "+", "[", "{", "]",
                   "}", "\\", "|", ";", ":", "\"", "'", "&#8216;", "&#8217;", "&#8220;", "&#8221;", "&#8211;", "&#8212;",
                   "â€”", "â€“", ",", "<", ">", "/", "?");
    $clean = trim(str_replace($strip, "", strip_tags($string)));
    $clean = preg_replace('/\s+/', "-", $clean);
    $clean = ($anal) ? preg_replace("/[^a-zA-Z0-9]/", "", $clean) : $clean ;
    return ($force_lowercase) ?
        (function_exists('mb_strtolower')) ?
            mb_strtolower($clean, 'UTF-8') :
            strtolower($clean) :
        $clean;
}

