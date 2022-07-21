import {readChatEntry} from "./readChatEntry";
import {join} from 'path'

describe('readChatEntry', () => {
    it('should read entries correctly', async () => {
        const mockCallback = jest.fn();
        await readChatEntry(join(__dirname, 'reactChatEntry.fixture.txt'), mockCallback);
        expect(mockCallback.mock.calls.length).toBe(9);
        expect(mockCallback.mock.calls.map(c => c[0])).toMatchObject([
            "[03/06/2022, 17:34:33] Amman: message 1",
            "[03/06/2022, 17:34:40] Amman: message 2",
            "[03/06/2022, 17:35:47] Amman: message 3 line 1 message 3 line 2 “message 3 line 3”",
            "[03/06/2022, 17:36:11] Amman: message 4",
            "[27/06/2022, 13:17:50] Amman: audio omitted",
            "[27/06/2022, 13:18:17] Amman: image omitted",
            "[27/06/2022, 13:05:00] Amman: video omitted",
            "[11/07/2022, 15:27:45] Amman: sticker omitted",
            "[11/07/2022, 15:27:45] Amman: GIF omitted",
        ])
    });
})