$(".sortable").nestedSortable({
  handle: "div",
  items: "li",
  toleranceElement: "> div",
});

$(".sortable").nestedSortable({
  // Set this to true to lock the parentship of items.
  // They can only be re-ordered within theire current parent container.
  disableParentChange: false,
  // Set this to true if you don't want empty lists to be removed.
  doNotClear: false,
  // How long (in ms) to wait before expanding a collapsed node
  // useful only if isTree: true
  expandOnHover: 700,
  // You can specify a custom function to verify if a drop location is allowed.
  isAllowed: function () {
    return true;
  },
  // Set this to true if you want to use the new tree functionality.
  isTree: false,
  // The list type used (ordered or unordered).
  listType: "ol",
  // The maximum depth of nested items the list can accept.
  maxLevels: 0,
  // Whether to protect the root level
  protectRoot: false,
  // The id given to the root element
  rootID: null,
  // Set this to true if you have a right-to-left page.
  rtl: false,
  // Set this to true if you want the plugin to collapse the tree on page load
  startCollapsed: false,
  // How far right or left (in pixels) the item has to travel in order to be nested or to be sent outside its current list.
  tabSize: 20,
  // custom classes
  branchClass: "mjs-nestedSortable-branch",
  collapsedClass: "mjs-nestedSortable-collapsed",
  disableNestingClass: "mjs-nestedSortable-no-nesting",
  errorClass: "mjs-nestedSortable-error",
  expandedClass: "mjs-nestedSortable-expanded",
  hoveringClass: "mjs-nestedSortable-hovering",
  leafClass: "mjs-nestedSortable-leaf",
  disabledClass: "mjs-nestedSortable-disabled",
});

function agregar() {
  let htmlprincipal = $("#principal")[0].innerHTML;
  $("#principal")[0].innerHTML =
    htmlprincipal +
    "<li>" +
    '<div class="contenido d-flex align-items-center">' +
    '<h6 class="mx-3">' +
    $("#textourl")[0].value +
    "</h6>" +
    "<span>" +
    $("#url")[0].value +
    "</span>" +
    "</div>" +
    "</li>";
}

function selectMenus() {
  $.ajax({
    url: "http://localhost:82/Menus/selectMenus.php",
    success: function (res) {
      $("#eligeMenu")[0].innerHTML =
        '<option class="" value="-1" selected>Elige...</option>';
      let menus = JSON.parse(res);
      menus.forEach(
        (e) =>
          ($("#eligeMenu")[0].innerHTML =
            $("#eligeMenu")[0].innerHTML +
            '<option value="' +
            e.id +
            '">' +
            e.nomMenu +
            "</option>")
      );
    },
  });
}
selectMenus();

function eligeMenu(e) {
  let selec = $("option:selected")[0];
  $("#nomMenu")[0].value = selec.innerText;
  selectHijosMenus(selec.value);
}

