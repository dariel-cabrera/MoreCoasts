const nombre =  "Fernando";
const apellido= "Herrea";

// const nombreCompleto= nombre +''+apellido; 

// const nombreCompleto=`Hola Mundo`;

//Template String
// Se puede esccribir codigo de Javascript 
const nombreCompleto=`${nombre}${apellido}${1+1}`;
console.log(nombreCompleto)

function getSaludo(){
    return 'Hola Mundo';
}

console.log(`Este es un texto ${getSaludo()}`);