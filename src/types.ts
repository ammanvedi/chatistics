export type AnalysisResult = {
    statistics: ReturnType<IStatisticsProcessor<any>['result']>[]
}

export interface IChatisticsConfig {
    path: string,
    preProcessors: IChatEntryPreprocessor[],
    statisticsProcessors: IStatisticsProcessor<any>[]
}

export type LineHandler = (s: string) => Promise<void>

export interface IChatEntryMetadata {
    raw: string,
    date: Date,
    text: string,
    participantName: string
}

export interface IChatEntryPreprocessor {
    process(chatEntry: IChatEntryMetadata): IChatEntryMetadata | null
}

export interface IMetadataProcessor {
    process(chatEntry: string): IChatEntryMetadata | null
}

export interface IStatisticsProcessor<StatResult> {
    process(chatEntry: IChatEntryMetadata): void
    result(): {
        name: string,
        data: StatResult
    }
}