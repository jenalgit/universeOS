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
class link {
    //put your code here
}



	function addLink($folder, $title, $type, $privacy, $link){
             
             
    
                $user = getUser();

                $time = time();
                if(mysql_query("INSERT INTO `links` (`folder`, `type`, `title`, `link`, `privacy`, `author`, `timestamp`) VALUES ( '".save($folder)."', '".save($type)."', '".save($title)."', '".save($link)."', '$privacy', '$user', '$time');")){
                	
                	$feedText = "has created the link $title in the folder";
                    $feedLink1 = mysql_insert_id();
                    $feedLink2 = $folder;
					
                    addFeed($user, $feedText, folderAdd, $feedLink1, $feedLink2);
					
					return true;
                }
	}
    
    function deleteLink($linkId){
        
                $linkSql = mysql_query("SELECT * FROM links WHERE id='$linkId'");
                $linkData = mysql_fetch_array($linkSql);
                    
                //file can only be deleted if uploader = deleter
                if(authorize($linkData['privacy'], "edit", $linkData['author'])){
                    
                       if(mysql_query("DELETE FROM links WHERE id='$linkId'")){
                           
                           //delete comments
                           deleteComments("link", $linkId);
                           deleteFeeds("link", $linkId);
                           deleteInternLinks("link", $linkId);
                           
                           
                           
                               return true;
                       }else{
                               return false;
                       }
                }else{
                    return false;
                }
    }