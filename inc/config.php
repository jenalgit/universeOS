<?php

//disable error reporting
//error_reporting(E_ALL);
ini_set('display_errors', 0);


//include dbConfig
$config_class_file_path = dirname(__FIlE__).'/classes/uni_config.php';
if(file_exists($config_class_file_path)){
    include($config_class_file_path);
}else{
    die('There is no config file. Please run the <a href="./installer/" title="Installer">Installer</a> or check if there is anything wrong with your server');
}

//serverstuf
$universeURL = 'http://localhost/universe'; //url of current installation


//start session
if(!isset($_SESSION)){
	//@sec
    //ini_set('session.cookie_secure',1);
    ini_set('session.cookie_httponly',1);
    ini_set('session.use_only_cookies',1);
    session_start();
}

define('uni_config_database_host', uniConfig::$db_server);
define('uni_config_database_user', uniConfig::$db_user);
define('uni_config_database_password',  uniConfig::$db_password);
define('uni_config_database_name',  uniConfig::$db_name);
define('universeBasePath',  uniConfig::$uni_basepath);
define('uni_config_url',  uniConfig::$uni_url);

define('analytic_script',  "<!-- Piwik --> <script type=\"text/javascript\"> var _paq = _paq || []; _paq.push(['trackPageView']); _paq.push(['enableLinkTracking']); (function() { var u=\"//analytics.transparency-everywhere.com/piwik/\"; _paq.push(['setTrackerUrl', u+'piwik.php']); _paq.push(['setSiteId', 2]); var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s); })(); </script> <noscript><p><img src=\"//analytics.transparency-everywhere.com/piwik/piwik.php?idsite=2\" style=\"border:0;\" alt=\"\" /></p></noscript> <!-- End Piwik Code -->");
?>