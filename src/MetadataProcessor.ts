import {IChatEntryMetadata, IMetadataProcessor} from "./types";
import {chatLineHeader} from "./regexp";

export class MetadataProcessor implements IMetadataProcessor {

    private parseDateTime(dateString: string, timeString: string): Date | null {
        try {
            const dateSplit = dateString.split('/');
            const timeSplit = timeString.split(':');

            const [
                day, month, year, hour, minute, second
            ] = [...dateSplit, ...timeSplit].map(v => parseInt(v, 10))

            const resultDate = new Date();

            resultDate.setUTCDate(day);
            resultDate.setUTCMonth(month - 1);
            resultDate.setUTCFullYear(year);
            resultDate.setUTCHours(hour);
            resultDate.setUTCMinutes(minute);
            resultDate.setUTCSeconds(second);
            resultDate.setUTCMilliseconds(0)

            return resultDate
        } catch {
            // TODO Handle this
            return null
        }
    }

    public process(chatEntry: string): IChatEntryMetadata | null {

        const result = chatLineHeader.exec(chatEntry);

        if(!result) {
            return null
        }

        const [_, rawDate, rawTime, participant, text] = result

        const date = this.parseDateTime(rawDate, rawTime);

        if(!date) {
            return null
        }

        return {
            date,
            raw: chatEntry,
            participantName: participant,
            text
        };
    }

}