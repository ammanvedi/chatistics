import {IChatEntryMetadata, IChatEntryPreprocessor} from "./types";

export class MediaEntryExclusionPreProcessor implements IChatEntryPreprocessor {

    private static mediaMessageStrings = [
        'audio omitted',
        'image omitted',
        'video omitted',
        'sticker omitted',
        'GIF omitted'
    ]

    process(chatEntry: IChatEntryMetadata): IChatEntryMetadata | null {

        for(let i = 0; i < MediaEntryExclusionPreProcessor.mediaMessageStrings.length; i++) {
            const str = MediaEntryExclusionPreProcessor.mediaMessageStrings[i];

            if(chatEntry.text.startsWith(str)) {
                return null
            }
        }

        return chatEntry;
    }

}