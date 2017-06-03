#!/usr/bin/env node
const topojson=require("topojson");const fs=require("fs");const commandLineArgs=require("command-line-args");const VERSION="0.0.2";const PROJ_URL="https://github.com/jakekara/toposplit/";var load_json=function(fname){try{var obj=JSON.parse(fs.readFileSync(fname,"utf8"));return obj}catch(e){console.error("Error loading json file: "+e);process.exit(1)}};var sub_obj=function(big_obj,sub_obj){return topojson.topology(topojson.feature(big_obj,sub_obj))};var obj_to_file=function(obj,fname){try{fs.writeFileSync(fname,JSON.stringify(obj),{flag:"w"})}catch(e){console.error("Error writing json file: "+e);process.exit(1)}};var split_all_features=function(big_obj,out_dir){if(!fs.existsSync(out_dir)){try{fs.mkdirSync(out_dir)}catch(e){console.error("Error creating directory: "+e);process.exit(1)}}for(subobj_name in big_obj["objects"]){obj_to_file(sub_obj(big_obj,big_obj["objects"][subobj_name]),out_dir+"/"+subobj_name+".topojson")}};var usage=function(){console.error("");console.error("toposplit");console.error("---------");console.error("usage: toposplit --input INPUT_FILE [--outdir OUTPUT_DIRECTORY | --feature FEATURE_TO_SPLIT]");console.error("");process.exit(0)};var version=function(){console.log("toposplit "+VERSION+" -- more info: "+PROJ_URL);process.exit(0)};var main=function(){const optionDefinitions=[{name:"input",alias:"i",type:String},{name:"outdir",alias:"o",type:String},{name:"feature",alias:"f",type:String},{name:"help",alias:"h",type:Boolean},{name:"version",alias:"v",type:Boolean}];const options=commandLineArgs(optionDefinitions);console.log("options",options);if(options["version"]==true)version();if(options["help"]==true)usage();const fname=options["input"];const subobj_name=options["feature"];const outdir=options["outdir"];console.log("fname",fname);console.log("subobj_name",subobj_name);console.log("outdir",outdir);console.log("typeof(options)",typeof options);console.log("options",options);console.log("options[_data]",options["options"]);if(typeof fname=="undefined"||(typeof subobj_name=="undefined"&&typeof outdir)=="undefined"){usage()}var big_obj=load_json(fname);if(typeof subobj_name!="undefined"){var new_obj=sub_obj(big_obj,big_obj["objects"][subobj_name]);obj_to_file(sub_obj(big_obj,big_obj["objects"][subobj_name]),subobj_name+".topojson")}else{split_all_features(big_obj,outdir)}};main();