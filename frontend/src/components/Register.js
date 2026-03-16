import React, { useState } from "react";
import API from "../services/api";

function Register({ setView }) {

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const register = async () => {

try{

await API.post("/auth/register",{
username,
password
});

alert("Usuario registrado correctamente");

setView("login");

}catch{

alert("Error al registrar usuario");

}

};

return(

<div className="login-wrapper">

<div className="login-card">

<h1 className="login-title">
Crear cuenta
</h1>

<input
placeholder="Usuario"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Contraseña"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="login-button" onClick={register}>
Registrarse
</button>

<button
className="register-link"
onClick={()=>setView("login")}
>
Iniciar sesión
</button>

</div>

</div>

);

}

export default Register;