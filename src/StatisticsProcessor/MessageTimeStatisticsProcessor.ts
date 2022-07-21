import {Average, IChatEntryMetadata, IStatisticsProcessor} from "../types";
import {getAverage} from "../getAverage";

interface MessageTimeStatistic {
    histogram: Array<number>
}

export class MessageTimeStatisticsProcessor implements IStatisticsProcessor<MessageTimeStatistic> {
    private histogram: Array<number> = (new Array(24)).fill(0, 0, 24)

    /**
     * assume messages are passed in chronological order
     */
    process(chatEntry: IChatEntryMetadata): void {
        const hour = chatEntry.date.getUTCHours();
        this.histogram[hour]++
    }

    result(): { name: string; data: MessageTimeStatistic } {
        return {
            data: {
                histogram: this.histogram,
            }, name: "MessageTimeStatistic"};
    }

}