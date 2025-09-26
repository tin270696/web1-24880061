const API = "https://web1-api.vercel.app/api";

const dataLoad = async (req, templateId, viewId) => {
    const response = await fetch(`${API}/${req}`);
    const data = await response.json();

    var source = document.getElementById(templateId).innerHTML;
    var template = Handlebars.compile(source);
    var context = { data: data };
    var view = document.querySelector(viewId);
    view.innerHTML = template(context);
}