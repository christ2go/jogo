test = new logointerpreter();
require('log-buffer');

// Read argc files
function plist()
{
    this.plist = {};
                        
    this.pprop = function(varname,value)
    {
            this.plist[varname] = value;
    }
                        
                        this.gprop = function(varname)
                        {
                            // TODO Support for non set propertys
                            if(this.plist[varname] !== undefined)
                                return this.plist[varname];
                            return [];
                        }
                        
                        this.remprop = function(varname)
                        {
                            delete this.plist[varname];
                        }
                        
                        this.tolist = function()
                        {
                            // Convert to list
                            var mylist = [];
                            for (var key in this.plist) {
                              mylist[mylist.length] = [key,this.plist[key]];

                            }
                            return mylist;
                            
                        }
                        
                    }
                    
                                        function scopeobj()
                    {
                        // Aufbau: [name,[wert1,wer2,...]]
                        this.vars = {};
                        this.locals = [{}];
                        this.returned = false;
                        this.op = undefined;
                        this.plists = {};
                        this.createplist = function()
                        {
                        
                        }
                        this.createvar = function()
                        {
                        };
                        this.setop = function(expr)
                        {
                            if(this.returned == false)
                            {
                                this.returned = true;
                                this.op = expr;
                            }
                        }
                        this.setvar = function(varname,val)
                        {
                            for(var i = this.locals.length-1;i>=0;i--)
                            {
                                var key = i;
                                if(varname in this.locals[key])
                                {
                                    this.locals[key][varname] = val;
                                    return "succ";
                                }
                            }
                            this.vars[varname] = val;
                        };
                        this.getval = function(varname)
                        {
                            for(var i = this.locals.length-1;i>=0;i--)
                            {
                                var key = i;
                                if(varname in this.locals[key])
                                {
                                    if(ltype(this.locals[key][varname]) == "list")
                                    {
                                        return this.locals[key][varname].slice();    
                                    }
                                    return this.locals[key][varname];
                                    
                                }
                            }
                            
                            if(varname in this.vars)
                            {
                                if(ltype(this.vars[varname]) == "list")
                                {
                                    return this.vars[varname].slice(0);
                                }
                                return this.vars[varname];
                            }
                            
                                

                        }
                        this.setglobal = function(varname,val)
                        {
                            this.vars[varname] = val;
                        };
                        // Functions for introducing and leaving local scope
                        this.newlocal = function()
                        {
                            this.locals[this.locals.length] = {};
                            this.op = undefined;
                            this.returned = false;
                        };
                        this.leavelocal = function()
                        {
                            this.locals.pop();
                            this.op = undefined;
                            this.returned = false;
                        };
                        
                        this.addlocal = function(varname)
                        {
                            this.locals[this.locals.length-1][varname] = undefined;
                        };
                    }

                    
                    // Handling for tab in textarea


                    function logointerpreter() {
                        var self = this;
                        // 1st Parse the String
                        // "fd 100" => ["fd",100]
                        // TODO Remove comments frome logo code
                        this.addlang = function(language)
                        {
                            // Language is an array of [eng => trans] with lang[0] = word
                        }
                        this.evaluate = function(code)
                        {
                            // Main Interpreter function, used for evaluating the code
                            var code = this.parse_code(code);
                             return this.run(code)[0];
                            /*
							var teste;
							teste = this.get_next_eval(code);
							console.log(teste);
							// Parse into eval blocks => real eval begins
							code = code.slice(teste[1].length,code.length);
							alert(code);
							*/
                        }
                        this.globalscope = new scopeobj();
                        
                        this.run = function(code,scope)
                        {
                            if(!scope)
                            {
                                scope = new scopeobj([]);
                            }
                            // Get next func call
                            var i = 0;
                            var run = this.get_next_eval(code);
                            console.log(run);
                            if(run == undefined || run == [] || run == "")
                                {
                                    return  [""];
                                    
                                }
                            while(run[1] != [])
                            {

                                var result = this.runit(run[1],scope);
                                for(var i = 0;i<run[0];i++)
                                    code.shift();
                                i ++;
                                run = this.get_next_eval(code);
                                if(run == undefined || run == [])
                                {
                                    return  [""];
                                    
                                }
                            }
                        };
                        this.runit = function(code,scope)
                        {
                            if(this.globalscope.op == true)
                            {
                                return;
                            }
                            var code = code.splice(0);
                            //alert(">>",code);
                            if(code.length == 1 && !this.isproc_orfunc(code[0]))
                            {
                                return code;	
                            }
                            //console.log("Recieved code:",code);
                            if(!code)
                            {
                                //alert("Code is missing");	
                            }
                            // 1 st to
                            var callarray = []; 
                            for(var index = code.length-1;index >= 0;index --)
                            {
                                if(this.globalscope.op !== undefined)
                                {
                                    return [];
                                }
                                //console.log(code[index]);
                                if(!this.isproc_orfunc(code[index]))
                                {
                                    callarray.unshift(code[index]);	
                                }else{
                                    // Get callarray
                                    // Check for multiarg
                                    var multiarg = false;
                                    //alert(code[index-1]);
                                    if(code[index-1] == "<multiarg>")
                                    {
                                        //console.log("Could this be mutiarg?");
                                        multiarg = true;	
                                    }else{
                                        //console.log("No multiarg:"+code[index]);	
                                    }
                                    //console.log(multiarg);
                                    callarray.unshift(code[index]); // Add funcname to array
                                    if(multiarg == false)
                                    {
                                        callarray = callarray.splice(0,this.getfuncorprocarity(code[index])+1);
                                    }
                                    else
                                    {
                                        if(callarray.indexOf("<endmultiarg>") == callarray.length-1)
                                        {	
                                            callarray.pop();

                                        }
                                        else
                                        {
                                            //allarray.splice(-1,1);
                                            callarray.splice(callarray.indexOf("<endmultiarg>"));
                                            // Lets also remove it from "newcode"
                                            code.splice(callarray.length+index-1);
                                           
                                        }
                                    }
                                    var result = this.exec(callarray.slice(),scope); // Executed code stored in array                     
                                    // Change
                                    //console.log(callarray);
                                    //var newcode = [];
                                    if(!multiarg)    
                                        code.splice(index,callarray.length,result);
                                    else
                                        code.splice(index-1,callarray.length+2,result);
                                    
                                    // Generated call array correctly
                                    // Don't do more :-)
                                    return this.runit(code);
                                }
                            }
                        };
                        this.exec = function(call,scope)
                        {
                            // Needs scope only for functions like make and localmake, which modify variables
                            // TODO 
                            // Find the function (if exists, else eval in new env or if macro eval in old env)
                            //this.primitives[this.primitives.length] = [funcnames,fn,fnarity];

                            for(var index = 0;index<call.length;index++)
                            {
                                var element = call[index];
                                if(!call[index])
                                    break;
                                if(call[index][0] == "\"")
                                {
                                    call[index] = call[index].substr(1);	
                            }
                                if(call[index][0] == ":")
                                {
                                    var name = element.substr(1);
                                    call[index] = this.globalscope.getval(element.substr(1));
                                    
                                }
                                
                                // Number handling
                                if(typeof(call[index]) == "number")
                                {
                                    call[index] = call[index].toString();
                                }
                                
                            }
                            
                            
                            // Check if it is a user defined procedure
                            
                            if(this.isprocedure(call[0]))
                            {
                                
                                procedure = copy(this.getprocedure(call[0]));
                                
                                this.globalscope.newlocal();
                                for(var index = 0;index<procedure[1].length;index++)
                                {
                                    // DO IT
                                    //console.log(procedure[1][index].substr(1) + " " + call[index+1])
                                    this.globalscope.addlocal(procedure[1][index].substr(1));
                                    this.globalscope.setvar(procedure[1][index].substr(1),call[index+1]);
                                }
                                
                                //console.log("CALLING"+procedure);
                                var res =  this.run((procedure.slice()[2]))[0]; // Add procedures return value
                                // Check output stack
                                
                                
                                
                                var res = this.globalscope.op;
                                this.globalscope.leavelocal();
                                return res;
                            }else{
                            
                            }
                            
                            
                            //alert(call);
                            // TODO Lowercase
                            for(var index = 0;index<this.primitives.length;index++)
                            {
                                for(var index_2 = 0;index_2<this.primitives[index][0].length;index_2++)
                                {
                                    if(this.primitives[index][0][index_2] == call[0])
                                    {
                                        var prname = call[0];
                                        call.shift();
                                        if(this.primitives[index][3] == true)
                                        {
                                            call[call.length] = this.globalscope;
                                            
                                        }
                                        if(this.primitives[index][4] == true)
                                        {
                                            call[call.length] = this;
                                        
                                        }
                                        //console.log("Calling "+prname+" "+call);
                                        var res = this.primitives[index][1].apply(null,call);
                                        // If type is string withput " append it
                                        if(ltype(res) == "word")
                                        {
                                            if(res[0] != '\"')
                                            {
                                                res = "\""+res;
                                            }
                                        }
                                        return res;
                                    }	
                                }
                            }
                        }
                        
                        this.get_next_eval = function(code)
                        {
                            var fnarity = 0;
                            var nexteval = [];
                            var multiarg = 0;
                            var index = 0;
                            while(true)
                            {
                                if(this.isproc_orfunc(code[index]) && multiarg == 0)
                                    fnarity += this.getfuncorprocarity(code[index]);
                                if(code[index] == "<multiarg>")
                                    multiarg++;
                                if(multiarg != 0)
                                    fnarity++;
                                if(code[index] == "<endmultiarg>")
                                    multiarg--;
                                fnarity--;
                                console.log(fnarity);
                                if(fnarity == 0)
                                {
                                    console.log( [index,nexteval]);
                                    return [index,nexteval]
                                }
                                nexteval[nexteval.length] = code[index];
                                
                                // Update conditions
                                index++;
                            }
                        }
                        this.get_next_eval_2 = function(code)
                        {
                            //alert(code);
                            if(code.length == 1)
                            {
                                if(this.isproc_orfunc(code[0]))
                                {
                                    return [1,[code[0]]];
                                }
                            }
                            for(var index = 0;index<code.length;index++)
                            {
                                // Check for procedure definition
                                if(this.isproc_orfunc(code[index]))
                                {
                                    var callarrray = [];
                                    var multiarg = false;
                                    var multivar = 0;
                                    /*
										if(code[index-1] == "<multiarg>")
										{
											multiarg = true;	
											callarrray[callarrray.length] = "<multiarg>";
										} 
										callarrray[callarrray.length] = code[index];
										//console.log("is a function");
										// Get the funcs arity and append, then return
										*/
                                    var funcarity = 0;
                                    //alert("ARITY:"+funcarity);
                                    var multivar = 0;

                                    for(var index=0;index<=funcarity;index++)
                                    {
                                        if(index == code.length)
                                        {
                                            return [index,callarrray];
                                        }
                                        if(code[index] == "<multiarg>")
                                        {
                                            multivar++;	
                                        }
                                        if(multivar != 0)
                                        {
                                            funcarity++;
                                        }
                                        if(code[index] == "<endmultiarg>")
                                        {
                                            multivar --;
                                        }
                                        if(code[0] == "<multiarg>" && multivar == 0 && code[index] == "<endmultiarg>") 
                                        {
                                            callarrray[callarrray.length] = code[index];
                                            return [index+1,callarrray];
                                        }
                                        if(this.isproc_orfunc(code[index]) && code[index-1] != "<multiarg>")
                                        {
                                            funcarity += this.getfuncorprocarity(code[index]);
                                        }
                                        callarrray[callarrray.length] = code[index];

                                    }
                                    // MAYBE SPLICE CODE HERE --> no longer needed ?!
                                    return [index,callarrray];
                                }	
                            }	
                        }
                        function clone(obj) {
                            if(obj == null || typeof(obj) != 'object')
                                return obj;

                            var temp = obj.constructor(); // changed

                            for(var key in obj) {
                                if(obj.hasOwnProperty(key)) {
                                    temp[key] = clone(obj[key]);
                                }
                            }
                            return temp;
                        }
                        this.parse_code = function(code)
                        {
                            // 1st Tokenize the Input
                            var code = this.tokenize(code);
                            var klammern = 0;
                            for(var index = 0;index<code.length;index++)
                            {
                                if(code[index] == "(")
                                {
                                    klammern++;	
                                }
                                if(code[index] == ")")
                                {
                                    klammern--;	
                                }	
                            }


                            if(klammern != 0)
                            {
                                return;	
                            }

                            // Booleans CAN ONLY be parsed correctly at execution time
                            code = this.multiargparans(code);
                            
                            for(var index = 0; index<code.length;index++)
                            {
                                var oldindex = index;
                                var infixtokens = [];
                                var exspectnum = true;
                                while(is_poperand(code[index]))
                                {
                                    var isnum = false, isop =false , isnoch = false ;
                                    
                                    if(parseNum(code[index]) !== false)
                                        isnum = true;
                                    if(code[index] == "(" || code[index] == ")" || code[index] == "MINUS"  )
                                        isnoch = true;
                                    if(code[index] == "+" || code[index] == "-" || code[index] == "*"  || code[index] == "/" )
                                        isop = true;
                                    
                                    if(isnoch && infixtokens.length !=1)
                                    {
                                        infixtokens.push(code[index]);
                                    }
                                    else if(isnum && exspectnum || isop && !exspectnum)
                                    {
                                        infixtokens.push(code[index]);
                                        exspectnum = (!exspectnum);
                                    }
                                    else
                                    {
                                        if(infixtokens.lenght > 1)
                                            index--;
                                        break;   
                                    }
                                    index++;
                                    
                                    
                                    
                                    
                                }
                                //console.log("Tokens: ",this.parseinfix(infixtokens),oldindex,index);
                                if(oldindex+1 == index)
                                {
                                    continue;
                                }
                                                                    code = code.slice(0,oldindex).concat(this.parseinfix(infixtokens)).concat(code.slice(index,code.length));

                            }
                            
                            for(var index=0;index<code.length;index++)
                            {
                                if(code[index] == "+") {code[index] = "sum";}
                                if(code[index] == "*") {code[index] = "product";}
                                if(code[index] == "/") {code[index] = "quotient";}
                                if(code[index] == "-") {code[index] = "difference";}
                            }
                            for(var index = 0;index<code.length;index++)
                            {
                                if(code[index] == "=")
                                {
                                    // Check answap
                                    if(code[index-1] == "<endmultiarg>")
                                    {
                                        var margs = 1;
                                        for(var i = index-1;i>0;i--)
                                        {
                                            var token = code[i];
                                            if(token == "<multiarg>")
                                            {
                                                // Swap
                                                margs--;
                                                if(margs == 0)
                                                {
                                                    //code[index] == ""
                                                }
                                            }
                                            if(token == "<endmultiarg>")
                                            {
                                                marg++;
                                            }
                                        }
                                    }
                                }
                            }
                            // TODO Parse macros
                            var inproc = false;
                            var vararg = true;
                            var procdef = [[],[],[]];
                            for(var index = 0;index<code.length;index++)
                            {
                                if(this.isspecialtoken(code[index],"to"))
                                {

                                    inproc = true;
                                    procdef[0] = code[index+1];
                                    index++;	
                                }	
                                else if(code[index][0] == ":" && ltype(code[index]) != "list" && vararg == true)
                                {
                                    procdef[1][procdef[1].length] = code[index];
                                }else{
                                    vararg = false;	
                                }
                                if(this.isspecialtoken(code[index],"end"))
                                {
                                    // TODO Define the procedure
                                    this.define_procedure(procdef[0],procdef[1],procdef[2])
                                    code = code.splice(index+1,code.length);
                                    index = -1;
                                    procdef = [[],[],[]];
                                    inproc = false;	
                                    vararg = true;
                                }
                                if(inproc == true && vararg == false)
                                {
                                    procdef[2][procdef[2].length] = code[index];	
                                }	

                            }
                            return code; // Parsing complete 
                        }
                        this.isspecialtoken = function(token,check)
                        {
                            // TODO
                            if(token == check)
                            {
                                return true;	
                            }	
                            return false;
                        }
                        this.multiargparans = function(code)
                        {
                            for(index = 0;index<code.length;index++)
                            {
                                if(code[index] == "(")
                                {
                                    if(parseNum(code[index]) === false)
                                    {
                                        code[index] = "<multiarg>";
                                        code = code.slice(0,index).concat(this.multiargparans(code.slice(index,code.length)));
                                        for(var index_2 = 0;index_2<code.length;index_2++)
                                        {
                                            if(code[index_2] == ")")
                                            {
                                                code[index_2] = "<endmultiarg>";	
                                            }
                                        }
                                    }
                                }	
                            }
                            return code;	
                        }
                        this.tokenize = function(input) {
                            var tokens = [];
                            // Iterate over String
                            var index = 0, whitespace = 0;
                            while (index < input.length) {
                                if (input[index] == " ") {
                                    index++;
                                }
                                if (input[index] == "[") {
                                    // Beginning of a list found => parseList
                                    var liste = this.parseliste(input.slice(index));
                                    tokens[tokens.length] = liste[0];
                                    index += liste[1];
                                    index++;
                                } else if (input[index] == "\"") {
                                    // " Found => Beginning of a string
                                    var liste = this.parsestring(input.slice(index));
                                    tokens[tokens.length] = liste[0];
                                    index += liste[1];
                                } else {

                                    var liste = this.parsestring(input.slice(index));
                                    if(liste[0] == "-" && (parseNum(tokens[tokens.length-1]) === false || tokens[tokens.length-1] === undefined))
                                    {

                                        liste[0] = "MINUS";	// Unary minus
                                    }
                                    tokens[tokens.length] = liste[0];
                                    index += liste[1];
                                }

                                // Append parsed
                            }
                            return tokens;
                        };

                        this.parseliste = function(string) {
                            var liste = [];
                            // Array für die Liste selbst
                            var nextelement = false;
                            for (var i = 1; i < string.length; i++) {
                                element = string[i];
                                if (element == " "  && nextelement)
                                {
                                    continue;
                                }
                                if((element != " ") && nextelement)
                                {
                                    nextelement = false;
                                }
                                if (element == " ") 
                                {
                                    continue;
                                    // Move on to next

                                }
                                if (element == "]") 
                                {
                                    return [liste, i];
                                }

                                if (element == "[") 
                                {
                                    // Run the function itself
                                    //console.log(liste);
                                    var neueliste = (this.parseliste(string.slice(i)));

                                    i += (this.parseliste(string.slice(i)))[1];
                                    liste[liste.length] = neueliste[0];
                                }
                                else 
                                {
                                    
                                    liste[liste.length] = this.parseliststring(string.slice(i),true,true)[0];
                                    i += this.parseliststring(string.slice(i),true,true)[1];

                                }

                            }
                            for(var index = 0;index<liste.length;index++)
                            {
                                if(liste[index] === "")
                                    liste.splice(index, 1);
                            }
                            return [liste, i];
                            
                            // Return statement

                        };

                        this.parsestring = function(stringel, ohneanfuehrungszeichen, calledfromlist) {
                            var string = "";
                            var returnfromlist = false;
                            if (!calledfromlist) {
                                calledfromlist = false;
                            }
                            if(!calledfromlist)
                            {
                                if(stringel[0] == "\"")
                                {
                                    string = "\"";
                                }
                                if(stringel[0] == "+")
                                {
                                    return ["+",1];
                                }
                                if(stringel[0] == "-")
                                {
                                    return ["-",1];
                                }
                                if(stringel[0] == "*")
                                {
                                    return ["*",1];
                                }
                                if(stringel[0] == "/")
                                {
                                    return ["/",1];
                                }
                                if(stringel[0] == "(")
                                {
                                    return ["(",1];
                                }
                                if(stringel[0] == ")")
                                {
                                    return [")",1];
                                }
                            }
                            if (!ohneanfuehrungszeichen && stringel[0] != "\"") {
                                // 
                                stringel = "\"" + stringel;
                                returnfromlist = true;
                                // 
                            }
                            var escaped = false;

                            // Used for parsing strings in Logo
                            for (var index = 0; index < stringel.length; index++) {

                                var element = stringel[index];
                                if (element == "]" && calledfromlist == true && escaped == false)                           {
                                    return [string, index-1];
                                }
                                if((element == "+" || element == "-" || element == "*" || element == "/" || element == "(" || element == ")")  && (parseNum(string) != false && calledfromlist == false ))
                                {
                                    if(returnfromlist)
                                    {
                                        return [string, index-1];
                                    }
                                }
                                if(element == "[" && returnfromlist == true)
                                {
                                    return [string, index-1];
                                }
                                if (element != "\\" && escaped == false && element != "\"") {

                                    if (element == " ") {
                                        return [string, index];
                                    }
                                    string = string + element;

                                } else if (escaped == true) {
                                    // Check for escape characters
                                    if (element == " ") {
                                        string = string + " ";
                                    }
                                    if (element == "n") {
                                        string = string + "\n";
                                    }
                                    if (element == "\t") {
                                        string = string + "\t";
                                    }
                                    // TODO Add new escape characters
                                    escaped = false;
                                } else if (element == "\\") {
                                    escaped = true;
                                }

                            }
                            return [string, index];
                        };
                        this.parseliststring = function(stringel, ohneanfuehrungszeichen, calledfromlist) 
                        {

                            var string = "";
                            var returnfromlist = false;
                            if (!calledfromlist) {
                                calledfromlist = false;
                            }
                            
                            if(stringel[0] == "\"")
                            {
                                string = "\"";
                            }
                            var escaped = false;

                            // Used for parsing strings in Logo
                            for (var index = 0; index < stringel.length; index++) {

                                var element = stringel[index];
                                if (element == "]" && calledfromlist == true && escaped == false) {
                                    return [string, index-1];
                                }
                                if(element == "[" && returnfromlist == true)
                                {
                                    return [string, index-1];
                                }
                                if (element != "\\" && escaped == false && element != "\"") {

                                    if (element == " ") {
                                        return [string, index];
                                    }
                                    string = string + element;

                                } else if (escaped == true) {
                                    // Check for escape characters
                                    if (element == " ") {
                                        string = string + " ";
                                    }
                                    if (element == "n") {
                                        string = string + "\n";
                                    }
                                    if (element == "\t") {
                                        string = string + "\t";
                                    }
                                    // TODO Add new escape characters
                                    escaped = false;
                                } else if (element == "\\") {
                                    escaped = true;
                                }

                            }
                            return [string, index];
                        };
                        this.primitives = [];
                        this.define = function(funcnames,fn,fnarity,scope,interpobj)
                        {
                            // Function for defining functions
                            
                            if(!fnarity)
                            {
                                fnarity = fn.length; 
                            }
                            // TODO Check if funcname is already used

                            this.primitives[this.primitives.length] = [funcnames,fn,fnarity,scope,interpobj]; 
                        };
                        this.langalt = function(funcname,name,lang)
                        {
                            // Append to any kind of array
                        };
                        this.procedures = [];
                        this.define_procedure = function(prname,inputs,body)
                        {
                            // Append to this.procedures
                            this.procedures[this.procedures.length] = [prname,inputs,body];
                        }
                        this.isproc_orfunc = function(fname)
                        {
                            for(var index = 0;index<this.primitives.length;index++)
                            {
                                for(var index_2 = 0;index_2<this.primitives[index][0].length;index_2++)
                                {
                                    if(this.primitives[index][0][index_2] == fname)
                                    {
                                        return true;	
                                    }	
                                }	
                            }
                            
                            for(var index = 0;index<this.procedures.length;index++)
                            {
                                if(this.procedures[index][0] == fname)
                                {
                                    return true;	
                                }	
                            }
                            return false;
                        }
                        this.getfuncorprocarity = function(fname)
                        {
                            for(var index = 0;index<this.primitives.length;index++)
                            {
                                for(var index_2 = 0;index_2<this.primitives[index][0].length;index_2++)
                                {
                                    if(this.primitives[index][0][index_2] == fname)
                                    {
                                        if(this.primitives[index][2] == -1)
                                        {
                                            return this.primitives[index][1].length;
                                        }
                                        return this.primitives[index][2];	
                                    }	
                                }	
                            }	
                            for(var index = 0;index<this.procedures.length;index++)
                            {
                                if(this.procedures[index][0] == fname)
                                {
                                    return this.procedures[index][1].length;	
                                }	
                            }
                            return undefined;
                        }
                        this.isprocedure = function(prname)
                        {
                            // Check if it is a procedure
                            for(var index = 0;index<this.procedures.length;index++)
                            {
                                if(this.procedures[index][0] == prname)
                                {
                                    return true;	
                                }	
                            }
                            return false;
                        }
                        
                        this.getprocedure = function(prname)
                        {
                            // Return the procedures code
                            for(var index = 0;index<this.procedures.length;index++)
                            {
                                if(this.procedures[index][0] == prname)
                                {
                                    return this.procedures[index];	
                                }	
                            }
                        }
                        this.is_function = function(funcname)
                        {
                            for(var index = 0;index<this.primitives.length;index++)
                            {
                                for(var index_2 = 0;index_2<this.primitives[0].length;index_2++)
                                {
                                    if(this.primitives[0][index_2] == funcname)
                                    {
                                        return true;	
                                    }	
                                }
                            }
                            return false;	
                        };
                        this.parseinfix = function(array)
                        {
                            if(array.length < 3)
                                return array;
                            array.reverse;
                            stack = []; // Stack
                            prefixlist = []; // List with commands
                            for(var i = array.length-1;i>=0;i--)
                            {
                                var element = array[i];

                                if(is_operand(element))
                                {
                                    prefixlist[prefixlist.length] = element;
                                }

                                if(is_operator(element))
                                {
                                    while((!stack_empty(stack)) && precedence(element) <= precedence(stack_top(stack)) ){
                                        // Add while part
                                        prefixlist[prefixlist.length] = stack_top(stack);
                                        pop_stack(stack);
                                    }
                                    push_stack(stack,element);

                                }
                                if(element == ")")
                                {
                                    push_stack(stack,")");	
                                }

                                if(element == "(")
                                {
                                    while(stack_top(stack) != ")")
                                    {
                                        var append_operator = pop_stack(stack);
                                        prefixlist[prefixlist.length] = append_operator;
                                    }
                                    pop_stack(stack);		
                                }
                            }

                            while(!stack_empty(stack))
                            {
                                if(stack_top(stack) == ")")
                                {
                                    pop_stack(stack);	
                                }
                                else
                                {
                                    prefixlist[prefixlist.length] = pop_stack(stack);	
                                }
                            }
                            prefixlist.reverse();
                            return prefixlist;

                        };
                        // Helpers for Infix
                        function is_operand(opr)
                        {
                            return !is_operator(opr) && (opr != "(" && opr != ")") ? 1:0	
                        }
                        function is_operator(opr)
                        {
                            if(opr == "+")
                            {
                                return true;
                            }
                            if(opr == "-")
                            {
                                return true;
                            }
                            if(opr == "*")
                            {
                                return true;
                            }
                            if(opr == "/")
                            {
                                return true;
                            }	
                            if(opr == "^")
                            {
                                return true;
                            }
                            // TODO Modulo maybe
                            if(opr == "$")
                            {
                                return true;
                            }
                            return false;
                        }
                        // Stack Helpers
                        function stack_empty(stack)
                        {
                            return stack.length == 0 ? true : false;	
                        }
                        function stack_top(stack)
                        {
                            return stack[stack.length-1]	
                        }
                        function pop_stack(stack)
                        {
                            return stack.pop();	
                        }
                        function push_stack(stack,el)
                        {
                            stack[stack.length] = el;	
                        }
                        function precedence(operator)
                        {
                            if(operator == "^" || operator == "$") {return 7;}
                            if(operator ==  "*" ){return 6;}
                            if(operator ==  "/" ){return 6;}
                            if(operator ==  "+" ){return 4;}
                            if(operator ==  "-" ){return 4;}
                            if(operator ==  "(" ){return 10;}
                            if(operator ==  ")" ){return 10;}
                        }

                        this.translate = function(lang,engname,gername)
                        {

                        };

                    }
                    // TODO Funktionen mit mehr als einem Argument => Satz korrekt darstellen


                    // Interpretation


                    // Definition von Funktionen

                    var globaltable = test;

                    // Data Structure PRIMITIVES
                    function ltype(atom)
                    {
                        // Function which returns a logo like type
                        if(typeof atom === 'string')
                        {
                            return "word";
                        }
                        if(typeof atom === 'object')
                        {
                            return "list";
                        }
                        if(typeof atom === 'number')
                        {
                            return "number";
                        }

                        // TODO Throw error => not a Logo Type but bollean maybe?
                    }

                    function parseNum(number)
                    {
                        // A function for parsing strings to numbers (conversion)
                        if(number == "")
                        {
                            return false;
                        }
                        if(!isNaN(number))
                        {
                            return parseFloat(number);
                        }
                        else{
                            return false;
                        }
                    }
                    // Constructors
                    globaltable.define(["list"],function(a,b){
                        // n elements but at least 2
                        if(!a || !b)
                        {
                            // Not enough inputs
                            // TODO Throw an error

                        }
                        var liste = [];
                        for(var argc = 0;argc<arguments.length;argc++)
                        {
                            liste[liste.length] = arguments[argc];
                        }

                        return liste;

                    },-1);

                    globaltable.define(["word"],function(a,b){
                        // n elements but at least 2
                        if(!a || !b)
                        {
                            // Not enough inputs
                            // TODO Throw an error

                        }
                        var wort = "";
                        for(var argc = 0;argc<arguments.length;argc++)
                        {
                            if(ltype(arguments[argc]) == "list")
                            {
                                // TODO Throw an error => list can't be sentenced
                                

                            }
                            wort = wort + arguments[argc];
                        }

                        return wort;

                    },-1);

                    globaltable.define(["sentence","se"],function(a,b){
                        // n elements but at least 2
                        if(!a || !b)
                        {
                            // Not enough inputs
                            // TODO Throw an error

                        }
                                newlist = [];
                                for(var index = 0;index<arguments.length;index++)
                                {
                                    // if it is a list extract element
                                    var element = arguments[index];
                                    if(ltype(element) == "list")
                                    {
                                        for(var
                                            i = 0;i<arguments[index].length;i++)
                                            newlist[newlist.length] = arguments[index][i];
                                    }else{
                                            newlist[newlist.length] = arguments[index];
                                    }
                                }
                                return newlist;
                        }


                    ,-1);

                    globaltable.define(["fput"],function(a,b){
                        // n elements but at least 
                        if(!a || !b)
                        {
                            // Not enough inputs
                            // TODO Throw an error

                        }

                        var list = b.slice(0);;
                        if(ltype(b) == "word")
                            console.log(b);
                        var extra = a;
                        //console.log(a,b);
                        list.unshift(extra);
                        return list;

                    },2);

                    globaltable.define(["lput"],function(a,b){
                        // n elements but at least 
                        if(!a || !b)
                        {
                            // Not enough inputs
                            // TODO Throw an error

                        }
                        var list = b;
                        var extra = a;
                        if(list == extra){
                            // TODO Zirkuläre Liste
                        }
                        list.push(extra);
                        return list;

                    });

                    globaltable.define(["lput"],function(a,b){
                        // n elements but at least 
                        if(!a || !b)
                        {
                            // Not enough inputs
                            // TODO Throw an error

                        }
                        var list = b;
                        var extra = a;
                        if(list == extra){
                            // TODO Zirkuläre Liste
                        }
                        list[list.length] = extra;
                        return list;

                    });

                    /*
					 * NOT SUPPORTED : ARAY MDARRAY LISTTOARRAY (ARRAYS IN GENERAL)
					 */

                    // SELECTORS

                    globaltable.define(["first"],function(list){
                        if(!list)
                        {
                            // No argument supplied
                        }
                        if(typeof list === "undefined" )
                        {
                            // Return with error
                        }
                        if(list.length == 0)
                        {
                            return "";
                        }
                        return list[0];

                    });

                    globaltable.define(["firsts"],function(list){
                        // TODO Type checking
                        if(ltype(list) != "list")
                        {
                            // TODO Throw TypeError
                        }
                        var liste = [];
                        for(var index = 0;index<list.length;index++)
                        {
                            // TODO Check if element [0] doesn't exist
                            liste.push(list[index][0]);
                        }
                        return liste;
                    });

                    globaltable.define(["last"],function(wordorlist){
                        if(false) // TODO Type-checking wordorlist
                        {
                            // TODO Throw an error
                        }
                        if(!wordorlist.length >= 1)
                        {
                            // TODO error	
                        }
                        return wordorlist[wordorlist.length-1];

                    });

                    globaltable.define(["butfirst","bf"],function(wordorlist){
                        
                        if(wordorlist.length == 0)
                        {
                            // TODO error	
                            return "";
                        }
                        if(wordorlist.length == 1)
                        {
                            return wordorlist;
                        }
                        
                        return wordorlist.slice(1);

                    });

                    globaltable.define(["butfirsts"],function(list){
                        // TODO Type checking
                        if(ltype(list) != "list")
                        {
                            // TODO Throw TypeError
                        }
                        var liste = [];
                        for(var index = 0;index<list.length;index++)
                        {
                            // TODO Check if element [0] doesn't exist
                            liste.push(list[index].slice(1));
                        }
                        return liste;
                    });

                    globaltable.define(["butlast","bl"],function(wordorlist){
                        if(false) // TODO Type-checking wordorlist
                        {
                            // TODO Throw an error
                        }
                        if(!wordorlist.length >= 1)
                        {
                            // TODO error	
                        }
                        return wordorlist.slice(0,wordorlist.length-2);

                    });

                    globaltable.define(["item"],function(index,thing){
                        // TODO wordorlist
                        return thing[index-1];
                    });

                    // TODO Quoted

                    //MUTATORS

                    /*
					 * The following primitves work different as in UCBLogo
					 * * setitem: Only sets 1 item, doesn't every occuarence of element
					 */
                    globaltable.define(["setitem"],function(index,list,value){
                        // TODO wordorlist
                        if(index <= list.length){

                        }
                        if(value == list)
                        {
                            // TODO Circular list? Copy first
                        }
                        list[index-1] = value;
                        return list;
                    });

                    // MISIING setbutfirst,array mutation

                    // Predicates

                    globaltable.define(["wordp","word?"],function(word){
                        if(ltype(word) == "word")
                        {
                            return true;
                        }else{
                            return false;
                        }
                    });

                    globaltable.define(["listp","list?"],function(word){
                        if(ltype(word) == "list")
                        {
                            return true;
                        }else{
                            return false;
                        }
                    });

                    globaltable.define(["emptyp","empty?"],function(word){
                        if(ltype(word) == "word")
                        {
                            if(word == "")
                            {
                                return true;
                            }
                        }else if(ltype(word) == "list"){
                            if(word == [])
                            {
                                return true;
                            }
                        }
                        return false;
                    });

                    globaltable.define(["equalp","equal?"],function(a,b){

                        if(a == b)
                        {
                            return true;
                        }
                        return false;
                    },2);
                    // TODO beforep
                    // MISSING .eq (no nodes in js)

                    globaltable.define(["memberp","member?"],function(thing1,thing2){
                        // Using indexof
                        if(thing2.indexof(thing2) != -1)
                        {
                            return true;
                        }
                        return false;
                    });

                    globaltable.define(["numberp","number"],function(x){
                        if(!isNan(x) && x != "")
                        {
                            return true;
                        }
                        // TODO Might not be correct ... ?
                    });
                    // MISSING backslashedp

                    // Queries
                    globaltable.define(["count"],function(wordorlist){
                        // TODO Type Checking (wordorlist)
                        return (wordorlist.length);
                    });
                    globaltable.define(["ascii"],function(char){
                        if(ltype(char) != "word")
                        {
                            // TODO Throw Type Error
                        }
                        if(char.length != 1)
                        {
                            // TODO Throw length error (return 0)
                        }
                        return char[0].charCodeAt(0);
                    });
                    // MISSING rawascii
                    globaltable.define(["char"],function(x){
                        // TODO Type-check: x is Int
                        return String.fromCharCode(x);
                    });

                    globaltable.define(["member"],function(thing1,thing2){
                        // TODO Implementation
                    });

                    globaltable.define(["lowercase"],function(word){
                        if(ltype(word) != "word")
                        {
                            // TODO Raise an error
                        }
                        return word.toLowerCase();
                    });

                    globaltable.define(["uppercase"],function(word){
                        if(ltype(word) != "word")
                        {
                            // TODO Raise an error
                        }
                        return word.toUpperCase();
                    });

                    // Missing parse
                    // Missing standout
                    // Missing runparse

                    // TODO Transmitters

                    // Recievers
                    globaltable.define(["readlist","rl"],function(interp){
                        var kbd = require('kbd');
                        var line = kbd.getLineSync();
                        return interp.parseliste(line)[0];
                        
                    },0,false,true);

                    globaltable.define(["readword","rw"],function(){
                        var kbd = require('kbd');
                        var line = kbd.getLineSync();
                        return line;
                    });

                    globaltable.define(["readchar","rc"],function(){
                        var result = prompt("Please enter a character", "");
                        // TODO Parse the list

                        return result[0];
                    });

                    // TODO readchars

                    // TODO FILEACCESS (Using ajax???)

                    // TODO Terminal Access

                    // Arithmetic

                    globaltable.define(["sum"],function(a,b)
                                       {
                        var result = 0;
                        if(arguments.length != 2)
                        {
                            // TODO 
                        }
                        for(var index = 0;index<arguments.length;index++)
                        {
                            var input = arguments[index];
                            var number = parseNum(input);
                            if(number === false) // Type Checking, because 0 might be evaluated as false
                            {
                                // TODO Throw numerror
                            }
                            result += number;
                        }
                        return result;
                    },-1);

                    globaltable.define(["difference"],function(a,b){
                        if(!a || !b)
                        {
                            // TODO die with error
                        }
                        var num1 = parseNum(a);
                        var num2 = parseNum(b);

                        if(a === false)
                        {
                            // TODO Throw an error
                        }
                        if(b === false || b == 0) // Check for b = 0 --> 
                        {
                            // TODO Throw an error
                        }
                        return a-b;
                    });
                    
                    globaltable.define(["MINUS"],function(a){
                        if(!a)
                        {
                            // TODO die with error
                        }
                        var num1 = parseNum(a);

                        
                        return 0-a;
                    });
                    
                    // TODO Type checking in product
                    globaltable.define(["product"],function(a,b){
                        var result = parseNum(arguments[0]);
                        if(!a && !b)
                        {
                            return 1;
                        }
                        
                        if(arguments.length == 2)
                        {
                            
                            return  (parseNum(a)*parseNum(b)).toString();
                            
                        }
                        for(var index = 1;index<arguments.length;index++)
                        {
                            var input = arguments[index];
                            var number = parseNum(input);
                            if(number === false) // Type Checking, because 0 might be evaluated as false
                            {
                                // TODO Throw numerror
                            }
                            result *= number;
                        }
                        return result;
                    },-1);

                    globaltable.define(["quotient"],function(a,b){
                        var num1 = parseNum(arguments[0]);
                        var num2 = parseNum(arguments[1]);
                        if(num1 === false || num2 === false)
                        {
                            // TODO Throw an error	
                        }
                        if(arguments.length != 2)
                        {
                            // Check for 
                        }

                        return num1/num2;
                    },2);

                    globaltable.define(["modulo"],function(a,b){
                        if(!a || !b)
                        {
                            // TODO argerror
                        }
                        var num1;
                        // Check if this works
                        if(num1 = parseNum(a) === false)
                        {
                            // TODO numerror
                        }
                        var num2;
                        // Check if this works
                        if(num2 = parseNum(b) === false)
                        {
                            // TODO numerror
                        }

                        return ((num2 % num1) + num1) % num1;
                    });

                    globaltable.define(["remainder"],function(a,b){
                        if(!a || !b)
                        {
                            // TODO argerror
                        }
                        var num1;
                        // Check if this works
                        if(num1 = parseNum(a) === false)
                        {
                            // TODO numerror
                        }
                        var num2;
                        // Check if this works
                        if(num2 = parseNum(b) === false)
                        {
                            // TODO numerror
                        }

                        return num1%num2;
                    });


                    globaltable.define(["int"],function(a){
                        if(!a)
                        {
                            // TODO argerror
                        }
                        var num1;
                        // Check if this works
                        if(num1 = parseNum(a) === false)
                        {
                            // TODO numerror
                        }

                        return ~~num1;
                    });

                    globaltable.define(["round"],function(a){
                        if(!a)
                        {
                            // TODO argerror
                        }
                        var num1;
                        // Check if this works
                        if(num1 = parseNum(a) === false)
                        {
                            // TODO numerror
                        }

                        return Math.round(num1);
                    });			

                    globaltable.define(["sqrt"],function(a){
                        if(!a)
                        {
                            // TODO argerror
                        }
                        var num1 = parseNum(a);
                        // Check if this works
                        if(num1 === false)
                        {
                            // TODO numerror
                            return 14;
                        }

                        if(num1 < 0)
                        {
                            // Throw an error
                        }
                        return Math.sqrt(num1);
                    });

                    globaltable.define(["round"],function(a,b){
                        if(!a || !b)
                        {
                            // TODO argerror
                        }
                        var num1;
                        // Check if this works
                        if(num1 = parseNum(a) === false)
                        {
                            // TODO numerror
                        }

                        var num2;
                        // Check if this works
                        if(num2 = parseNum(b) === false)
                        {
                            // TODO numerror
                        }

                        return Math.pow(num1,num2);
                    });

                    globaltable.define(["exp"],function(a){
                        if(!a)
                        {
                            // TODO argerror
                        }
                        var num1;
                        // Check if this works
                        if(num1 = parseNum(a) === false)
                        {
                            // TODO numerror
                        }

                        if(num1 < 0)
                        {
                            // Throw an error
                        }
                        return Math.exp(num1);
                    });
                    // MISSING log10
                    globaltable.define(["ln"],function(a){
                        if(!a)
                        {
                            // TODO argerror
                        }
                        var num1;
                        // Check if this works
                        if(num1 = parseNum(a) === false)
                        {
                            // TODO numerror
                        }

                        if(num1 < 0)
                        {
                            // Throw an error
                        }
                        return Math.log(num1);
                    });

                    globaltable.define(["sin"],function(a){
                        if(!a)
                        {
                            // TODO argerror
                        }
                        var num1;
                        // Check if this works
                        if(num1 = parseNum(a) === false)
                        {
                            // TODO numerror
                        }

                        if(num1 < 0)
                        {
                            // Throw an error
                        }
                        return Math.sin(num1);
                    });

                    // Missing radsin

                    globaltable.define(["cos"],function(a){
                        if(!a)
                        {
                            // TODO argerror
                        }
                        var num1;
                        // Check if this works
                        if(num1 = parseNum(a) === false)
                        {
                            // TODO numerror
                        }

                        if(num1 < 0)
                        {
                            // Throw an error
                        }
                        return Math.cos(num1);
                    });
                    // Missing radcos
                    // Missing arctan
                    // Missing ractarn

                    // PREDICATES
                    globaltable.define(["lessp","less?"],function(a,b){
                        if(!a || !b)
                        {
                            /* error */ 
                        }
                        if(a<b)
                        {
                            return true;
                        }
                        return false;
                    });

                    globaltable.define(["greaterp","greater?"],function(a,b){
                        if(!a || !b)
                        { /* error */ }
                        if(a>b)
                        {
                            return true;
                        }
                        return false;
                    });

                    globaltable.define(["random"],function(highest){
                        var num_highest;
                        if((num_highest = parseNum(highest)) == false)
                        {
                            // TODO dye with error
                        }
                        return Math.floor((Math.random() * num_highest)).toString(); 
                    });

                    // MISSING rerandom
                    // MISSING form
                    globaltable.define(["form"],function(num,nwidth,precision){

                    });

                    // MISSING bitand,bitor,bitxor,bitnot,ashift,lshift

                    globaltable.define(["and"],function(){
                        var args = arguments;
                        for(var index = 0;index<args.length;index++)
                        {
                            if(args[index] != "true") // TODO Type converting
                            {
                                return false;	
                            }	
                        }
                        return true;
                    },-1);

                    globaltable.define(["or"],function(){
                        var args = arguments;
                        for(var index = 0;index < args.length;index++)
                        {
                            if(args[index] == "true")
                            {
                                return true;	
                            }	
                        }
                        return false;
                    },-1);

                    globaltable.define(["not"],function(tfexpr){
                        if(tfexpr == "true")
                        {
                            return false;	
                        }	

                        if(tfexpr == false)
                        {
                            return true;	
                        }
                    });

                    
                    globaltable.define(["print"],function(val){
                        console.log(val);

                    });
                    
                    /* WORKSPACE MANAGEMENT FUNCTIONS --- SPECIAL FORM
					 * GET ACCESS TO VARIABLES
					 */
                    
                    globaltable.define(["make"],function(varname,expr,scope){
                        
                        scope.setvar(varname,expr);
                    },2,true,false);
                    
                    globaltable.define(["local"],function(varname,scope){
                        scope.addlocal(varname);
                    },1,true,false);
                    
                    globaltable.define(["thing"],function(varname,scope){
                        return scope.getval(varname);
                    },1,true,false);
                    
                    globaltable.define(["output","op"],function(expr,scope){
                        // Check if output exists
                        //alert("OP: "+expr);
                        scope.setop(expr);
                    },1,true,false);
                    
                    /*
                     *  CONTROL STRUCTURE FUNCTIONS
                     *
                     */
                    globaltable.define(["if"],function(tfxpr,runlist,interp){
                        if(tfxpr == true)
                            interp.evaluate(betterjoin(runlist));
                    },2,false,true);
                    
                    globaltable.define(["ifelse"],function(tfxpr,runlist,elserun,interp){
                        if(tfxpr == true)
                            interp.evaluate(betterjoin(runlist));
                        else
                            interp.evaluate(betterjoin(elserun));
                    },3,false,true);
                              
                    // WHILE LOOP
                              
                    globaltable.define(["while"],function(tflist,runlist,interp){
                        while(interp.evaluate(betterjoin(tflist)))
                        {
                              interp.evaluate(betterjoin(runlist));
                              
                        }
                    },2,false,true);
                              
                    globaltable.define(["EXIT"],function()
                    {
                        /* ABORT IS AN EXTENSION TO THE LOGO LANGUAGE STANDARD */
                        /* IT EXISTS THE CURRENT PROGRAM */
                        throw new Error("LOGO EXIT!"); 
                    });
                    // REPEAT
                    globaltable.define(["repeat"],function(nmbr,code,scope,interp){
                        if(!isNormalInteger(nmbr))
                        {
                            // Throw a Logo Error
                            console.log("REPEAT EXSPECTS ARGUMENT 1 TO BE A POSITIVE INTEGER");
                            return;
                        }
                        
                        // It's an integer
                        scope.addlocal("repcount");
                        for(var index = 1; index != nmbr;index++)
                        {
                            scope.setvar("repcount",index);
                            interp.evaluate(betterjoin(code));
                        }
                    },2,true,true);
                    function isNormalInteger(str) {
                        var n = ~~Number(str);
                        return String(n) === str && n >= 0;
                    }
                    
                    function is_poperand(token)
                    {
                              if(token == "+"){return true;}
                              if(token == "-"){return true;}
                              if(token == "*"){return true;}
                              if(token == "/"){return true;}
                              if(token == "("){return true;}
                              if(token == ")"){return true;}
                              if(token == "MINUS"){return true;}
                              if(parseNum(token) !== false)
                              {
                                return true;
                              }
                              return false;
                    }
                    
                    function nochange(token)
                    {
                        if(token == "MINUS"){return true;}
                        if(token == "("){return true;}
                        if(token == ")"){return true;}
                        return false;
                    }
                              
                    function betterjoin(code,depth)
                    {
                        if(depth != undefined)
                        {
                              var joined = "[";
                        }else{
                              var joined = "";
                        }
                        // Just like join, but only for 
                        for(var index = 0;index < code.length; index++)
                        {
                              if(ltype(code[index]) == "list")
                              {
                                joined = joined + betterjoin(code[index],1);
                                // Parse lists back into logo expressions and append
                              }else{
                                // Just append the old stuff
                                if(index !== code.length-1)
                                    joined = joined+code[index]+" ";
                                else
                                    joined = joined+code[index];
                                
                              }
                        }
                        if(depth != undefined)
                        {
                              joined = joined+"]";
                        }
                        return joined;
                    }
                    // Taken from http://www.xenoveritas.org/blog/xeno/the-correct-way-to-clone-javascript-arrays       
                    function copy(array)
                    {
                            var cpy = [];
                            for(var index = 0;index<array.length;index++)
                            {
                                if(Object.prototype.toString.call( array[index] ) === '[object Array]')
                                {
                                    cpy[cpy.length] = copy(array[index]);
                                }else{
                                    cpy[cpy.length] = array[index];
                                }
                            }
                            return cpy;
                    }


if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
  , filename = process.argv[2];
var fs = require('fs');
var contents = fs.readFileSync(filename).toString();
contents = contents.replace(/(\r\n|\n|\r)/gm," ");
test.evaluate(contents);


