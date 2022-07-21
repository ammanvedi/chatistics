import {Average, IChatEntryMetadata, IStatisticsProcessor} from "../types";
import {getAverage} from "../getAverage";

interface DailyMessageCountStatistic {
    count: Array<{date: string, total: number}>
    average: Average
}

export class DailyMessageCountStatisticsProcessor implements IStatisticsProcessor<DailyMessageCountStatistic> {
    private dates: Map<string, number> = new Map()

    /**
     * assume messages are passed in chronological order
     */
    process(chatEntry: IChatEntryMetadata): void {
        const [dateKey] = chatEntry.date.toISOString().split('T')

        this.dates.set(dateKey, (this.dates.get(dateKey) || 0) + 1)
    }

    result(): { name: string; data: DailyMessageCountStatistic } {

        const graphData = Array.from(this.dates.entries()).map(([date, total]) => {
            return {
                date,
                total
            }
        })
         const counts = graphData.map(g => g.total)

        return {
            data: {
                count: graphData,
                average: getAverage(counts)
            }, name: "DailyMessageCountStatistic"};
    }

}