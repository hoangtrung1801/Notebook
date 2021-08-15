function postForm(params, ConfirmMessage, path, method, targett) {
  if (typeof ConfirmMessage != 'undefined' && ConfirmMessage) {
    if (!confirm(ConfirmMessage)) {
      return;
    }
  }
  method = method || "POST";
  path = path || "";
  targett = targett || "";
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);
  form.setAttribute("target", targett);
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var f = document.createElement("input");
      f.setAttribute("type", "hidden");
      f.setAttribute("name", key);
      f.setAttribute("value", params[key]);
      form.appendChild(f);
    }
  }
  document.body.appendChild(form);
  form.submit();
}

const newPage = document.querySelector('.sidebar-new-page')

newPage.addEventListener('click', () => {
  postForm({}, '', '/', 'post');
})


window.onbeforeprint = (e) => {
  confirm('save ? ');
}