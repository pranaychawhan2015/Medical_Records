import {QueryHandler, QueryHandlerFactory, Query, QueryResults} from 'fabric-network';
import {Endorser} from 'fabric-common';
import * as util from 'util';


class SampleQueryHandler implements QueryHandler {
	private readonly peers: Endorser[];

	constructor(peers: Endorser[]) {
		this.peers = peers;
	}

	public async evaluate(query: Query): Promise<Buffer> {
		const errorMessages: string[] = [];

		for (const peer of this.peers) {
			const results: QueryResults = await query.evaluate([peer]);
			const result = results[peer.name];
			if (result instanceof Error) {
				errorMessages.push(result.toString());
			} else {
				if (result.isEndorsed) {
					console.log("This is working");
					return result.payload;
				}
				throw new Error(result.message);
			}
		}

		const message = util.format('Query failed. Errors: %j', errorMessages);
		throw new Error(message);
	}
}


export const createQueryHandler: QueryHandlerFactory = (network) => {
	//const mspId = network.getGateway().getIdentity().mspId;
	const channel = network.getChannel();
	const orgPeers = channel.getEndorsers('Org1MSP');
	//const otherPeers = channel.getEndorsers().filter((peer) => !orgPeers.includes(peer));
	//const allPeers = orgPeers.concat(otherPeers);
	return new SampleQueryHandler(orgPeers);
};



