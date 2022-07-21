import {readChatEntry} from "../readChatEntry";
import {MetadataProcessor} from "../MetadataProcessor";
import {IChatEntryMetadata} from "../types";
import {join} from 'path'
import {MediaEntryExclusionPreProcessor} from "./MediaEntryExclusionPreProcessor";

describe('MediaEntryExclusionPreProcessor', () => {

    it('Should generate the correct metadata', async () => {

        const processor = new MediaEntryExclusionPreProcessor()
        const metadataProcessor = new MetadataProcessor()
        const result: (IChatEntryMetadata | null)[] = []

        await readChatEntry(join(__dirname, './NameSanitizerPreProcessor.fixture.txt'), async (line) => {
            result.push(processor.process(metadataProcessor.process(line)))
        })

        expect(result.map(r => r ? r.raw : r)).toMatchObject([
            '[03/06/2022, 17:34:33] Amman: message 1',
            '[03/06/2022, 17:34:40] Amman: message 2',
            '[03/06/2022, 17:36:11] Amman: message 4',
            null,
            null,
            null,
            null,
            null,
        ])

    })

})