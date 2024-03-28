document.addEventListener("DOMContentLoaded", function() {
    var loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        var url = "http://168.194.207.98:8081/tp/login.php?user=" + encodeURIComponent(username) + "&pass=" + encodeURIComponent(password);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    alert(response.mje);
                    if (response.respuesta === "OK") {
                        window.location.href = "lista.html";
                    }
                } else {
                    alert("Error al realizar la solicitud.");
                }
            }
        };
        xhr.send();
    });
});
