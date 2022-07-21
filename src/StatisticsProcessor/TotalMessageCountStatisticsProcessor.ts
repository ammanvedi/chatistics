import {IChatEntryMetadata, IStatisticsProcessor} from "../types";

interface TotalMessagesStatistic {
    total: number,
    perParticipant: Record<string, number>
}

export class TotalMessageCountStatisticsProcessor implements IStatisticsProcessor<TotalMessagesStatistic> {
    private total: number = 0;
    private perParticipant: TotalMessagesStatistic['perParticipant'] = {};

    process(chatEntry: IChatEntryMetadata): void {
        this.total++;

        if(!this.perParticipant[chatEntry.participantName]) {
            this.perParticipant[chatEntry.participantName] = 0;
        }

        this.perParticipant[chatEntry.participantName]++;
    }

    result(): { name: string; data: TotalMessagesStatistic } {
        return {
            data: {
                total: this.total,
                perParticipant: this.perParticipant
            }, name: "TotalMessagesStatistic"};
    }

}