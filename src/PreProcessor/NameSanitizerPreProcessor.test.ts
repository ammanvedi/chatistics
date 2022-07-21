import {readChatEntry} from "../readChatEntry";
import {MetadataProcessor} from "../MetadataProcessor";
import {IChatEntryMetadata} from "../types";
import {join} from 'path'
import {NameSanitizerPreProcessor} from "./NameSanitizerPreProcessor";

describe('MediaEntryExclusionPreProcessor', () => {

    it('Should generate the correct metadata', async () => {

        const processor = new NameSanitizerPreProcessor()
        const metadataProcessor = new MetadataProcessor()
        const result: (IChatEntryMetadata | null)[] = []

        await readChatEntry(join(__dirname, './NameSanitizerPreProcessor.fixture.txt'), async (line) => {
            result.push(processor.process(metadataProcessor.process(line)))
        })

        expect(result.map(r => r ? r.participantName : r)).toMatchObject([
            'Pa',
            'Amman'
        ])

    })

})