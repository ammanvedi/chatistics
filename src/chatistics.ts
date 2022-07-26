import {AnalysisResult, IChatEntryPreprocessor, IChatisticsConfig, IStatisticsProcessor} from "./types";
import {readChatEntry} from "./readChatEntry";
import {MediaEntryExclusionPreProcessor} from "./PreProcessor/MediaEntryExclusionPreProcessor";
import {NameSanitizerPreProcessor} from "./PreProcessor/NameSanitizerPreProcessor";
import {MetadataProcessor} from "./MetadataProcessor";
import {TotalMessageCountStatisticsProcessor} from "./StatisticsProcessor/TotalMessageCountStatisticsProcessor";
import {DailyMessageCountStatisticsProcessor} from "./StatisticsProcessor/DailyMessageCountStatisticsProcessor";
import {MessageTimeStatisticsProcessor} from "./StatisticsProcessor/MessageTimeStatisticsProcessor";
import {PopularWordsStatisticsProcessor} from "./StatisticsProcessor/PopularWordsStatisticsProcessor";
import {TotalCharacterCountStatisticsProcessor} from "./StatisticsProcessor/TotalCharacterCountStatisticsProcessor";
import {MessageGapStatisticsProcessor} from "./StatisticsProcessor/MessageGapStatisticsProcessor";


export class Chatistics {

    private static getDefaultPreprocessors(): IChatEntryPreprocessor[] {
        return [
            new MediaEntryExclusionPreProcessor(),
            new NameSanitizerPreProcessor(),
        ]
    }

    private static getDefaultStatisticsProcessors(): IStatisticsProcessor<any>[] {
        return [
            new TotalMessageCountStatisticsProcessor(),
            new DailyMessageCountStatisticsProcessor(),
            new MessageTimeStatisticsProcessor(),
            new PopularWordsStatisticsProcessor(),
            new TotalCharacterCountStatisticsProcessor(),
            new MessageGapStatisticsProcessor()
        ]
    }

    private metadataProcessor = new MetadataProcessor()

    constructor(
        private config: IChatisticsConfig,
        private preProcessors = config.preProcessors || Chatistics.getDefaultPreprocessors(),
        private statisticsProcessors = config.statisticsProcessors || Chatistics.getDefaultStatisticsProcessors(),
    ) {}

    public async analyze(): Promise<AnalysisResult> {

        await readChatEntry(this.config.path, async line => {
            let metadata = this.metadataProcessor.process(line);

            if(!metadata) {
                // TODO warn here
                return;
            }

            /**
             * Run pre processing steps
             */
            for(let i = 0; i < this.preProcessors.length; i++) {
                const pp = this.preProcessors[i];

                const ppResult = pp.process(metadata)

                if(!ppResult) {
                    /**
                     * If the pre-processor returns null then we don't collect any stats about this entry
                     */
                    return;
                }

                metadata = ppResult
            }

            /**
             * Run Statistics processing steps
             */
            for(let i = 0; i < this.statisticsProcessors.length; i++) {
                const sp = this.statisticsProcessors[i];

                sp.process(metadata)
            }

        })

        const result: AnalysisResult = {
            statistics: []
        }

        for(let i = 0; i < this.statisticsProcessors.length; i++) {
            const sp = this.statisticsProcessors[i];

            result.statistics.push(sp.result())
        }

        return result;
    }
}