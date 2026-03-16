import React, { useState } from "react";
import API from "../services/api";

function AddItem({ refresh, setView }) {

  const [titulo,setTitulo] = useState("");
  const [tipo,setTipo] = useState("");
  const [autor,setAutor] = useState("");
  const [anio,setAnio] = useState("");
  const [genero,setGenero] = useState("");

  const addItem = async () => {

    await API.post("/items",{
      titulo,
      tipo,
      autor,
      anio,
      genero
    });

    alert("Item agregado");

    refresh();

  };

  return(

    <div className="card">

      <button
      className="back-button"
      onClick={()=>setView("list")}
      >
      ⬅ Volver al catálogo
      </button>

      <input
      placeholder="Título"
      onChange={(e)=>setTitulo(e.target.value)}
      />

      <input
      placeholder="Tipo (Libro/Película/Música)"
      onChange={(e)=>setTipo(e.target.value)}
      />

      <input
      placeholder="Autor"
      onChange={(e)=>setAutor(e.target.value)}
      />

      <input
      placeholder="Año"
      onChange={(e)=>setAnio(e.target.value)}
      />

      <input
      placeholder="Género"
      onChange={(e)=>setGenero(e.target.value)}
      />

      <button onClick={addItem}>
        Guardar
      </button>

    </div>

  );

}

export default AddItem;