import {IChatEntryMetadata, IStatisticsProcessor} from "../types";

interface TotalCharacterCountStatistic {
    totalCharacters: number,
    totalBytes: number,
    totalWords: number,
}

export class TotalCharacterCountStatisticsProcessor implements IStatisticsProcessor<TotalCharacterCountStatistic> {
    private totalCharacters: number = 0;
    private totalBytes: number = 0;
    private totalWords: number = 0;


    process(chatEntry: IChatEntryMetadata): void {
        this.totalCharacters += chatEntry.text.length
        this.totalWords += chatEntry.text.split(' ').length;
        this.totalBytes += chatEntry.text.length * 8 // 8 bytes per char
    }

    result(): { name: string; data: TotalCharacterCountStatistic } {
        return {
            data: {
                totalCharacters: this.totalCharacters,
                totalBytes: this.totalBytes,
                totalWords: this.totalWords,
            }, name: "TotalCharacterCountStatistic"};
    }

}