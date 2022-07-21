import {Average, IChatEntryMetadata, IStatisticsProcessor} from "../types";
import {getAverage} from "../getAverage";

interface MessageGapStatistic {
    average: Average
}

export class MessageGapStatisticsProcessor implements IStatisticsProcessor<MessageGapStatistic> {
    private gaps: Array<number> = []
    lastMessageTimestamp: number | null = null

    process(chatEntry: IChatEntryMetadata): void {
        const thisTimestamp = chatEntry.date.getTime() / 1000 / 60

        if(this.lastMessageTimestamp) {
            const gap = thisTimestamp - this.lastMessageTimestamp;
            this.gaps.push(gap)
        }

        this.lastMessageTimestamp = thisTimestamp
    }

    result(): { name: string; data: MessageGapStatistic } {

        return {
            data: {
                average: getAverage(this.gaps)
            }, name: "MessageGapStatistic"};
    }

}