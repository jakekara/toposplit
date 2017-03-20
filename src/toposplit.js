#!/usr/bin/env node

/**
 * 
 * toposplit.js - split a topojson file into a folder with  
 *                a file for each object, or one file for
 *                a single object
 * 
 * by Jake Kara 
 * jake@jakekara.com
 * 
 */

const topojson = require("topojson");
const fs = require('fs');
const commandLineArgs = require('command-line-args');

const VERSION = "0.0.2";
const PROJ_URL = "https://github.com/jakekara/toposplit/";

/**
 * load_json - load a json file or exit with error
 */
var load_json = function(fname)
{
    try
    {
	var obj = JSON.parse(fs.readFileSync(fname, 'utf8'));
	return obj;
    }
    catch (e)
    {
	console.error("Error loading json file: " + e);
	process.exit(1);
    }
}

/*
 * sub_obj - get a sub_object of a topojson object
 */
var sub_obj = function(big_obj, sub_obj)
{
    return topojson.topology(topojson.feature(big_obj, sub_obj));
}

/**
 * obj_to_file - write json object to a file 
 */
var obj_to_file = function ( obj, fname )
{
    try
    {
	fs.writeFileSync(fname,
			 JSON.stringify( obj ), { flag: 'w' });
    }
        catch (e)
    {
	console.error("Error writing json file: " + e);
	process.exit(1);
    }
}

/*
 * split_all_features - split every feature into its own file
 *                      and save it to a specified folder
 */
var split_all_features = function(big_obj, out_dir)
{

    // make folder if it doesn't exist
    if (!fs.existsSync(out_dir)){
	try
	{
	    fs.mkdirSync(out_dir);
	}
	catch (e)
	{
	    console.error("Error creating directory: " + e );
	    process.exit(1);
	}
    }

    // write each subobj to a file
    for (subobj_name in big_obj["objects"])
    {
	obj_to_file(sub_obj(big_obj, big_obj["objects"][subobj_name]),
		    out_dir + "/" + subobj_name + ".topojson");
    }
}


/**
 * usage - print usage and exit error
 */
var usage = function()
{
    console.error("");
    console.error("toposplit");
    console.error("---------");
    console.error("usage: toposplit --input INPUT_FILE\
[--outdir OUTPUT_DIRECTORY | --feature FEATURE_TO_SPLIT]");
    console.error("");
    process.exit(0);
}

/**
 * version - print version and exit 
 */
var version = function()
{
    console.log( "toposplit " + VERSION + " -- more info: " + PROJ_URL );
    process.exit(0);
}

var main = function()
{

    const optionDefinitions = [
	{ name: 'input', alias: 'i', type: String },
	{ name: 'outdir', alias: 'o', type: String },
	{ name: 'feature', alias: 'f', type: String },
	{ name: 'help', alias: 'h', type: Boolean },
	{ name: 'version', alias: 'v', type: Boolean },
    ];

    const options = commandLineArgs(optionDefinitions);

    if ( options["version"] == true )
	version();
    if ( options["help"] == true )
	usage();
    
    const fname = options["input"];
    const subobj_name = options["feature"];
    const outdir = options["outdir"];

    // does command-line-args  have a way to enforce
    // required args? If not it should, but I didn't
    // look past its NPM page for documentation
    // auto-generating a usage message would be cool
    // too.
    if ( typeof(fname) == "undefined" ||
	( typeof(subobj_name) == "undefined" && typeof(outdir)) == "undefined" )
    {
	usage();
    }

    // load the input json file
    var big_obj = load_json( fname );
	
    // if a feature (object) is specified, just save a single file
    if (typeof( subobj_name ) != "undefined")
    {
	var new_obj = sub_obj(big_obj, big_obj["objects"][subobj_name]);
	obj_to_file( sub_obj(big_obj, big_obj["objects"][subobj_name]),
		    subobj_name + ".topojson" );
    }
    // otherwise, make a folder with a file for each feature
    else {
	split_all_features(big_obj, outdir);
    }
    
}

main();
