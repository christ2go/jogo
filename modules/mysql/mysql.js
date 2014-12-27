var modpath = "/home/christian/jogo/modules/"
// Later to be global
var lmodule_mysql = function()
{
  this.connectinfo = undefined;
  
  this.query = function(query)
  {
   if(this.connectinfo == undefined)
   {
     
      return "notconnected";
     
   }
   this.connectinfo["query"] = query;
   var fs = require("fs");
   fs.writeSync("mypy/config.json",JSON.stringify(this.connectinfo));
   // Oncew written run python3
   
  };
  this.connect = function(hostname,user,pw,db)
  {
    this.connectinfo = {};
    this.connectinfo["hostname"] = hostname;
    this.connectinfo["user"]     =     user;
    this.connectinfo["pw"]       =       pw;
    this.connectinfo["db"]       =       db;
    // Clear result, write connectioninfo
    var fs = require('fs');
    fs.writeFileSync(modpath+'mysql/result.json', '');
    fs.writeFileSync(modpath+'mysql/mypy/config.json',JSON.stringify(this.connectinfo));
  
    // Synchrounusly call python
    var execSync = require('exec-sync');
    var result = execSync("python3 "+modpath+"mysql/mypy/connect.py");
    return result;
  };
  this.createdb = function()
  {
    
    
  };
  this.deletedb = function()
  {
    
    
  };
  this.securitymode = function(val)
  {
    // Deactivates / Activates security mode (strings get escaped before running)
    
  };
}
// Function for escaping mysql strings
// Taken from http://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly
function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

var lmodule_msql_instance = new lmodule_mysql(); 
globaltable.define(["mysqlconnect"],function(host,username,pw,db){
  if(lmodule_msql_instance.connect(host,username,pw,db) == "1")
    return true
  else
    return false
  
  
});
// Test onmly mysql connector
/*
var test = new lmodule_mysql();
console.log(test.connect("mundusromanus.com","root","latein","spiel"));
*/