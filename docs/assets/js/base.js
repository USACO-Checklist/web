var API_URL = "http://49.234.36.140";
// var API_URL = "http://127.0.0.1:8000"

$(document).ready(function () {
    $(".nav-item").filter(function () {
        return window.location.href === this.href
    }).addClass("active");
});


function init_nav() {
    $.ajax({
        type: "GET",
        url: API_URL + "/auth/current-user",
        xhrFields: {
            withCredentials: true
        },
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
        },
        success: function (response) {
            $(".variable-content").children().last().remove();
            $(".share-list").children().last().remove();
            if (response['status'] == 1) {
                $(".variable-content").append('<div class="col col-md-4" style="display: flex; justify-content: center;">\n' +
                    '                <a class="nav-item nav-link disabled">Welcome, </a>\n' +
                    '                <div class="nav-item dropdown">\n' +
                    '                    <a class="nav-link dropdown-toggle" href="#" role="button" id="dropdown-username"\n' +
                    '                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
                    '                        <i class="fa fa-user"></i>\n' +
                    '                    </a>\n' +
                    '                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">\n' +
                    '                        <a class="dropdown-item" id="nav-sync-usaco" href="/sync-usaco"><i\n' +
                    '                                class="fa fa-refresh"></i>&nbsp;Sync USACO Data</a>\n' +
                    '                        <a class="dropdown-item" id="nav-change-password" href="/change-password"><i\n' +
                    '                                class="fa fa-edit"></i>&nbsp;Change Password</a>\n' +
                    '                        <a id="logout-link" class="dropdown-item" href="#" onclick="logout();"><i class="fa fa-sign-out"></i>&nbsp;Log\n' +
                    '                            Out</a>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '            </div>');
                $(".share-list").append('<div class="input-group">\n' +
                    '            <input type="text" class="form-control" readonly="" id="static-link" aria-describedby="what"\n' +
                    '                   value="">\n' +
                    '            <div class="input-group-append">\n' +
                    '                <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"\n' +
                    '                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
                    '                    <span class="sr-only">Toggle Dropdown</span>\n' +
                    '                </button>\n' +
                    '                <div class="dropdown-menu dropdown-menu-right">\n' +
                    '                    <a class="dropdown-item" id="view-share-link" href=""><i\n' +
                    '                            class="fa fa-eye"></i>&nbsp;View</a>\n' +
                    '                    <a class="dropdown-item" onclick="copylink()"><i class="fa fa-copy"></i>&nbsp;Copy</a>\n' +
                    '                </div>\n' +
                    '\n' +
                    '            </div>\n' +
                    '        </div>')
                localStorage.setItem('username', response['username']);
                localStorage.setItem('uuid', response['uuid']);
            } else {
                $(".variable-content").append('<div class="col col-md-4" style="display: flex; justify-content: center">\n' +
                    '                <a class="nav-item nav-link" id="nav-login" href="/login"><i\n' +
                    '                        class="fa fa-sign-in"></i>&nbsp;Login</a>\n' +
                    '                <a class="nav-item nav-link" id="nav-signup" href="/signup"><i class="fa fa-user-plus"></i>&nbsp;Sign\n' +
                    '                    Up</a>\n' +
                    '            </div>');
                $(".share-list").append('<div class="input-group">\n' +
                    '            <input type="text" class="form-control" readonly="" value="Log in to share">\n' +
                    '            <div class="input-group-append">\n' +
                    '                <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"\n' +
                    '                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
                    '                    <span class="sr-only">Toggle Dropdown</span>\n' +
                    '                </button>\n' +
                    '                <div class="dropdown-menu dropdown-menu-right">\n' +
                    '                    <a class="dropdown-item" href="/login"><i class="fa fa-sign-in"></i>&nbsp;Login</a>\n' +
                    '                    <a class="dropdown-item" href="/signup"><i class="fa fa-user-plus"></i>&nbsp;Sign Up</a>\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '        </div>');
                localStorage.setItem('username', 'Guest');
                localStorage.setItem('uuid', null);
            }
            localStorage.setItem('isLoggedIn', response['status']);

            var dropdownUser = $("#dropdown-username");
            dropdownUser.text('\xa0' + response['username']);
            dropdownUser.prepend('<i class="fa fa-user"></i>');

            if (window.location.pathname == '/problems') {
                init();
            }
        },
        error: function (response) {
            var errors = $.parseJSON(response.responseText);
            $.each(errors, function (key, value) {
                displayNotification('danger', value);
            });
        },
    });
}


function logout() {
    // localStorage.clear()
    console.log('test');
    $.ajax({
        type: "POST",
        url: API_URL + "/auth/logout-user",
        xhrFields: {
            withCredentials: true
        },
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
        },
        success: function () {
            localStorage.removeItem("access_token");
            window.location.assign('/');
            console.log('logged out!');
        },
        error: function (response) {
            var errors = $.parseJSON(response.responseText);
            $.each(errors, function (key, value) {
                displayNotification('danger', value);
            });
        },
    });
}

function displayNotification(type, content) {
    $("#notification-box").append(
        '<div class= "alert alert-' + type + ' fade show">' + content +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button></div>'
    );
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};