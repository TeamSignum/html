function DisplayHelpMessage(page){
	var help_message = "";
	switch (page){
		case "class_builder": 
			help_message_title = "Class Builder";
			help_message = "This is the place for high level concepts like \"Algorithms\" or \"Algebra\"." +
			" Drag nodes from the toolbar onto the canvas to build a class. The three sizes of nodes can be used" +
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
			help_message = "help message.";
			break;
		case "concept_view": 
			help_message_title = "Concept View";
			help_message = "help message.";
			break;
	}

	swal(help_message_title, help_message)
}