// language.js

function language(langname)
{
    this.trans = [];
    this.langname = langname;
    this.addcommand = function(engl,langalt)
    {
        this.trans[this.trans.length] = [engl,langalt];
    }
    this.get = function()
    {
        return this.trans;
    }
}