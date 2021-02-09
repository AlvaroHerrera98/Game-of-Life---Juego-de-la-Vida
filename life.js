const rows = 60;
const cols = 60;
//Actual Generacion
let aGen =[rows]; 
//Proxima Generacion
let pGen =[rows]; 

let started=false;
let timer;
let evolutionSpeed=1000;

//Matrices para guarda la generacion actual y futura
function GenArrays() {
    for (let i = 0; i < rows; i++) {
        aGen[i] = new Array(cols);
        pGen[i] = new Array(cols);
    }
}
function dGenArrays() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            aGen[i][j] = 0;
            pGen[i][j] = 0;
        }
    }
}

//Generador de la Tabla
function World() {
    let world = document.querySelector('#world');
    
    let tbl = document.createElement('table');
    tbl.setAttribute('id','worldgrid');
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            let celula = document.createElement('td');
            celula.setAttribute('id', i + '_' + j);
            celula.setAttribute('class', 'muerto');   
            celula.addEventListener('click',celulaClick);
            tr.appendChild(celula);
        }
        tbl.appendChild(tr);
    }
    world.appendChild(tbl);
}

//Cambio de estado entre vivo o muerto
function celulaClick() {
    let loc = this.id.split("_");
    let row = Number(loc[0]);
    let col = Number(loc[1]);

    if (this.className==='vivo'){
        this.setAttribute('class', 'muerto');
        aGen[row][col] = 0;
       
    }else{
        this.setAttribute('class', 'vivo');
        aGen[row][col]=1;
    }
}

//Cuenta la cantidad de vecinos con la posicion
function cuentaVecinos(row, col) {
    let count = 0;
    let nrow=Number(row);
    let ncol=Number(col);
  
 // Asegurando que el vecino no esta arriba
 if (nrow - 1 >= 0) {
    if (aGen[nrow - 1][ncol] == 1) 
        count++;
}
 // Asegurando que el vecino no esta en la fila de arriba a la izquierda
 if (nrow - 1 >= 0 && ncol - 1 >= 0) {
    if (aGen[nrow - 1][ncol - 1] == 1) 
        count++;
}
 // Asegurando que el vecino no esta en la fila de arriba a la derecha
 if (nrow - 1 >= 0 && ncol + 1 < cols) {
        if (aGen[nrow - 1][ncol + 1] == 1) 
            count++;
    }
 // // Asegurando que el vecino no esta en la columna a la izquierda
 if (ncol - 1 >= 0) {
    if (aGen[nrow][ncol - 1] == 1) 
        count++;
}
 // Asegurando que el vecino no esta en la columna a la derecha
 if (ncol + 1 < cols) {
    if (aGen[nrow][ncol + 1] == 1) 
        count++;
}
 // Asegurando que el vecino no esta en la fila de abajo a la izquierda
 if (nrow + 1 < rows && ncol - 1 >= 0) {
    if (aGen[nrow + 1][ncol - 1] == 1) 
        count++;
}
 //Asegurando que el vecino no esta en la fila de abajo a la derecha
 if (nrow + 1 < rows && ncol + 1 < cols) {
    if (aGen[nrow + 1][ncol + 1] == 1) 
        count++;
}
 // Asegurando que el vecino no esta abajo
 if (nrow + 1 < rows) {
    if (aGen[nrow + 1][ncol] == 1) 
        count++;
}
return count;
}

//Creacion de la proxima Generacion
function genP() {
    for (row in aGen) {
        for (col in aGen[row]) {
           
            let vecinos = cuentaVecinos(row, col);
         
            // Verifica las reglas para ver si esta vivo
            if (aGen[row][col] == 1) {
                if (vecinos < 2) {
                    pGen[row][col] = 0;
                } else if (vecinos == 2 || vecinos == 3) {
                    pGen[row][col] = 1;
                } else if (vecinos > 3) {
                    pGen[row][col] = 0;
                }
            //En el caso de que este muerto o vacio
            } else if (aGen[row][col] == 0) {
                if (vecinos == 3) {
                    //Incremento de la poblacion
                    pGen[row][col] = 1;
                }
            }
        }
    }
    
}
//Actualiza la generacion actual
function genA() {
       
    for (row in aGen) {
        for (col in aGen[row]) {
            // Actualiza la generación actual con los resultados de 
            //la función pGen
            aGen[row][col] = pGen[row][col];
            // Establece pGen de nuevo a vacío
            pGen[row][col] = 0;
        }
    }
 
}
//Actualiza la tabla
function updateWorld() {
    let celula='';
    for (row in aGen) {
        for (col in aGen[row]) {
            celula = document.getElementById(row + '_' + col);
            if (aGen[row][col] == 0) {
                celula.setAttribute('class', 'muerto');
            } else {
                celula.setAttribute('class', 'vivo');
            }
        }
    }
}
//Hace el cambio de las generaciones y nos muestra un 
//modal cuando muere toda la poblacion
function evolucion(){
      
    genP();
    genA();
    updateWorld();
    let count = 0
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++){
            if(document.getElementById(i+"_"+j).className=="vivo"){
                count++;
            }
        }
    }
    if(count==0){
        $("#alertModal").modal('show');
        document.getElementById("btclose").addEventListener('click',btnReinicio,false);
        document.getElementById("btclose1").addEventListener('click',btnReinicio,false);

                    
    }

    if (started) {
        timer = setTimeout(evolucion, evolutionSpeed);
    }
}

//Comienza el juego
function btnComienzo(){
    let startstop=document.querySelector('#btnstartstop');
   
    if (!started) {
       started = true;
       startstop.value='Pausa Reproducion';
       evolucion();
     
     } else {
        started = false;
        startstop.value='Comienza Reproducion';
        clearTimeout(timer); 
    }
}

//Reinicia el Juego
function btnReinicio() {
    location.reload();
}

//Visualizacion de la Tabla y de las Generaciones
window.onload=()=>{
    World();
    GenArrays();
    dGenArrays();
}
