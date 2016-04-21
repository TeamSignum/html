function DisplayHelpMessage(page){
	var help_message = "";
	switch (page){
		case "class_builder": 
			help_message_title = "Class Builder";
			help_message = "This is the place for high level concepts like \"Algorithms\" or \"Algebra\"." +
			" \n\nDrag nodes from the toolbar onto the canvas to build a class. The three sizes of nodes can be used" +
			" to show the importance of topics. \n\n Click on the page icon to customize the node details.";
			break;
		case "concept_builder": 
			help_message_title = "Concept Builder";
			help_message = "This is the place for lower level concepts like \"Quicksort\" or \"Single variable equations\"."+
			" Nodes can represent concepts, assignments, or quizes. \n\n Click on the page icon to customize the node details."+
			"";
			break;
		case "class_view": 
			help_message_title = "Class View";
			help_message = "These are high level concepts. Click on nodes to navigate the the concept view. Each node has an associated popup (page icon)." +
			" This popup contains all information about the node.";
			break;
		case "concept_view": 
			help_message_title = "Concept View";
			help_message = "These are low level concepts. Each node has an associated pop up. Click the page icon to open up the pop up" +
			" and see all information about the node.";
			break;
	}

	swal(help_message_title, help_message)
}