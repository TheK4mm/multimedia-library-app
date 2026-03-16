import React, { useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Menu from "./components/Menu";
import AddItem from "./components/AddItem";
import ListItems from "./components/ListItems";
import EditItem from "./components/EditItem";

function App(){

const [logged,setLogged] = useState(false);
const [view,setView] = useState("login");
const [itemToEdit,setItemToEdit] = useState(null);

/* LOGIN Y REGISTRO */

if(!logged){

if(view==="login"){
return <Login setLogged={setLogged} setView={setView}/>
}

if(view==="register"){
return <Register setView={setView}/>
}

}

/* APLICACIÓN */

return(

<div className="app-container">

{view==="menu" &&
<Menu setView={setView}/>
}

{view==="list" &&
<ListItems
setView={setView}
editItem={(item)=>{
setItemToEdit(item);
setView("edit");
}}
/>
}

{view==="add" &&
<AddItem
refresh={()=>setView("list")}
setView={setView}
/>
}

{view==="edit" &&
<EditItem
item={itemToEdit}
refresh={()=>setView("list")}
setView={setView}
/>
}

</div>

);

}

export default App;