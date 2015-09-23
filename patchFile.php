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

include_once("inc/functions.php");
include_once("inc/config.php");



$db = new db();
$users = $db->select('user', array(), array('userid'));

foreach($users AS $user){
    echo $user['userid'];
    
            //create record in user_privacy_rights  
            $privacyValues['userid'] = $user['userid'];
            $privacyValues['profile_realname'] = 'p';
            $privacyValues['profile_fav'] = 'p';
            $privacyValues['profile_files'] = 'p';
            $privacyValues['profile_playlists'] = 'p';
            $privacyValues['profile_activity'] = 'p';
            $privacyValues['receive_messages'] = 'p';
            $privacyValues['buddylist'] = 'p';
            $privacyValues['info'] = 'p';
            $privacyValues['groups'] = 'p';
            $db->insert('user_privacy_rights', $privacyValues);
    
            echo '<br>';
    
}

