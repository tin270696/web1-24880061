const API = "https://web1-api.vercel.app/api";
const AUTHENTICATE_API = "https://web1-api.vercel.app/users";

const loadData = async (req, templateId, viewId) => {
    const response = await fetch(`${API}/${req}`);
    const data = await response.json();

    var source = document.getElementById(templateId).innerHTML;
    var template = Handlebars.compile(source);
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
    if(result.status == 200) {
        return result.token;
    }
    throw new Error(result.message);
}