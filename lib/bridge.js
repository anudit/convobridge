import { Where , ThreadID} from '@textile/hub'
import { getClient, isValidThreadId } from './thread-db';

export const getBridgeData = async (ethAddress) =>{

    let threadClient = await getClient();
    const threadId = ThreadID.fromString(process.env.TEXTILE_THREADID);
    const query = new Where('_id').eq(ethAddress);
    let snapshot = await threadClient.find(threadId, 'bridge', query);

    if (snapshot.length > 0){
        return {
            success: true,
            discord: Object.keys(snapshot[0]).includes('discordData') === true ? (snapshot[0].discordData?.username + "#"  + snapshot[0].discordData?.discriminator) : false,
            slack: Object.keys(snapshot[0]).includes('slackData') === true ? (snapshot[0].slackData?.name) : false,
            telegram: Object.keys(snapshot[0]).includes('telegramData') === true ? (snapshot[0].telegramData?.username) : false,
            zoom: Object.keys(snapshot[0]).includes('zoomData') === true ? (snapshot[0].zoomData?.account_id) : false
        };
    }
    else {
        return { success: true };
    }

}

export const bridgeReverseLookup = async (type, userId) =>{

    let threadClient = await getClient();
    const threadId = ThreadID.fromString(process.env.TEXTILE_THREADID);

    let query;
    if ( type === 'telegram' ) {
        query = new Where("telegramData.username").eq(userId);

    }
    else if ( type === 'slack' ) {
        query = new Where("slackData.name").eq(userId);
    }
    else if ( type === 'discord' ) {
        let [ username, discriminator ] = decodeURIComponent(userId).split('#');
        query = new Where("discordData.username").eq(username).and("discordData.discriminator").eq(discriminator);
    }
    else if ( type === 'zoom' ) {
        query = new Where("zoomData.account_id").eq(userId);
    }
    else {
        return { success: false, message: "Invalid type or id."};
    }

    const snapshot = await threadClient.find(threadId, 'bridge', query);

    if (snapshot.length === 0 ){
        return { success: false, message: `${type} data not found.`};
    }
    else {
        return {
            success: true,
            ethAddress: snapshot[0]?._id,
            state: snapshot[0]?.state
        };
    }

}

export const joinThreadOnBridge  = async (type, userId, threadId) =>{
    let data = await getBridgeData(type, userId);
    if (data?.success === true) {

        let resp = await isValidThreadId(threadId);
        if(resp === true) {

            let threadClient = await getClient();
            const threadId = ThreadID.fromString(process.env.TEXTILE_THREADID);
            await threadClient.save(threadId, 'bridge', [{
                ...data,
                "state": threadId,
            }]);

            return true;

        }
        else {
            return false;
        }

    }
    else {
        return false;
    }

}

export const updateAuthData  = async (type, ethAddress, data) =>{

    let threadClient = await getClient();
    const threadId = ThreadID.fromString(process.env.TEXTILE_THREADID);
    const query = new Where('_id').eq(ethAddress);
    let snapshot = await threadClient.find(threadId, 'bridge', query);
    let bridgeData = snapshot[0];

    if (type === 'telegram') {
        await threadClient.save(threadId, 'bridge', [{
            ...bridgeData,
            "telegramData": data,
        }]);
        return true;
    }
    else if (type === 'slack') {
        await threadClient.save(threadId, 'bridge', [{
            ...bridgeData,
            "slackData": data,
        }]);
        return true;
    }
    else if (type === 'discord') {
        await threadClient.save(threadId, 'bridge', [{
            ...bridgeData,
            "discordData": data,
        }]);
        return true;
    }
    else if (type === 'zoom') {
        let newDoc = {
            ...bridgeData,
            "zoomData": data,
        }
        await threadClient.save(threadId, 'bridge', [newDoc]);
        console.log("Stored zoom data", newDoc);
        return true;
    }
    else {
        return false;
    }

}

export const deleteAuthData  = async (type, ethAddress) =>{

    let threadClient = await getClient();
    const threadId = ThreadID.fromString(process.env.TEXTILE_THREADID);
    const query = new Where('_id').eq(ethAddress);
    let snapshot = await threadClient.find(threadId, 'bridge', query);
    let bridgeData = snapshot[0];

    console.log('bridgeData', bridgeData);

    if (type === 'telegram') {
        delete bridgeData['telegramData'];
        await threadClient.save(threadId, 'bridge', [{
            "_id": ethAddress,
            ...bridgeData
        }]);
        return true;
    }
    else if (type === 'slack') {
        delete bridgeData['slackData'];

        await threadClient.save(threadId, 'bridge', [{
            "_id": ethAddress,
            ...bridgeData
        }]);
        return true;
    }
    else if (type === 'discord') {
        delete bridgeData['discordData'];
        await threadClient.save(threadId, 'bridge', [{
            "_id": ethAddress,
            ...bridgeData
        }]);
        return true;
    }
    else if (type === 'zoom') {
        delete bridgeData['zoomData'];
        await threadClient.save(threadId, 'bridge', [{
            "_id": ethAddress,
            ...bridgeData
        }]);
        return true;
    }
    else {
        return false;
    }

}
