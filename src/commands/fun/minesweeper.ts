import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "minesweeper",
    type: CommandTypes.Fun,
    aliases: ['minesp'],
    usage: "minesweeper <number of mines>",
    examples: ['minesweeper', 'minesweeper 20'],
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("minesweeper") || client.language.get("en")?.get("minesweeper");

        const choices = ["||:zero:||", "||:one:||", "||:two:||", "||:three:||", "||:four:||", "||:five:||", "||:six:||", "||:seven:||", "||:eight:||", "||:bomb:||"]; // Array of choices
        const number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Values of the board 
        const bomb = 9; // Value of the bomb
        let bombas = parseInt(args[0]) || 20; // Number of bombs

        if (bombas > 64) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.tooManyBombs);

        let row = number[Math.floor(Math.random() * number.length)];  // Random number in the board
        let column = number[Math.floor(Math.random() * number.length)]; // Random number in the board

        const buscaminas = new Array(10); // Array of the board

        for (let i = 0; i < 10; i++) {
            buscaminas[i] = new Array(10); //Make a bidimensional array
        }

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                buscaminas[i][j] = 0;		//Fill the array with 0 in the two dimensions
            }
        }
        while (bombas !== 0) {  // While there are bombs
            while (buscaminas[row][column] === 9) { // If the cell is a bomb
                row = number[Math.floor(Math.random() * number.length)];
                column = number[Math.floor(Math.random() * number.length)];
            }
            //If the cell is a bomb, the value is 9
            bombas = bombas - 1;
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

        let randomZero = false

        //Create the board
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (buscaminas[i][j] === 0 && !randomZero && Math.random() < 0.1) {
                    buscaminas[i][j] = choices[buscaminas[i][j]].replace('||:zero:||', ':zero:');
                    randomZero = true;
                } else buscaminas[i][j] = choices[buscaminas[i][j]];
            }
        }

        if (randomZero === false) {
            // Select the first ||:zero:||, if there is no ||:zero:||, select a random number
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (buscaminas[i][j] === '||:zero:||') {
                        buscaminas[i][j] = buscaminas[i][j].replace('||:zero:||', ':zero:');
                        randomZero = true;
                        break;
                    }
                }
                if (randomZero) break;
            }
        }

        while (randomZero === false) {
            row = number[Math.floor(Math.random() * number.length)];
            column = number[Math.floor(Math.random() * number.length)];
            if (buscaminas[row][column] !== '||:bomb:||') {
                buscaminas[row][column] = buscaminas[row][column].replace('||', '').replace('||', '');
                randomZero = true;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            .setDescription(buscaminas.join('\n').replace(/,/g, ''))
            .setColor(message.guild?.members.me?.displayHexColor || 'Random')
            .setTimestamp()
        return message.channel.send({ embeds: [embed] });
    }
}

export = command;
