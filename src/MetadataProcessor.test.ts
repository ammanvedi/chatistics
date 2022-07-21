import {readChatEntry} from "./readChatEntry";
import {MetadataProcessor} from "./MetadataProcessor";
import {IChatEntryMetadata} from "./types";
import {join} from 'path'

describe('MetadataProcessor', () => {

    it('Should generate the correct metadata', async () => {

        const processor = new MetadataProcessor()
        const result: IChatEntryMetadata[] = []

        await readChatEntry(join(__dirname, './MetadataProcessor.fixture.txt'), async (line) => {
            result.push(processor.process(line))
        })

        expect(result.map(r => ({
            ...r,
            date: r.date.toISOString()
        }))).toMatchObject([
            {
                 "date": "2022-06-03T17:34:33.000Z",
                 "participantName": "Pa",
                 "raw": "[03/06/2022, 17:34:33] Pa: message 1",
                 "text": "message 1",
            },
            {
                 "date": "2022-06-03T17:34:40.000Z",
                 "participantName": "Pb",
                 "raw": "[03/06/2022, 17:34:40] Pb: message 2",
                 "text": "message 2",
            },
            {
                 "date": "2022-06-03T17:35:47.000Z",
                 "participantName": "Pc",
                 "raw": "[03/06/2022, 17:35:47] Pc: message 3 line 1 message 3 line 2 “message 3 line 3”",
                 "text": "message 3 line 1 message 3 line 2 “message 3 line 3”",
            }
        ])

    })

})