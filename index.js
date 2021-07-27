$('.sortable').nestedSortable({
    handle: 'div',
    items: 'li',
    toleranceElement: '> div'
  });

$('.sortable').nestedSortable({
    // Set this to true to lock the parentship of items. 
    // They can only be re-ordered within theire current parent container.
    disableParentChange: false,
    // Set this to true if you don't want empty lists to be removed.
    doNotClear: false,
    // How long (in ms) to wait before expanding a collapsed node 
    // useful only if isTree: true
    expandOnHover: 700,
    // You can specify a custom function to verify if a drop location is allowed. 
    isAllowed: function() { return true; },  
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
    disabledClass: "mjs-nestedSortable-disabled"
    
    });
    

    function agregar(){
        let htmlprincipal = $('#principal')[0].innerHTML;
        $('#principal')[0].innerHTML = htmlprincipal + 
        '<li>'+
            '<div class="contenido d-flex align-items-center">'+
                '<h6 class="mx-3">Enlace</h6>'+
                '<select class="">'+
                    '<option>Enlace personalizado</option>'+
                '</select>'+
            '</div>'+
        '</li>';
    }

    function selectMenus() {
        $.ajax({
            url: "http://localhost:82/Menus/selectMenus.php",
            success: function (res) {
                let menus = JSON.parse(res);
                menus.forEach(e =>
                    $('#eligeMenu')[0].innerHTML = $('#eligeMenu')[0].innerHTML + '<option value="'+e.id+'">'+e.nomMenu+'</option>'
                );
                
            },
        });
    }
    selectMenus();

    function eligeMenu(e){
        let selec = $("option:selected")[0];
        $("#nomMenu")[0].value = selec.innerText;
        console.log(selec);
        selectHijosMenus(selec.value)
        console.log(selec.value);

    }

    function selectHijosMenus(id){
        $.ajax({
            data: {id: id},
            type: "POST",
            url: "http://localhost:82/Menus/selectHijosMenu.php",
            success: function (res) {
                let menus = JSON.parse(res);
                console.log(menus);
                let principal = document.getElementById('principal');
                principal.innerHTML = "";
                let lista = document.createElement("li");
                let div = document.createElement("div");
                div.innerText = menus[0].Menu;
                div.classList.add("contenido");
                div.classList.add("ui-sortable-handle");
                lista.appendChild(div);
                principal.appendChild(lista)
                let listaordenada; 
                let nodoPadre = lista;
                let nivelActual = 0;
                console.log(nodoPadre);
                for(let i = 1; i < menus.length; i++){
                    if(menus[i].Nivel > nivelActual){
                        listaordenada = document.createElement("ol");
                        lista = document.createElement("li");
                        div = document.createElement("div");
                        div.innerText = menus[i].Menu; 
                        div.classList.add("contenido");
                        div.classList.add("ui-sortable-handle");
                        lista.appendChild(div);
                        listaordenada.appendChild(lista);
                        nodoPadre.appendChild(listaordenada);
                        nodoPadre = lista;
                    }else if(menus[i].Nivel < nivelActual){
                        for(let j = nivelActual; j > menus[i].Nivel; j--){
                            nodoPadre = nodoPadre.parentNode.parentNode;
                        }
                        lista = document.createElement("li");
                        div = document.createElement("div");
                        div.innerText = menus[i].Menu;
                        div.classList.add("contenido");
                        div.classList.add("ui-sortable-handle");
                        lista.appendChild(div);
                        nodoPadre.appendChild(lista);
                    }else{
                        lista = document.createElement("li");
                        div = document.createElement("div");
                        div.innerText = menus[i].Menu;
                        div.classList.add("contenido");
                        div.classList.add("ui-sortable-handle");
                        lista.appendChild(div);
                        nodoPadre.appendChild(lista);
                    }
                    nivelActual = menus[i].Nivel;
                }
            },
        });
    }

    var root = document.getElementById('principal');
    var nivel = 0;
		 // obtener la etiqueta raíz html
 
		function forDom(root, nivel){
			/* showNode(root); */
			 // La salida aquí es el nodo raíz
			var children = root.children;
			 // Obtener los dos nodos secundarios cabeza y cuerpo del nodo raíz
			forChildren(children,nivel);
			 // Encuentra recursivamente todos los nodos debajo de estos dos hijos
		}
		 // Obtenga el pseudo-array del nodo hijo y entréguelo a lo siguiente
 
		function forChildren(children,nivel){
            for(var i=0; i<children.length; i++){
            	var child = children[i];

                showNode(child,nivel); 
                                // nombre del nodo secundario de salida
 
                child.children && forDom(child,nivel+1);
                                 // determina si el nodo secundario tiene nodos secundarios, si hay una operación para continuar atravesando el nodo, esta también es una condición de aborto recursivo
                                 // aquí se usa la recursión
            }
		}
		 // Iterar a través de la pseudo matriz compuesta por los nodos obtenidos anteriormente, y juzgar si hay nodos hijos uno por uno. Si hay alguno, ejecute la función anterior para formar recursividad
        let dicc = [];
		function showNode(node,nivel){
            let nivelNodo;
            if(node.tagName==="LI" || node.tagName==="OL"){
                if(node.tagName!="OL"){
                    nivelNodo = nivel
                    if(nivelNodo>0){
                        nivelNodo = nivelNodo/2;
                        dicc.push({'elemento': node, 'nivel':nivelNodo});
                    }else{
                        dicc.push({'elemento': node, 'nivel':nivel});
                    }
                    console.log (node,nivelNodo);           
                }           
            } 
		}
		forDom(root,nivel);
		 // Atraviesa el árbol dom desde el nodo raíz