function selectHijosMenus(id) {
  $.ajax({
    data: { id: id },
    type: "POST",
    url: "http://localhost:82/Menus/selectHijosMenu.php",
    success: function (res) {
      let principal = document.getElementById("principal");
      principal.innerHTML = "";
      if (res != 0) {
        let menus = JSON.parse(res);
        let lista = document.createElement("li");
        let div = document.createElement("div");
        let h6 = document.createElement("h6");
        h6.innerText = menus[0].Menu;
        let span = document.createElement("span");
        span.innerText = menus[0].Enlace;
        div.appendChild(h6);
        div.appendChild(span);
        div.classList.add("contenido");
        div.classList.add("ui-sortable-handle");
        lista.appendChild(div);
        principal.appendChild(lista);
        let listaordenada;
        let nodoPadre = principal;
        let nivelActual = 0;
        for (let i = 1; i < menus.length; i++) {
          if (menus[i].Nivel > nivelActual) {
            nodoPadre = lista;
            listaordenada = document.createElement("ol");
            lista = document.createElement("li");
            div = document.createElement("div");
            h6 = document.createElement("h6");
            h6.innerText = menus[i].Menu;
            span = document.createElement("span");
            span.innerText = menus[i].Enlace;
            div.appendChild(h6);
            div.appendChild(span);
            div.classList.add("contenido");
            div.classList.add("ui-sortable-handle");
            lista.appendChild(div);
            listaordenada.appendChild(lista);
            nodoPadre.appendChild(listaordenada);
            nodoPadre = listaordenada;
          } else if (menus[i].Nivel < nivelActual) {
            for (let j = nivelActual; j > menus[i].Nivel; j--) {
              nodoPadre = nodoPadre.parentNode.parentNode;
            }
            lista = document.createElement("li");
            div = document.createElement("div");
            h6 = document.createElement("h6");
            h6.innerText = menus[i].Menu;
            span = document.createElement("span");
            span.innerText = menus[i].Enlace;
            div.appendChild(h6);
            div.appendChild(span);
            div.classList.add("contenido");
            div.classList.add("ui-sortable-handle");
            lista.appendChild(div);
            nodoPadre.appendChild(lista);
          } else {
            lista = document.createElement("li");
            div = document.createElement("div");
            h6 = document.createElement("h6");
            h6.innerText = menus[i].Menu;
            span = document.createElement("span");
            span.innerText = menus[i].Enlace;
            div.appendChild(h6);
            div.appendChild(span);
            div.classList.add("contenido");
            div.classList.add("ui-sortable-handle");
            lista.appendChild(div);
            nodoPadre.appendChild(lista);
          }
          nivelActual = menus[i].Nivel;
        }
      }
    },
  });
}

function guardarMenu() {
  let selec = $("option:selected")[0];
  let id = selec.value;
  borrarMenu(id);
}

function llenarFormMenu(node, nivelNodo) {
  let selec = $("option:selected")[0];
  $("#idM")[0].value = selec.value;
  $("#Menu")[0].value = node.childNodes[0].childNodes[0].innerText;
  $("#Enlace")[0].value = node.childNodes[0].childNodes[1].innerText;
  $("#Nivel")[0].value = nivelNodo;
  insertMenus();
}

function insertMenus() {
  $.ajax({
    type: "POST",
    data: $("#formMenu").serialize(),
    url: "http://localhost:82/Menus/guardarMenu.php",
  });
}

function borrarMenu(id) {
  $.ajax({
    type: "POST",
    data: { id: id },
    url: "http://localhost:82/Menus/borrarMenu.php",
    success: function (res) {
      let root = document.getElementById("principal");
      let nivel = 0;

      function forDom(root, nivel) {
        let children = root.children;
        forChildren(children, nivel);
      }

      function forChildren(children, nivel) {
        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          showNode(child, nivel);
          child.children && forDom(child, nivel + 1);
        }
      }

      let dicc = [];
      function showNode(node, nivel) {
        let nivelNodo;
        if (node.tagName === "LI" || node.tagName === "OL") {
          if (node.tagName != "OL") {
            nivelNodo = nivel;
            if (nivelNodo > 0) {
              nivelNodo = Math.round(nivelNodo / 2);
              dicc.push({ elemento: node, nivel: nivelNodo });
            } else {
              dicc.push({ elemento: node, nivel: nivel });
            }
            llenarFormMenu(node, nivelNodo);
          }
        }
      }
      forDom(root, nivel);
    },
  });
}

function agregarMenu() {
  let usuario = $("#usuarioMenu")[0].value;
  let nombreMenu = $("#nombreMenu")[0].value;
  let fecha = new Date();
  $.ajax({
    type: "POST",
    data: { nomMenu: nombreMenu, Usuario: usuario, Fecha: fecha },
    url: "http://localhost:82/Menus/agregarMenu.php",
    success: function (res) {
      selectMenus();
      $("#usuarioMenu")[0].value = "";
      $("#nombreMenu")[0].value = "";
    },
  });
}
