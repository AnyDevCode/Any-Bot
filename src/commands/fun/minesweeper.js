const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const axios = require('axios')
const translate = require('node-google-translate-skidz');

module.exports = class MinesweeperCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'minesweeper',
      aliases: ['minesp'],
      usage: 'minesweeper <number of mines>',
      description: 'Create a minesweeper.',
      examples: ['minesweeper', 'minesweeper 20'],
      type: client.types.FUN
    });
  }
  async run(message, args) {
	  
  //Cadena que da vida al buscaminsa final con los iconos ocultos
  const choices = ["||:zero:||", "||:one:||", "||:two:||", "||:three:||", "||:four:||", "||:five:||", "||:six:||", "||:seven:||", "||:eight:||","||:bomb:||"];
  const number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; //Valores que puede tomar una casilla
  const bomb = 9; //El valor 9 representa el de la mina
  let bombas =  args[0] || 20; //NUMERO DE BOMBAS - Se puede cambiar y mejorar si se quiere jugar con eso
  
  let row = number[Math.floor(Math.random() * number.length)]; //Inicializa una posicion aleatoria
  let column = number[Math.floor(Math.random() * number.length)]; //Inicializa una posicion aleatoria
  
  var buscaminas=new Array(10); //Crea un array de 10

  for (let i = 0; i < 10; i++){
    buscaminas[i]=new Array(10); //Hace que el array de antes sea bidimensional (un tablero)
  }

  for (let i = 0; i<10; i++){
    for (let j = 0; j<10 ;j++){
      buscaminas[i][j] = 0;		//Inicializamos el tablero poniendo las casillas a cero
    }
  }
  while (bombas != 0) { // Hasta que no hayamoso colocado todas la bombas no se sale
    while(buscaminas[row][column]==9){ //Cambias las posiciones si en ellas haya una bomba
        row = number[Math.floor(Math.random() * number.length)]; 
        column = number[Math.floor(Math.random() * number.length)];
    }
    //Si encuentra una casilla sin bomba, cambia su valor por el 9 (bomba) y resta una bomba al contador
      bombas = bombas-1;
      buscaminas[row][column] = 9;
      
    //Esta parte es la mÃÂ¡s liosa, pero lo que hacen los siguientes pasos es  mirar en que posicion esta la bomba para incrementar el valor de las casillas adyacentes si no son bombas.
    
     let iteri = 3; //Numero de casillas por fila para iterar 

		for (let i = 0; i < iteri; i++) {
			let iterj = 3; //Numero de casillas por columna por iterar (Se reinicia por cada fila)
			if (row == 0 && i == 0)
				i++; //Si la casilla estÃÂ¡ arriba del todo, se le aumenta el valor a la i
			if (row == 10 - 1 && i == 0)
				iteri--; //Si la casilla esta bajo del todo, las iteraciones se decrementan
			for (let j = 0; j < iterj; j++) {
				if (column == 0 && j == 0)
					j++; //Si la casilla estÃÂ¡ a la izquierda del todo, se le aumenta la j
				if (column == 10 - 1 && j == 0)
					iterj--;//Si la casilla estÃÂ¡ a la derecha del todo, se decrementan iteraciones
				if (i != 1 || j != 1)//Si no es la casilla inicial
					if (buscaminas[row + i - 1][column - 1 + j] != bomb) //Si no es una bomba
						buscaminas[row + i - 1][column - 1 + j]++; //Incrementar el valor casilla
			}
		}
      
    }
  
   //Finalmente cambiamos los nÃÂºmeros por los emojis ocultos para crear el juego
  for (let i = 0; i<10; i++){
    for (let j = 0; j<10;j++){
        buscaminas[i][j] = choices[buscaminas[i][j]];
    }
  }
  
  return message.channel.send(buscaminas);
  }
};
