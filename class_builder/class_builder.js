/**
 * Learning Universe Class Builder
 * Authors: Daniel Cushing and Dustin Reitstetter
 * Date: 11/21/15 
 */ 


// Class Builder Global Variable 
var CB = {}; 

/*
 * CB Manager Constructor  
 */ 
 CB.Manager = function(){

 	// Init Manger
 	this.nodes = []; 
 	this.edges = []; 
 	this.tools = []; 

 }

/* 
 * CB Node constructor. 
 * @param: node - KineticJS circle. 
 */ 
CB.Node = function(node){
	this.x           = node.x;  
	this.y           = node.y; 
	this.radius      = node.radius; 
	this.fill        = node.fill;  
	this.stroke      = node.stroke; 
	this.strokeWidth = node.strokeWidth; 
	this.draggable   = node.draggable; 
}

/* 
 * Add input node to this class builder manager.  
 * @param: _node - KineticJS circle. 
 */ 
 CB.Manager.addNode = function(_node) {
 	node = new CB.Node(_node); 
 	this.nodes.push(node);
 	return node; 
 }
