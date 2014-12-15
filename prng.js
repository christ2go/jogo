// A Javascript pseudo random number generator
// Requires seed 
// (c) Christian Albert Hagemeier, 2014
// Based on http://stackoverflow.com/questions/6275593/how-to-write-you-own-random-number-algorithm
// (Fezvez C Code)
function prng()
{
    // TODO Initialize with random var at start
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = 88675123;

    
    this.setseed = function(seed)
    {
        this.x = seed;
    };
    
    this.getrandomnumber = function(lower,upper)
    {
        
        this.t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        this.w = this.w ^ (this.w >> 19) ^ (this.t ^ (this.t >> 8));
        return (this.w%(upper-lower))+lower;

    };
    
}