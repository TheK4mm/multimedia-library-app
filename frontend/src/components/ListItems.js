import React, { useState, useEffect } from "react";
import API from "../services/api";

function ListItems({ editItem, setView }){

const [items, setItems] = useState([]);
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("Todos");

useEffect(() => {
loadItems();
}, []);

const loadItems = async () => {
const res = await API.get("/items");
setItems(res.data);
};

const deleteItem = async (id) => {
await API.delete(`/items/${id}`);
loadItems();
};

const getIcon = (tipo) => {

if (tipo === "Libro") return "📚";
if (tipo === "Película") return "🎬";
if (tipo === "Música") return "🎵";

return "📦";

};

const filtered = items.filter(item => {

const titulo = (item.titulo || "").toLowerCase();
const tipo = (item.tipo || "").toLowerCase();
const texto = search.toLowerCase();

const matchSearch =
titulo.includes(texto) ||
tipo.includes(texto);

const matchFilter =
filter === "Todos" || item.tipo === filter;

return matchSearch && matchFilter;

});

return (

<div className="card-items">

{/* TÍTULO */}

<h2 className="catalog-title">
Biblioteca Multimedia
</h2>

{/* PANEL DE ESTADÍSTICAS */}

{search === "" && (

<div className="stats-panel">

<div className="stat-box">
📚 Libros
<span>{items.filter(i => i.tipo === "Libro").length}</span>
</div>

<div className="stat-box">
🎬 Películas
<span>{items.filter(i => i.tipo === "Película").length}</span>
</div>

<div className="stat-box">
🎵 Música
<span>{items.filter(i => i.tipo === "Música").length}</span>
</div>

</div>

)}

{/* BUSCADOR */}

<input
className="search-box"
placeholder="🔎 Buscar en el catálogo..."
value={search}
onChange={(e) => setSearch(e.target.value)}
/>

{/* FILTROS */}

{search === "" && (

<div className="filter-panel">

<button onClick={() => setFilter("Todos")}>
Todos
</button>

<button onClick={() => setFilter("Libro")}>
📚 Libros
</button>

<button onClick={() => setFilter("Película")}>
🎬 Películas
</button>

<button onClick={() => setFilter("Música")}>
🎵 Música
</button>

</div>

)}

{/* BOTONES DE NAVEGACIÓN */}

{search === "" && (

<div className="catalog-nav">

<button
className="nav-button"
onClick={()=>setView("menu")}
>
⬅ Volver al menú
</button>

<button
className="nav-button"
onClick={()=>setView("add")}
>
➕ Agregar Item
</button>

</div>

)}

{/* CONTADOR DE RESULTADOS */}

{search !== "" && (
<p className="results-count">
Mostrando {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
</p>
)}

{/* CATÁLOGO */}

{filtered.length === 0 ? (

<div className="no-results">

<div className="no-results-icon">
</div>

<h3>No se encontraron resultados</h3>

<p>
Intenta buscar otro título o cambia el filtro
</p>

</div>

) : (

<div className="catalog-grid">

{filtered.map(item => (

<div key={item.id} className="catalog-card">

<div className="catalog-icon">
{getIcon(item.tipo)}
</div>

<h3 className="catalog-title-item">
{item.titulo || "Sin título"}
</h3>

<p className="catalog-type">
Tipo: {item.tipo}
</p>

<div className="catalog-actions">

<button onClick={() => editItem(item)}>
Editar
</button>

<button onClick={() => deleteItem(item.id)}>
Eliminar
</button>

</div>

</div>

))}

</div>

)}

</div>

);

}

export default ListItems;