import {IChatEntryMetadata, IChatEntryPreprocessor} from "../types";

export class NameSanitizerPreProcessor implements IChatEntryPreprocessor {

    process(chatEntry: IChatEntryMetadata): IChatEntryMetadata | null {

        return {
            ...chatEntry,
            participantName: chatEntry.participantName.replace(/[^a-zA-Z0-9-]/g, '')
        };
    }

}