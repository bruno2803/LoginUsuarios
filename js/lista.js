document.addEventListener("DOMContentLoaded", function() {
    cargarListaUsuarios();

    var searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", function() {
        var searchText = document.getElementById("search-input").value;
        buscarUsuario(searchText);
    });
});

function cargarListaUsuarios() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://168.194.207.98:8081/tp/lista.php?action=BUSCAR", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var listaUsuarios = JSON.parse(xhr.responseText);
                mostrarLista(listaUsuarios);
            } else {
                console.error("Error al obtener la lista de usuarios.");
            }
        }
    };
    xhr.send();
}

function buscarUsuario(textoBusqueda) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://168.194.207.98:8081/tp/lista.php?action=BUSCAR&usuario=" + encodeURIComponent(textoBusqueda), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var resultadoBusqueda = JSON.parse(xhr.responseText);
                if (resultadoBusqueda.length > 0) {
                    mostrarLista(resultadoBusqueda);
                } else {
                    mostrarMensaje("No se encontraron resultados.");
                }
            } else {
                console.error("Error al realizar la búsqueda.");
            }
        }
    };
    xhr.send();
}

function mostrarLista(listaUsuarios) {
    var listaGrid = document.getElementById("lista-grid");
    listaGrid.innerHTML = ""; 

    var table = document.createElement("table");

    var headerRow = document.createElement("tr");
    for (var key in listaUsuarios[0]) {
        if (listaUsuarios[0].hasOwnProperty(key)) {
            var th = document.createElement("th");
            th.textContent = key.toUpperCase();
            headerRow.appendChild(th);
        }
    }

    var bloquearHeader = document.createElement("th");
    bloquearHeader.textContent = "BLOQUEAR";
    headerRow.appendChild(bloquearHeader);

    var desbloquearHeader = document.createElement("th");
    desbloquearHeader.textContent = "DESBLOQUEAR";
    headerRow.appendChild(desbloquearHeader);

    table.appendChild(headerRow);

    listaUsuarios.forEach(function(usuario) {
        var row = document.createElement("tr");
        for (var key in usuario) {
            if (usuario.hasOwnProperty(key)) {
                var cell = document.createElement("td");
                cell.textContent = usuario[key];
                row.appendChild(cell);
            }
        }

        var bloquearCell = document.createElement("td");
        var bloquearBtn = document.createElement("button");
        bloquearBtn.className = "bloquear-btn";
        bloquearBtn.innerHTML = '<img src="images/bloq.png" alt="Bloquear" width="20" height="20">';
        bloquearBtn.addEventListener("click", function() {
            bloquearUsuario(usuario.id, function() {
                cargarListaUsuarios(); 
            });
        });
        bloquearCell.appendChild(bloquearBtn);
        row.appendChild(bloquearCell);

        var desbloquearCell = document.createElement("td");
        var desbloquearBtn = document.createElement("button");
        desbloquearBtn.className = "desbloquear-btn";
        desbloquearBtn.innerHTML = '<img src="images/desbloq.png" alt="Desbloquear" width="20" height="20">';
        desbloquearBtn.addEventListener("click", function() {
            desbloquearUsuario(usuario.id, function() {
                cargarListaUsuarios();
            });
        });
        desbloquearCell.appendChild(desbloquearBtn);
        row.appendChild(desbloquearCell);

        row.classList.add(usuario.bloqueado === "Y" ? "bloqueado-si" : "bloqueado-no");
        table.appendChild(row);
    });

    listaGrid.appendChild(table);
}

function mostrarMensaje(mensaje) {
    var listaGrid = document.getElementById("lista-grid");
    listaGrid.innerHTML = "<p>" + mensaje + "</p>";
}

function bloquearUsuario(idUsuario) {
    enviarSolicitud("BLOQUEAR", idUsuario, "Y", function() {
        var searchText = document.getElementById("search-input").value;
        buscarUsuario(searchText);
    });
}

function desbloquearUsuario(idUsuario) {
    enviarSolicitud("BLOQUEAR", idUsuario, "N", function() {
        var searchText = document.getElementById("search-input").value;
        buscarUsuario(searchText);
    });
}

function enviarSolicitud(accion, idUsuario, estado, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://168.194.207.98:8081/tp/lista.php?action=" + accion + "&idUser=" + idUsuario + "&estado=" + estado, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (typeof callback === "function") {
                    callback();
                }
            } else {
                console.error("Error al procesar la solicitud.");
            }
        }
    };
    xhr.send();
}
