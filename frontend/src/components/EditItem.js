import React, { useState } from "react";
import API from "../services/api";

function EditItem({ item, refresh, setView }) {

  const [titulo,setTitulo] = useState(item.titulo);
  const [tipo,setTipo] = useState(item.tipo);
  const [autor,setAutor] = useState(item.autor);
  const [anio,setAnio] = useState(item.anio);
  const [genero,setGenero] = useState(item.genero);

  const updateItem = async () => {

    await API.put("/items/" + item.id,{
      titulo,
      tipo,
      autor,
      anio,
      genero
    });

    alert("Item actualizado");

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
      value={titulo}
      onChange={(e)=>setTitulo(e.target.value)}
      />

      <input
      value={tipo}
      onChange={(e)=>setTipo(e.target.value)}
      />

      <input
      value={autor}
      onChange={(e)=>setAutor(e.target.value)}
      />

      <input
      value={anio}
      onChange={(e)=>setAnio(e.target.value)}
      />

      <input
      value={genero}
      onChange={(e)=>setGenero(e.target.value)}
      />

      <button onClick={updateItem}>
        Actualizar
      </button>

    </div>

  );

}

export default EditItem;