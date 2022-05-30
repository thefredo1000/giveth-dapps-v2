import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { client } from '@/apollo/apolloClient';

const fetchUser = async (address: string) => {
	const { data: userData } = await client.query({
		query: GET_USER_BY_ADDRESS,
		variables: {
			address: address,
		},
	});

	const { userByAddress } = userData;
	if (userByAddress) {
		return userByAddress;
	}
};

const handler = async (req: any, res: any) => {
	const { query } = req;
	const { address } = query;
	try {
		res.status(200).json({ user: await fetchUser(address) });
	} catch (error) {
		res.status(500).json({ error });
	}
};

export default handler;
