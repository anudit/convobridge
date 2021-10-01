import { Client, PrivateKey, ThreadID, Where } from '@textile/hub'

export const getClient = async () =>{

    const identity = PrivateKey.fromString(process.env.TEXTILE_PK);
    const client = await Client.withKeyInfo({
        key: process.env.TEXTILE_HUB_KEY_DEV,
        debug: true
    })
    await client.getToken(identity);
    return client;

}

export async function isValidThreadId(tid) {

    let threadClient = await getClient();
    const threadId = ThreadID.fromString(process.env.TEXTILE_THREADID);
    const query = new Where('tid').eq(tid);
    let snapshot = await threadClient.find(threadId, 'comments', query);
    return Boolean(snapshot.length);

}
