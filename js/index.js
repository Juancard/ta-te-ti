var jugador = "X";
var maquina = "O";
var comienzaJugador=maquina;
var turno=comienzaJugador;
var noMarcar=false;
var enJuego=false;
var nombrePosiciones=new Array(3);
var posiciones;
var movimientos=0;

$(document).ready(function(){
	setearNombrePosiciones();
	setearJuego();
	$(".clickeable").on('click',function(){
		if (enJuego && !$("#"+$(this).attr('id')).hasClass("bloqueado")){
			marcarCasillero(this);
			movimientos++;
			marcarPosicionPorNombre(this.id);
			chequearGanador();
			if (enJuego){
				turno=maquina;
				juegaMaquina();
			}
		}
	});
});

function resetearPosiciones(){
	posiciones=new Array(3);
	for (i = 0; i < 3; i++){
		posiciones[i]=new Array(3);
	}
}

function marcarCasillero(casillero){
	$(casillero).html("<p>"+turno+"</p>");
	$(casillero).addClass("bloqueado");
}

function setMarca(m){
	if (m=="X"){
		(comienzaJugador==jugador)? comienzaJugador="X" : comienzaJugador="O";
		jugador=m;
		maquina="O";
	}else if(m=="O"){
		(comienzaJugador==jugador)? comienzaJugador="O" : comienzaJugador="X";
		jugador=m;
		maquina="X";
	}
	setearJuego();
	turno=jugador;
}

function setJugador(j){
	if (j=="jugador"){
		console.log(j);
		comienzaJugador = jugador;
	}else if (j=="maquina"){
		console.log(j);
		comienzaJugador = maquina;
	}
	setearJuego();
}

function setearJuego(){
	$(".clickeable").html("");
	$(".clickeable").removeClass('bloqueado').removeClass("casilleroGanador");
	resetearPosiciones();
	movimientos = 0;
	if (comienzaJugador==maquina){
		turno=maquina;
		juegaMaquina();
	} else{
		turno=jugador;
	}
	enJuego=true;
}

function setearNombrePosiciones(){
	for (var i=0; i<=2; i++){
		nombrePosiciones[i]=new Array(3);
		for (var j=0; j<=2; j++){
	nombrePosiciones[i][j]="row"+(i+1)+"_"+"col"+(j+1);
		}
	}
}

function juegaMaquina(){
	turnoMaquina();
	movimientos++;
	chequearGanador();
	turno = jugador;
}

function turnoMaquina(){
	
	if (movimientos<=1 && posiciones[1][1]!=jugador){
		// parche
			var fila,columna;
			if (movimientos==0){
				fila=Math.floor((Math.random() * 3));
				columna=Math.floor((Math.random() * 3));
			}else{
				fila=1;
				columna=1;
			}
			marcarCasillero("#"+nombrePosiciones[fila][columna]);
			posiciones[fila][columna]=turno;
			console.log("maquina:",fila,columna);
	} else{
		var mov = minimax(2,turno);
		marcarCasillero("#"+nombrePosiciones[mov[1]][mov[2]]);
		posiciones[mov[1]][mov[2]]=turno;
		console.log("maquina:",mov[1],mov[2]);
	}
}

function minimax(nivel,turno){
	var listaMovimientos = generarMovimientos();
	var puntajeActual;
	var mejorPuntaje = (turno==jugador) ? 100000 : -100000;
	var filaMejor = -1;
	var columnaMejor = -1;
	
	if (listaMovimientos.length<=0 || nivel == 0){
		mejorPuntaje = evaluarPuntaje();
	}else{
		listaMovimientos.forEach(function(mov){
			posiciones[mov[0]][mov[1]]=turno;
			if (turno == maquina){
				puntajeActual = minimax(nivel-1,jugador)[0];
				if (puntajeActual > mejorPuntaje){
					mejorPuntaje = puntajeActual;
					filaMejor = mov[0];
					columnaMejor = mov[1];
				}
			} else if (turno == jugador){
				puntajeActual = minimax(nivel-1,jugador)[0];
				if (puntajeActual < mejorPuntaje){
					mejorPuntaje = puntajeActual;
					filaMejor = mov[0];
					columnaMejor = mov[1];
				}
			}
			posiciones[mov[0]][mov[1]]="";
		});
	}
	return [mejorPuntaje,filaMejor,columnaMejor];
}

