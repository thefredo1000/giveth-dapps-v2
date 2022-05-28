import { EDirection, gqlEnums } from '@/apollo/types/gqlEnums';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';

interface IQueries {
	orderBy: { field: string; direction: string };
	skip?: number;
	limit?: number;
	category?: string;
}

const fetchProjects = async (variables: IQueries) => {
	const { data } = await client.query({
		query: FETCH_ALL_PROJECTS,
		variables,
		fetchPolicy: 'network-only',
	});
	return data.projects;
};

const handler = async (req: any, res: any) => {
	const { query } = req;

	const pageSize: number = query.pageSize
		? parseInt(req.query.pageSize, 10)
		: 10;

	const page: number = query.page ? parseInt(query.page, 10) : 1;

	const orderBy: string = query.orderBy
		? query.orderBy
		: gqlEnums.QUALITYSCORE;

	const direction: string = query.direction
		? req.query.direction
		: EDirection.DESC;

	const category: string = query.category ? query.category : '';

	const variables: IQueries = {
		orderBy: { field: orderBy, direction },
		skip: (page - 1) * pageSize,
		limit: pageSize,
		category: category,
	};

	try {
		res.status(200).json({ projects: await fetchProjects(variables) });
	} catch (error) {
		res.status(500).json({ error });
	}
};

export default handler;
