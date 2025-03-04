import * as mathjs from 'mathjs';


export const calculando_K=(
    P_,
    Q)=>{
    const K= P_/Q;
    return K;
        
}
export const calculando_Q = (
    den_arena_,
    den_mar_,
    indice_,
    coeficiente_,
    altura_,
    angulo_,
    aceleracion_)=>{

    const N = (den_mar_ * mathjs.sqrt(aceleracion_));
    const D= 16 * mathjs.sqrt(indice_) * (den_arena_- den_mar_) * (1-coeficiente_);

    

    if ( D===0 ){
        console.log("LA division por 0 no permitida")
    }else{
       const Q= ( N / D ) * mathjs.sqrt(mathjs.pow(altura_,5))*mathjs.sin(2*angulo_);
       if(Q=== 0){
        console.log("LA division por 0 no permitida")
       }
       else{
       return Q;
       
       }
    }
    }
    