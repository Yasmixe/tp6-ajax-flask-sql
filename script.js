function getData() {
    // La logique AJAX
    // Instanciation de l'objet XMLHttpRequest
    httpRequest = new XMLHttpRequest();

    httpRequest.open('GET', '/getData');
    httpRequest.onreadystatechange = doAfficherData;

    httpRequest.send();
    console.log("fefefffebonjour");
}


function doAfficherData() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            reponse = httpRequest.responseText;
            persons = JSON.parse(reponse);
            table = createTable();
            for (person of persons) {
                insertRow(person, table);
                console.log("bonjour");
            }
            document.body.append(table);
        } else {
            alert('Petit souci');
        }
    }
}

function createTable() {
   
    table = document.createElement("table");
    console.log("marcheeee");
    table.setAttribute("border", 1);
    row = document.createElement("tr");

    th_id = document.createElement("th");
    th_nom = document.createElement("th");
    th_prenom = document.createElement("th");
    th_points = document.createElement("th");

    th_id.innerText = "id";
    th_nom.innerText = "nom";
    th_prenom.innerText = "prenom";
    th_points.innerText = "points";
    row.append(th_id);
    row.append(th_nom);
    row.append(th_prenom);
    row.append(th_points);
    table.append(row);
    console.log("salut salut");
    return table;
}

function insertRow(person, table) {
    row = document.createElement("tr");
    td_id = document.createElement("td");
    td_nom = document.createElement("td");
    td_prenom = document.createElement("td");
    td_points = document.createElement("td");
    console.log("caca")
    td_id.innerText = person["id"];
    td_nom.innerText = person["nom"];
    td_prenom.innerText = person["prenom"];
    td_points.innerText = person["points"];

    row.append(td_id);
    row.append(td_nom);
    row.append(td_prenom);
    row.append(td_points);
    table.append(row);
}


function actualiser()
{
    getPersons();
}

function getData() {
    // La logique AJAX
    // Instanciation de l'objet XMLHttpRequest
    httpRequest = new XMLHttpRequest();

    httpRequest.open('GET', '/api/persons');
    httpRequest.onreadystatechange = doAfficherPersons;

    httpRequest.send();
    console.log("fefefffebonjour");
}
function addline(table, numero, nom, prenom, points){
    const newRow = table.insertRow(-1); // -1: on insere la ligne f la fin ta3 le tableau 
    // 0 : f debut
    const Numberr = newRow.insertCell(0);
    Numberr.innerHTML = numero;
    const Name = newRow.insertCell(1);
    Name.innerHTML = nom;
    const secondname = newRow.insertCell(2);
    secondname.innerHTML = prenom;
    const Points = newRow.insertCell(3);
    Points.innerHTML = points;
    const Select = newRow.insertCell(4);
    Select.innerHTML = '<input type="checkbox" name="check" id="">';

}
function doAfficherPersons() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            reponse = httpRequest.responseText;
            persons = JSON.parse(reponse);
            for (person in persons){
                addline(person.id, person.nom, person.prenom, person.points);
            }
        }
        else{
            alert("petit soucis");
        }
    
}
    }