function evaluarPuntaje(){
	var puntaje = 0;
	puntaje += evaluarLinea(0, 0, 0, 1, 0, 2);  // fila 0
	puntaje += evaluarLinea(1, 0, 1, 1, 1, 2);  // fila 1
	puntaje += evaluarLinea(2, 0, 2, 1, 2, 2);  // fila 2
	puntaje += evaluarLinea(0, 0, 1, 0, 2, 0);  // col 0
	puntaje += evaluarLinea(0, 1, 1, 1, 2, 1);  // col 1
	puntaje += evaluarLinea(0, 2, 1, 2, 2, 2);  // col 2
	puntaje += evaluarLinea(0, 0, 1, 1, 2, 2);  // diagonal
	puntaje += evaluarLinea(0, 2, 1, 1, 2, 0);  // otra diagonal
	return puntaje;
}

function evaluarLinea(){
	var puntaje = 0;
	
	// Primera fila:
	if (posiciones[arguments[0]][arguments[1]] == maquina) {
		puntaje = 1;
	} else if (posiciones[arguments[0]][arguments[1]] == jugador) {
		puntaje = -1;
	}
	// Segunda Fila
	if (posiciones[arguments[2]][arguments[3]] == maquina) {
		if (puntaje == 1) {   // fila1 es de maquina
			puntaje = 10;
		} else if (puntaje == -1) {  // fila1 es de jugador
			return 0;
		} else {  // fila1 esta vacia
			puntaje = 1;
		}
	} else if (posiciones[arguments[2]][arguments[3]] == jugador) {
		if (puntaje == -1) { // fila1 es de jugador
			puntaje = -10;
		} else if (puntaje == 1) { // // fila1 es de maquina
			return 0;
		} else {  // fila1 esta vacia
			puntaje = -1;
		}
	}
	// Tercera Fila
	if (posiciones[arguments[4]][arguments[5]] == maquina) {
		if (puntaje > 0) {  // fila1 y/o fila2 es de maquina
			puntaje *= 10;
		} else if (puntaje < 0) {  // fila1 y/o fila2 es de jugador
			return 0;
		} else {  // fila1 y fila2 estan vacias.
			puntaje = 1;
		}
	} else if (posiciones[arguments[4]][arguments[5]] == jugador) {
		if (puntaje < 0) {  // fila1 y/o fila2 es de jugador
			puntaje *= 10;
		} else if (puntaje > 1) {  // fila1 y/o fila2 es de maquina
			return 0;
		} else {  //fila1 y fila2 estan vacias.
			puntaje = -1;
		}
	}
	return puntaje;
}

function generarMovimientos(){
	var lista=[];
	noMarcar=true;
	chequearGanador();
	noMarcar=false;
	if (!enJuego){
		return lista;
	}else{
		for (var i=0; i<posiciones.length; i++){
			for (var j=0; j<posiciones.length; j++){
				if (posiciones[i][j] != jugador && posiciones[i][j] != maquina){
					lista.push([i,j]);
				}
			}
		}
	}
	return lista;
}

function marcarPosicionPorNombre(nombre){
		for (var i=0; i<=2; i++){
			for (var j=0; j<=2; j++){
				if (nombrePosiciones[i][j]==nombre){
					posiciones[i][j]=turno;		
					console.log("jugador:",i,j)
				}
		}
	}
}

