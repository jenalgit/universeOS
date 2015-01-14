<?php
//This file is published by transparency-everywhere with the best deeds.
//Check transparency-everywhere.com for further information.
//Licensed under the CC License, Version 4.0 (the "License");
//you may not use this file except in compliance with the License.
//You may obtain a copy of the License at
//
//https://creativecommons.org/licenses/by/4.0/legalcode
//
//Unless required by applicable law or agreed to in writing, software
//distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//See the License for the specific language governing permissions and
//limitations under the License.
//
//@author nicZem for Tranpanrency-everywhere.com

include('../../inc/config.php');
include('../../inc/functions.php');

function reload($requests){
    $user = getUser();
    
    $buddylist = new buddylist();
    $groups = new groups();
    
    $userCounter = 0;
    $eventCounter = 0;
    $messageCounter = 0;
    
    foreach($requests AS $request){
        switch($request['action']){
            case'buddylist':
                if($request['subaction'] == 'reload'){
                    if($request['data']['buddy_checksum'] != $buddylist->getChecksum()){
                        $result[] = array('action'=>'buddylist','subaction'=>'reload');
                    }
                }
                break;
                
            case'IM':
                if($request['subaction'] == 'sync'){
                    $im = new im();
                    $messagesToSync = $im->checkForMessages($request['data']['last_message_received']);
                    foreach($messagesToSync AS $messageData){
                        if(($messageData['receiver'] == getUser())&&($messageData['read']==1)){
                            $messageCounter++;
                        }
                    }
                    $result[] = array('action'=>'IM','subaction'=>'sync', 'data'=>$messagesToSync);
                }
                break;
            case 'UFF':
                if($request['subaction'] == 'sync'){
                    $uff = new uff($request['data']['file_id']);
                    if($request['data']['checksum'] != $uff->getChecksum()){
                        $result[] = array('action'=>'UFF','subaction'=>'sync', 'data'=>array('file_id'=>$request['data']['file_id'],'content'=>$uff->show()));
                    }
                }
                break;
        }
    }
    
    foreach($groups->getOpenRequests() AS $openGroupRequestData){
        $userCounter++;
        $openGroupRequestData['group_title'] = $groups->getGroupName($openGroupRequestData['group_id']);
        $result[] = array('action'=>'groups', 'subaction'=>'openRequest', 'data'=>$openGroupRequestData);
    }
    
    
    //check for open requests
    $openBuddyRequests = $buddylist->getOpenRequests($user);
    
    //add open requests to result
    if(count($openBuddyRequests > 1)){
        foreach($openBuddyRequests AS $requestBuddyId=>$requestBUsername){
            $userCounter++;
            $result[] = array('action'=>'buddylist','subaction'=>'openRequest','data'=>array('userid'=>$requestBuddyId));
        }
    }
    
    return $result;
    
}

echo json_encode(reload($_POST['request']));


