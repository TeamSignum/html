/**
 * Learning Universe Node Manager
 * Authors: Daniel Cushing and Dustin Reitstetter
 * Date: 11/21/15 
 */ 

// Map Manager Object 
var MM = {}; 

/*
 * Map Manager Constructor  
 */ 
MM.Manager = function(){
 	this.nodes = []; 
 	this.edges = []; 
 	this.tools = []; 
 	this.count = 0; 
 }

/* 
 * Map Manager Node constructor. 
 * @param: node - FabricJS circle. 
 */ 
MM.Node = function(node, hasBorders, hasControl){
	this.top     = node.top;  
	this.left    = node.left; 
	this.radius  = node.radius; 
	this.fill    = node.fill;  
	this.borders = hasBorders; 
	this.control = hasControl; 
}

/* 
 * Map Manager edge constructor. 
 * @param: line - FabricJS line. 
 */ 
MM.Edge = function(line, hasBorders, hasControl){
	this.coords          = [line.x1, line.y1, line.x2, line.y2]; 
	this.fill            = line.fill;  
	this.stroke          = line.stroke; 
	this.strokeWidth     = line.strokeWidth; 
	this.strokeDashArray = line.strokeDashArray; 
	this.borders         = hasBorders; 
	this.control         = hasControl; 
}

/* 
 * Adds input node "_node" to this map manager. 
 * @param: _node - FabricJS circle. 
 */ 
MM.Manager.prototype.addNode = function(_node){
 	node = new MM.Node(_node); 
 	this.nodes.push(node);
 	this.count++; 
 }

 /* 
 * Adds input edge "_edge" to this map manager. 
 * @param: _edge - FabricJS line. 
 */ 
MM.Manager.prototype.addEdge = function(_edge){
 	edge = new MM.Node(_edge); 
 	this.edges.push(edge);
 }

/*
 * Gets node from "nodes" at input index. 
 * @param: index - node-to-retrive index. 
 */
MM.Manager.prototype.getNode = function(index){
	return nodes[index]; 
}

/*
 * Get the # of nodes in this Map Manager 
 */ 
MM.Manager.prototype.getNodeCount = function(){
	return this.count; 
}