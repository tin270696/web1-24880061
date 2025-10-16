const API = "https://web1-api.vercel.app/api";
const AUTHENTICATE_API = "https://web1-api.vercel.app/users";

const loadData = async (req, templateId, viewId) => {
    const response = await fetch(`${API}/${req}`);
    const data = await response.json();

    // var source = document.getElementById(templateId).innerHTML;
    // var template = Handlebars.compile(source);
    var template = Handlebars.templates[`${templateId}.hbs`];
    var context = { data: data };
    var view = document.getElementById(viewId);
    view.innerHTML = template(context);
}

const getAuthenticateToken = async (username, password) => {
    const response = await fetch(`${AUTHENTICATE_API}/authenticate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({username, password})
    });
    const result = await response.json();
    if(response.status == 200) {
        return result.token;
    }
    throw new Error(result.message);
}

const login = async (e) => {
    e.preventDefault();

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    document.querySelector('#errorMessage').innerHTML = '';

    try {
        const token = await getAuthenticateToken(username, password);
        if(token) {
            localStorage.setItem('token', token);
            document.querySelector('#modal-login .btn-close').click();
            displayControls();
        }
    } catch (error) {
        document.querySelector('#errorMessage').innerHTML = error;
        displayControls(false);
    }
}

const displayControls = (isLogin = true) => {
    const linkLogins = document.querySelectorAll('.linkLogin');
    const linkLogouts = document.querySelectorAll('.linkLogout');

    let displayLogin = 'none';
    let displayLogout = 'block';
    if(!isLogin) {
        displayLogin = 'block';
        displayLogout = 'none';
    }
    for(let i = 0; i < 2; i++) {
        linkLogins[i].style.display = displayLogin;
        linkLogouts[i].style.display = displayLogout;
    }

    const leaveComment = document.querySelector("#leave-comment");
    if(leaveComment) {
        leaveComment.style.display = displayLogout;
    }
}

const checkLogin = async () => {
    const isLogin = await verifyToken();
    displayControls(isLogin);
}

const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        const response = await fetch(`${AUTHENTICATE_API}/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": 'Bearer ' + token
            }
        })
        if(response.status == 200) {
            return true;
        }
    }
    return false;
}

const logout = () => {
    localStorage.clear();
    displayControls(false);
}