function chequearGanador(){
	if (posiciones[0][0]==turno && posiciones[0][1]==turno && posiciones[0][2]==turno){
		marcarGanador([nombrePosiciones[0][0],nombrePosiciones[0][1],nombrePosiciones[0][2]])
		enJuego=false;		
		setTimeout(setearJuego,1000);
	}else if (posiciones[0][0]==turno && posiciones[1][0]==turno && posiciones[2][0]==turno){
		marcarGanador([nombrePosiciones[0][0],nombrePosiciones[1][0],nombrePosiciones[2][0]])
		enJuego=false;		
		setTimeout(setearJuego,1000);
	}else if (posiciones[0][0]==turno && posiciones[1][1]==turno && posiciones[2][2]==turno){
		marcarGanador([nombrePosiciones[0][0],nombrePosiciones[1][1],nombrePosiciones[2][2]])
		enJuego=false;		
		setTimeout(setearJuego,1000);
	}else if (posiciones[0][0]==turno && posiciones[1][0]==turno && posiciones[2][0]==turno){
		marcarGanador([nombrePosiciones[0][0],nombrePosiciones[1][0],nombrePosiciones[2][0]])
		enJuego=false;		
		setTimeout(setearJuego,1000);
	}else if (posiciones[0][1]==turno && posiciones[1][1]==turno && posiciones[2][1]==turno){
		marcarGanador([nombrePosiciones[0][1],nombrePosiciones[1][1],nombrePosiciones[2][1]])
		enJuego=false;		
		setTimeout(setearJuego,1000);
	}else if (posiciones[0][2]==turno && posiciones[1][2]==turno && posiciones[2][2]==turno){
		marcarGanador([nombrePosiciones[0][2],nombrePosiciones[1][2],nombrePosiciones[2][2]])
		enJuego=false;		
		setTimeout(setearJuego,1000);
	}else if (posiciones[0][2]==turno && posiciones[1][1]==turno && posiciones[2][0]==turno){
		marcarGanador([nombrePosiciones[0][2],nombrePosiciones[1][1],nombrePosiciones[2][0]])
		enJuego=false;		
		setTimeout(setearJuego,1000);
	}else if (posiciones[1][0]==turno && posiciones[1][1]==turno && posiciones[1][2]==turno){
		marcarGanador([nombrePosiciones[1][0],nombrePosiciones[1][1],nombrePosiciones[1][2]])
		enJuego=false;		
		setTimeout(setearJuego,1000);
	}else if (posiciones[2][0]==turno && posiciones[2][1]==turno && posiciones[2][2]==turno){
		marcarGanador([nombrePosiciones[2][0],nombrePosiciones[2][1],nombrePosiciones[2][2]])
		enJuego=false;		
		setTimeout(setearJuego,1000);
	}else{
		chequearEmpate();
	}
}

function marcarGanador(linea){
	console.log(linea);
	if (noMarcar==false){
		for (var i=0; i<linea.length; i++){
			$("#"+linea[i]).addClass("casilleroGanador");
		}
	}
}

function chequearEmpate(){
	if (movimientos==9){
		enJuego=false;
		setTimeout(setearJuego,1000);
	}
}

/*
function turnoMaquinaRandom(){
	var marcado=false;
	chequearGanador();
	while (marcado==false && enJuego){
		var i=Math.floor((Math.random() * 3));
		var j=Math.floor((Math.random() * 3));
		if (posiciones[i][j]!=jugador && posiciones[i][j]!=maquina){
			console.log("maquina:",i,j);
			posiciones[i][j]=turno;
			marcarCasillero("#"+nombrePosiciones[i][j]);
			marcado=true;
		}
	}	
}

function turnoMaquinaBasica(){
	
		//Elije el primer movimiento del arreglo movimientos
		//que no este ocupado en el tablero.
		//Estrategia básica, poco eficiente.

	listaMov = [[1, 1], [0, 0], [0, 2], [2, 0], [2, 2],[0, 1], [1, 0], [1, 2], [2, 1]];
	chequearGanador();
	if (enJuego){
		for (var i=0; i<listaMov.length; i++){
			var fila = listaMov[i][0];
			var columna = listaMov[i][1];
			if (posiciones[fila][columna]!=jugador && posiciones[fila][columna]!=maquina){
				posiciones[fila][columna]=turno;
				marcarCasillero("#"+nombrePosiciones[fila][columna]);
				console.log("maquina:",fila,columna);
				break;
			}
		}	
	}
	
}
*/