lignes = 0;

total_points=0;



// Appel de init() pour afficher les personnes
init();

function init(){	 
	getPersons(); //get persons hiya li trecupiri les données
	
}


function getPersons () {
	
	httpRequest = new XMLHttpRequest(); //J'instancie l'objet XMLHttpRequest
	
	httpRequest.open('GET', '/api/persons'); //Je parametre ma requete http (la route api persons va recevoir les données) (selectperson())
	
	httpRequest.onreadystatechange = doAfficherPersons; //quand la réponse arrive je définis la fonction a appeler (la c'est do Afficher Persons)
	
	httpRequest.send(); // envoyer la requete
}



function doAfficherPersons () {

	const table =document.getElementsByTagName("table")[0];
	rows = table.getElementsByClassName("row");

	for(row of rows){
			row.remove();
	}
	lignes=0;
	total_points = 0;

	if (httpRequest.readyState === XMLHttpRequest.DONE) {
	
	 if (httpRequest.status === 200) {
	
		reponse = httpRequest.responseText;
	
		persons = JSON.parse(reponse)
		
		for (person of persons) { 
		
		doInsert(person.id, person.nom, person.prenom, person.points);
		}
	
	  } else {
		  alert('Petit soucis');
	  }
	}
}




//DoNewData va créer une nouvelle ligne (un nouveau tuple dans la bd)
function doNewData(){		

	//On récupere les divisions par leur id pour pouvoir récupérer les valeurs insérées
	elt_nom = document.getElementById("form_nom");
	elt_prenom = document.getElementById("form_prenom");
	elt_points = document.getElementById("form_points");
	
	//On récupere les valeurs insérées
	nom = elt_nom.value;
	prenom = elt_prenom.value;
	points = parseInt(elt_points.value);
	
	//Indiquer si le formulaire est incomplet
	if(nom=="" || prenom=="" || Number.isNaN(points))
		alert("Formulaire incomplet !");

	//Sinon on insere une ligne (ajoute un tuple a la bad)
	else{	
		httpRequest = new XMLHttpRequest();
		//insertPerson()
		httpRequest.open("POST","api/persons"); //On initialise la requete (on parametre la requete, la route api persons va recevoir les données avec la méthode post)

		httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		
		//On définit la fonction a appeler quand la requete arrive
		httpRequest.onreadystatechange = function (){
			if(httpRequest.readyState === 4 && httpRequest.status === 201){ //si la requete est satisfaite entierement et la réponse est bien recue
			
			rep=httpRequest.responseText  //Extraire le contenu de la réponse
			resp = JSON.parse(httpRequest.responseText);  //Parser Json en tableau js appelé resp (tableau d'objets)

			id = resp[0]["id"];  //récupérer l'id du 1er objet
			doInsert(id, nom, prenom, points); //Insérer la ligne (appeler la fonction do insert)
			persons.push({id, nom, prenom, points});	 //Ajouter un objet au tableau d'objets persons
			}

		};

        //Récupérer les valeurs insérées
		var data = "valNom="+nom
					+"&valPrenom="+prenom
					+"&valPoints="+points; 
		httpRequest.send(data); 
		
		//mettre a 0 les valeurs 
		elt_nom.value = "";
		elt_prenom.value = "";
		elt_points.value = "";
			
	}
}


function doInsert(id,nom, prenom, points){	

	lignes++;
	//num = lignes;
	total_points = total_points + points;

									
	doInsertRowTable(id, nom, prenom, points);				
	
	update_summary();
}



//Pour ajouter une ligne!
function doInsertRowTable(id, nom, prenom, points){
	

	const table = document.getElementsByTagName("table")[0];
	

	row = document.createElement("tr");
	

	row.setAttribute("class", "row");

	col1 = document.createElement("td");
	col2 = document.createElement("td");
	col3 = document.createElement("td");
	col4 = document.createElement("td");
	col5 = document.createElement("td");
	col6 = document.createElement("td");
	
	var btnEdit = document.createElement("button"); 
	btnEdit.innerText = "Edit"; 
	btnEdit.onclick = function(){  //Définir que fait le boutton edit
		editRow(btnEdit); //appele la fonction editrow qui permettera de modifier (réinsérer une ligne a la place d'une autre)
	}

	col1.innerText = id;
	col2.innerText = nom;
	col3.innerText = prenom;	
	col4.innerText = points;
	chbox = document.createElement("input");
	chbox.setAttribute("type", "checkbox");
	col5.append(chbox);
	col6.append(btnEdit);
		
	col1.setAttribute("class", "col_number");
	col2.setAttribute("class", "col_text");	
	col3.setAttribute("class", "col_text");
	col4.setAttribute("class", "col_number");	
	col5.setAttribute("class", "col_chkbox");	
	col6.setAttribute("class", "col_edit");	

	row.append(col1);
	row.append(col2);
	row.append(col3);
	row.append(col4);
	row.append(col5);
	row.append(col6);	
	
	
	table.append(row);
}



