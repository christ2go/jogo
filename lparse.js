// lparse.js

function preproc(fname)
{
    //Load the file
    var lines = fload(fname).split("\n");
    var newlines = [];
    for(var index = 0;index<lines.length;index++)
    {
        var stringmode = false;
        var line = lines[index];
        if(line[0] == "#")
        {
            // Preprocessor directive
            if(line.split(" ")[0] == "#string")
            {
                // Enable the new string mode
                console.log("String mode");
                continue;
            }
            if(line.split(" ")[0] == "#loadm")
            {
                // Load module ()
                
                
            }
        }
        var newline = [];
        for(var ti = 0;ti<line.length;ti++)
        {
            // if token == " ; anf = != anf
            var token = line[ti];
            console.log(token);
            if(stringmode && token == "\"")
            {
                var instring = !instring;
            }
            
            if(instring && token==" ")
            {
                newline[newline.length] = "\"";
            }
            
            if(instring && token=="\"")
            {
                continue;
            }
            newline[newline.length] = token;
        }
        newlines[newlines.length] = newline;
    }
    console.log(newlines);
    
}

function fload(fname)
{
    var fs = require('fs');
    var contents = fs.readFileSync(fname).toString();
    return (contents);
}

preproc("test.lgo");

