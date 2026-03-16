import React, {useState} from "react";
import API from "../services/api";

function Login({ setView, setLogged }){

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const login = async () => {

try{

const res = await API.post("/auth/login",{
username,
password
});

if(res.data.success){

setLogged(true);
setView("menu");

}

}catch{

alert("Credenciales incorrectas");

}

};

return(

<div className="login-wrapper">

<div className="login-card">

<h1 className="login-title">
Iniciar sesión
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

<button className="login-button" onClick={login}>
Ingresar
</button>

<button
className="register-link"
onClick={()=>setView("register")}
>
Crear cuenta
</button>

</div>

</div>

);

}

export default Login;