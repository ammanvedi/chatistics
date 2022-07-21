import {Chatistics} from "./chatistics";
import {join} from 'path'

describe('Chatistics', () => {

    it('should output the correct statistics', async () => {
        const c = new Chatistics({
            //path: join(__dirname, 'chatistics.fixture.txt'),
            // TODO revert
            path: join(__dirname, '_chat.txt'),
        })

        const result = await c.analyze()

        expect(result).toMatchObject({
            statistics: []
        })
    })

})