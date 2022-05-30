import { EDirection } from '@/apollo/types/gqlEnums';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { client } from '@/apollo/apolloClient';

enum EOrderBy {
	TokenAmount = 'TokenAmount',
	UsdAmount = 'UsdAmount',
	CreationDate = 'CreationDate',
}

interface IQueries {
	projectId: number;
	orderBy: { field: string; direction: string };
	skip?: number;
	take?: number;
	searchTerm?: string;
}

const fetchProjectDonations = async (variables: IQueries) => {
	const { data: projectDonations } = await client.query({
		query: FETCH_PROJECT_DONATIONS,
		variables: variables,
	});
	const { donationsByProjectId } = projectDonations;
	if (!!donationsByProjectId?.donations) {
		return donationsByProjectId.donations;
	}
};

const handler = async (req: any, res: any) => {
	const { query } = req;

	const pageSize: number = query.pageSize
		? parseInt(req.query.pageSize, 10)
		: 10;

	const page: number = query.page ? parseInt(query.page, 10) : 1;

	const orderBy: string = Object.values(EOrderBy).includes(query.orderBy)
		? query.orderBy
		: '';

	const direction: string = query.direction
		? req.query.direction
		: EDirection.DESC;

	const searchTerm: string = query.searchTerm ? query.searchTerm : '';

	const projectId: number = query.projectId
		? parseInt(query.projectId, 10)
		: 0;

	const variables: IQueries = {
		projectId: projectId,
		orderBy: { field: orderBy, direction },
		skip: (page - 1) * pageSize,
		take: pageSize,
		searchTerm: searchTerm,
	};

	try {
		res.status(200).json({
			projectDonations: await fetchProjectDonations(variables),
		});
	} catch (error) {
		res.status(500).json({ error });
	}
};

export default handler;
