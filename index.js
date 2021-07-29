$(".sortable").nestedSortable({
  handle: "div",
  items: "li",
  toleranceElement: "> div",
});

$(".sortable").nestedSortable({
  disableParentChange: false,
  doNotClear: false,
  expandOnHover: 700,
  isAllowed: function () {
    return true;
  },
  isTree: false,
  listType: "ol",
  maxLevels: 0,
  protectRoot: false,
  rootID: null,
  rtl: false,
  startCollapsed: false,
  tabSize: 20,
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

//Crear el select con los menus de la base de datos
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

//Se ejecuta al cambiar de opción en el select
function eligeMenu() {
  let selec = $("option:selected")[0];
  $("#nomMenu")[0].value = selec.innerText;
  selectHijosMenus(selec.value);
}

//Al seleccionar una opcion del select se muestran los menus
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
        let lista;
        let div;
        let h6;
        let span;
        let listaordenada;
        let nodoPadre = principal;
        let nivelActual = 0;
        for (let i = 0; i < menus.length; i++) {
          div = document.createElement("div");
          h6 = document.createElement("h6");
          h6.innerText = menus[i].Menu;
          span = document.createElement("span");
          span.innerText = menus[i].Enlace;
          div.appendChild(h6);
          div.appendChild(span);
          div.classList.add("contenido");
          div.classList.add("ui-sortable-handle");
          div.classList.add("d-flex");
          div.classList.add("align-items-center");
          div.classList.add("justify-content-between");
          if (menus[i].Nivel > nivelActual) {
            nodoPadre = lista;
            listaordenada = document.createElement("ol");
            lista = document.createElement("li");
            lista.appendChild(div);
            listaordenada.appendChild(lista);
            nodoPadre.appendChild(listaordenada);
            nodoPadre = listaordenada;
          } else if (menus[i].Nivel < nivelActual) {
            for (let j = nivelActual; j > menus[i].Nivel; j--) {
              nodoPadre = nodoPadre.parentNode.parentNode;
            }
            lista = document.createElement("li");
            lista.appendChild(div);
            nodoPadre.appendChild(lista);
          } else {
            lista = document.createElement("li");
            lista.appendChild(div);
            nodoPadre.appendChild(lista);
          }
          nivelActual = menus[i].Nivel;
        }
      }
    },
  });
}

//Se ejecuta al guardar el menu
function guardarMenu() {
  let selec = $("option:selected")[0];
  let id = selec.value;
  borrarMenu(id);
}

//Obtiene la opcion seleccionada del select
function obtenerSelectMenu(dicc) {
  let selec = $("option:selected")[0];
  insertMenus(dicc, selec.value);
}

//Inserta los valores de los menus
function insertMenus(dicc, idM) {
  $.ajax({
    type: "POST",
    data: { idM: idM, arrayM: dicc },
    url: "http://localhost:82/Menus/guardarMenu.php",
    success: function (res) {
      console.log(res);
    },
  });
}

function recorridoArbolMenu() {
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

  var dicc = [];
  function showNode(node, nivel) {
    let nivelNodo;
    if (node.tagName === "LI" || node.tagName === "OL") {
      if (node.tagName != "OL") {
        nivelNodo = nivel;
        if (nivelNodo > 0) {
          nivelNodo = Math.round(nivelNodo / 2);
          dicc.push([
            node.childNodes[0].childNodes[0].innerText,
            node.childNodes[0].childNodes[1].innerText,
            nivelNodo,
          ]);
        } else {
          dicc.push([
            node.childNodes[0].childNodes[0].innerText,
            node.childNodes[0].childNodes[1].innerText,
            nivelNodo,
          ]);
        }
      }
    }
  }
  forDom(root, nivel);
  obtenerSelectMenu(dicc);
}

//Borra los menus anteriores
function borrarMenu(id) {
  $.ajax({
    type: "POST",
    data: { id: id },
    url: "http://localhost:82/Menus/borrarMenu.php",
    success: function (res) {
      recorridoArbolMenu();
    },
  });
}

function agregarMenu() {
  let nombreMenu = $("#nombreMenu")[0].value;
  let fecha = new Date();
  $.ajax({
    type: "POST",
    data: { nomMenu: nombreMenu, Fecha: fecha },
    url: "http://localhost:82/Menus/agregarMenu.php",
    success: function (res) {
      selectMenus();
      $("#nombreMenu")[0].value = "";
    },
  });
}

function keyp(event) {
  if (event.keyCode == 13) {
    agregarMenu();
  }
}

function keyp2(event) {
  if (event.keyCode == 13) {
    document.getElementById("textourl").focus();
  }
}

function keyp3(event) {
  if (event.keyCode == 13) {
    agregar();
  }
}


