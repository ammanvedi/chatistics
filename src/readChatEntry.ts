import * as fs from 'fs';
import * as readLine from 'readline'
import {chatLineHeader} from "./regexp";
import {LineHandler} from "./types";

export const readChatEntry = async (path: string, lineHandler: LineHandler): Promise<void> => {
    try {

        let lineBuffer: string = '';

        const rl = readLine.createInterface({
            input: fs.createReadStream(path),
            crlfDelay: Infinity
        })

        for await (const line of rl) {

            /**
             * Remove unicode left to right hidden character from strings
             * https://util.unicode.org/UnicodeJsps/character.jsp?a=200E&B1=Show
             */
            const sanitisedLine = line.replace(/\u200e/g, '');

            if(!sanitisedLine) {
                continue;
            }

            const headerFound = chatLineHeader.test(sanitisedLine)

            if(headerFound && lineBuffer) {
                /**
                 * Flush the current line buffer, this is because chat entries can span multiple lines
                 * we don't know when the end of the line is until we reach the next one
                 */
                await lineHandler(lineBuffer);
                lineBuffer = sanitisedLine;
                continue;
            }
            lineBuffer += (lineBuffer ? ' ' : '') + sanitisedLine;
        }

        if(lineBuffer) {
            await lineHandler(lineBuffer);
        }

    } catch (e) {
        console.log(e)
        // TODO Handle this
    }
}