function update_summary(){	


	element_lignes = document.getElementById("p1");
	element_points = document.getElementById("p3");
	element_lignes.innerText = lignes+" ligne(s)";
	element_points.innerText = "Total point(s)= "+total_points;
}

function editRow(btnEdit){
	document.getElementById("form_edit_container").hidden=false;

	document.getElementById("form_container").hidden=true;

	tr = btnEdit.parentNode.parentNode;

	td_id  	= 	tr.childNodes[0];
	td_nom  = 	tr.childNodes[1];
	td_prenom  = tr.childNodes[2];
	td_points  = tr.childNodes[3];

	elt_id   = document.getElementById("form_edit_id");
	elt_nom   = document.getElementById("form_edit_nom");
	elt_prenom   = document.getElementById("form_edit_prenom");
	elt_points   = document.getElementById("form_edit_points");

	elt_id.value  = td_id.innerText
	elt_nom.value  = td_nom.innerText
	elt_prenom.value  = td_prenom.innerText
	elt_points.value  = td_points.innerText

}


function consoleTableau(){
	console.log(persons);
}


function deleteRow(){
	if(lignes==0){
		alert("Tableau déja vide !"); 
	}else{ 
		table = document.getElementsByTagName("table")[0]; 
		chkbox_list = table.querySelectorAll(".col_chkbox input"); 
		isOneChecked=false; 
		for(let i=0; i<chkbox_list.length; i++){
			 	
			if(chkbox_list[i].checked)  
				isOneChecked = true;
				
				  
		}
		if(isOneChecked==false) 
			alert("Sélectionnez au moins une ligne !"); 
		else{ 
				if (confirm('Voulez-vous vraiment supprimer les lignes ?')) { 
				
				table = document.getElementsByTagName("table")[0]; 
				rows = table.getElementsByClassName("row"); 
				let i=0;
				while(i<rows.length){ 
					if(rows[i].childNodes[4].firstChild.checked){ 
						total_points = total_points - parseInt(rows[i].childNodes[3].innerText);
						id = parseInt(rows[i].firstChild.innerText);
						deletePerson(id);
						lignes--;
						rows[i].remove();						
						persons.splice(i,1);
						i--;						
					}	
					i++;
				}
				alert("Ligne supprimée avec succés !");				
				update_summary();				
			}
		}
	}
}



function actualiser(){
	getPersons();
}






//Permet la suppression d'une ligne !
function deletePerson(id)
{
	httpRequest = new XMLHttpRequest();
	httpRequest.open('DELETE','/api/persons/'+id);
	httpRequest.onreadystatechange=deleteRow;
	httpRequest.send();
}






function annulerEdit(){
	document.getElementById("form_edit_container").hidden=true;

	document.getElementById("form_container").hidden=false;
}


  //Pour modifier une ligne (updateperson())
function doEditData(){
	elt_id   		= 	document.getElementById("form_edit_id");
	elt_nom   		= 	document.getElementById("form_edit_nom");
	elt_prenom   	= 	document.getElementById("form_edit_prenom");
	elt_points   	= 	document.getElementById("form_edit_points");

	id  = elt_id.value;
	nom = elt_nom.value;
	prenom = elt_prenom.value;
	points = parseInt(elt_points.value);

	if(nom=="" || prenom=="" || Number.isNaN(points))
		alert("Formulaire incomplet !")
	else{
		httpRequest = new XMLHttpRequest();
		httpRequest.open("put" , "api/persons/"+id);  //hahi updateperson() hna
		httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

		httpRequest.onreadystatechange = actualiser;

		var data = "valNom="+nom
					+"&valPrenom="+prenom
					+"&valPoints="+points;
		httpRequest.send(data);

		elt_nom.value= "";
		elt_prenom.value="";
		elt_points.value="";

		document.getElementById("form_edit_container").hidden=true;

		document.getElementById("form_container").hidden=false;
	}

}

function trier() {
	const table = document.getElementsByTagName("table");
	const rows = Array.from(document.getElementsByTagName("tr"));
	elt_points = document.getElementById("form_points");

    sort(rows)
   
   
}
