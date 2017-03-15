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

/*
 * split_all_features - split every feature into its own file
 *                      and save it to a specified folder
 */
var split_all_features = function(big_obj, out_dir)
{

    if (!fs.existsSync(out_dir)){
	fs.mkdirSync(out_dir);
    }

    for (subobj_name in big_obj["objects"])
    {
	var new_obj = sub_obj(big_obj, big_obj["objects"][subobj_name]);
	fs.writeFileSync(out_dir + "/" + subobj_name + ".topojson",
			 JSON.stringify(new_obj), { flag: 'w' });
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
    process.exit(1);
}

var main = function()
{
    const optionDefinitions = [
	{ name: 'input', alias: 'i', type: String, required:true },
	{ name: 'outdir', alias: 'o', type: String },
	{ name: 'feature', alias: 'f', type: String}
    ];
    
    const options = commandLineArgs(optionDefinitions);
    
    var fname = options["input"];
    var subobj_name = options["feature"];
    var outdir = options["outdir"];


    // does command-line-args  have a way to enforce
    // required args? If not it should, but I didn't
    // look past its NPM page for documentation
    // auto-generating a usage message would be cool
    // too.
    if (typeof(fname) == "undefined" ||
	(typeof(subobj_name) == "undefined" && typeof(outdir)) == "undefined")
    {
	usage();
    }

    // load the input json file
    var big_obj = load_json(fname);
	
    // if a feature (object) is specified, just save a single file
    if (typeof (subobj_name) != "undefined")
    {
	var new_obj = sub_obj(big_obj, big_obj["objects"][subobj_name]);
	fs.writeFileSync(subobj_name + ".topojson",
			 JSON.stringify(new_obj));
    }
    // otherwise, make a folder with a file for each feature
    else {
	split_all_features(big_obj, outdir);
    }
    
}

main();
