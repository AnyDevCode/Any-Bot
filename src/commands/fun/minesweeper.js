const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

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
	  
  const choices = ["||:zero:||", "||:one:||", "||:two:||", "||:three:||", "||:four:||", "||:five:||", "||:six:||", "||:seven:||", "||:eight:||","||:bomb:||"]; // Array of choices
  const number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Values of the board 
  const bomb = 9; // Value of the bomb
  let bombas =  args[0] || 20; // Number of bombs

  if (bombas > 64) return this.sendErrorMessage(message, 0, 'The maximum number of bombs is 64.');
  
  let row = number[Math.floor(Math.random() * number.length)];  // Random number in the board
  let column = number[Math.floor(Math.random() * number.length)]; // Random number in the board

      const buscaminas = new Array(10); // Array of the board

  for (let i = 0; i < 10; i++){
    buscaminas[i]=new Array(10); //Make a bidimensional array
  }

  for (let i = 0; i<10; i++){
    for (let j = 0; j<10 ;j++){
      buscaminas[i][j] = 0;		//Fill the array with 0 in the two dimensions
    }
  }
  while (bombas !== 0) {  // While there are bombs
    while(buscaminas[row][column]===9){ // If the cell is a bomb
        row = number[Math.floor(Math.random() * number.length)]; 
        column = number[Math.floor(Math.random() * number.length)];
    }
    //If the cell is a bomb, the value is 9
    bombas = bombas-1;
    buscaminas[row][column] = 9;

    // look at the position of the bomb to increase the value of the adjacent squares if they are not bombs.
    
     let iteri = 3; //Number of cells per row to iterate

		for (let i = 0; i < iteri; i++) {
			let iterj = 3; //Number of cells per column to iterate
			if (row === 0 && i === 0)
				i++; ///If the bomb is in the first row, the loop will start in the second row
			if (row === 10 - 1 && i === 0)
				iteri--; //If the bomb is in the last row, the loop will end in the second last row
			for (let j = 0; j < iterj; j++) {
				if (column === 0 && j === 0)
					j++; ///If the bomb is in the first column, the loop will start in the second column
				if (column === 10 - 1 && j === 0)
					iterj--;//If the bomb is in the last column, the loop will end in the second last column
				if (i !== 1 || j !== 1)//if the bomb is not in the first row and first column
					if (buscaminas[row + i - 1][column - 1 + j] !== bomb) //If the cell is not a bomb
						buscaminas[row + i - 1][column - 1 + j]++; //Increase the value of the cell
			}
		}
      
    }
  
   //Create the board
  for (let i = 0; i<10; i++){
    for (let j = 0; j<10;j++){
        buscaminas[i][j] = choices[buscaminas[i][j]];
    }
  }



  const embed = new MessageEmbed()
  .setTitle('Minesweeper')
  .setDescription(buscaminas.join('\n').replace(/,/g, ''))
  .setColor(message.guild.me.displayHexColor)
  .setTimestamp()
  return message.channel.send({embeds: [embed]});
  
  }
};
