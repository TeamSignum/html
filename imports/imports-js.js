/**
 * Learning Universe Javascript Imports File
 * Authors: Joseph Cottongim
 * Attributions: Using HEAD.JS for a loader
 * Date: Spring 2016 
 */ 

// Load JQUERY first
head.load([{ jquery: "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js" },
		   { fabricjs: "http://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.5.0/fabric.min.js" }
		   ]);

// Once JQUERY loads, load remaining sitewide JS files
head.ready(["jquery"], function() {
    head.load([{ bootstrapjs: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" },
               { sweetalertjs: "../imports/dist/sweetalert.min.js" },
               { helperjs: "../imports/helper.js" }],
               function() {
                 loadPageFiles();
               });
    });



