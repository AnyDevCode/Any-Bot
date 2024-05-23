import { CommandTypes, CommandOptions } from '../../utils/utils';
import moment from 'moment';
import voucher_codes from 'voucher-code-generator';
import ms from 'ms';

const types = [
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "lifetime"
]

let command: CommandOptions = {
    name: "gencode",
    aliases: ["gen"],
    type: CommandTypes.Owner,
    ownerOnly: true,
    async run(message, args, client) {
    let codes = [];

    let [ plan, count, expires, usages ]: string[] | number[] = args;

    if(!plan) plan = "monthly";
    if(!count) count = "1";
    if(!expires) expires = "30d"; 
    if(!usages) usages = "1";
    usages = parseInt(usages);

    let amount = parseInt(count)
    expires = ms(expires);

    if(!types.includes(plan)) plan = "monthly";

    for(let i = 0; i < amount; i++) {
        let codePremium  = voucher_codes.generate({
            pattern: "######-######-######-######-######-######"
        });

        if(await client.database.premiumCodes.get(codePremium[0])) {
            i--;
            continue;
        } else {
            await client.database.premiumCodes.create(codePremium[0], plan, new Date(new Date().getTime() + expires), usages);
            codes.push(codePremium[0]);
        }
    }

    message.reply({
        content:  `\`\`\`Generated +${codes.length}\n\n--------\n${codes.join(
            "\n"
          )}\n--------\n\nType - ${plan}\nExpires - ${moment(new Date(new Date().getTime() + expires)).format(
            "dddd, MMMM Do YYYY" || "Never"
            )}\n\`\`\``
    });

    }
}



export = command;



    