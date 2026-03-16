import React from "react";

function Menu({ setView }){

return(

<div className="card-menu">

<h1>Biblioteca Multimedia</h1>

<p className="menu-subtitle">
Gestiona libros, películas y música en un solo catálogo digital
</p>

<button onClick={()=>setView("list")}>
📚 Ver Catálogo
</button>

<div className="menu-categories">

<div>
📚
<p>Libros</p>
</div>

<div>
🎬
<p>Películas</p>
</div>

<div>
🎵
<p>Música</p>
</div>

</div>

</div>

);

}

export default Menu;