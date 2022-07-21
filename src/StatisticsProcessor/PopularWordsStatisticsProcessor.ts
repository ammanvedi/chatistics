import {Average, IChatEntryMetadata, IStatisticsProcessor} from "../types";
import {getAverage} from "../getAverage";
import {stopWords} from "../stopWords";

interface PopularWordsStatistic {
    words: Array<{
        word: string,
        total: number,
        participantCount: Record<string, number>
    }>,
    byParticipant: Record<string, Array<{
        word: string,
        total: number
    }>>
}

export class PopularWordsStatisticsProcessor implements IStatisticsProcessor<PopularWordsStatistic> {
    private words: Map<string, {
        total: number,
        participantCount: Record<string, number>
    }> = new Map()

    /**
     * Structure as map, we can do O(1) lookups instead of iterating through a list
     * each time
     */
    private static ignoreList: Map<string, boolean> = new Map(
        stopWords.map(w => ([w, true]))
    )

    /**
     * assume messages are passed in chronological order
     */
    process(chatEntry: IChatEntryMetadata): void {
        const tokens = chatEntry.text.split(' ').filter(w => {
                return !PopularWordsStatisticsProcessor.ignoreList.has(w)
        });

        tokens.forEach(t => {
            const currentData = this.words.get(t) || {
                participantCount: {},
                total: 0
            }

            const newData = {
                ...currentData,
                total: currentData.total + 1,
                participantCount: {
                    ...currentData.participantCount,
                    [chatEntry.participantName]: (currentData.participantCount[chatEntry.participantName] || 0) + 1
                }
            }

            this.words.set(t, newData)

        })
    }

    private getOverallRanking(): PopularWordsStatistic['words'] {
        const asArray = Array.from(this.words.entries())
        const sorted = asArray.sort((a, b) => {
            return b[1].total - a[1].total
        }).slice(0, 30)
        return sorted.map(([word, {participantCount, total}]) => ({
            word, total, participantCount
        }))
    }

    private getPerParticipantRankings(): PopularWordsStatistic['byParticipant'] {

        const participantsMap: Map<string, Map<string, number>> = new Map()

        for (const [word, count] of this.words) {
            const participantsForWord = Object.keys(count.participantCount)

            participantsForWord.forEach(p => {
                if(!participantsMap.has(p)) {
                    participantsMap.set(p, new Map())
                }

                const wordMap = participantsMap.get(p)

                wordMap.set(word, count.participantCount[p])
            })
        }

        const result: PopularWordsStatistic['byParticipant'] = {}

        for(const [participant, data] of participantsMap) {

            const participantWords = Array.from(data.entries()).map(([word, total]) => {
                return {
                    word, total
                }
            })

            result[participant] = participantWords.sort((a, b) => {
                return a.total > b.total ? -1 : 1
            }).slice(0, 30)
        }

        return result

    }

    result(): { name: string; data: PopularWordsStatistic } {

        return {
            data: {
                words: this.getOverallRanking(),
                byParticipant: this.getPerParticipantRankings()
            }, name: "PopularWordsStatistic"};
    }

}