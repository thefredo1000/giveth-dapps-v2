import {
	FETCH_PROJECT_UPDATES,
	ADD_PROJECT_UPDATE,
	DELETE_PROJECT_UPDATE,
	EDIT_PROJECT_UPDATE,
} from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';

interface IQueries {
	projectId: number;
	skip?: number;
	take?: number;
}

const fetchProjectUpdates = async (variables: IQueries) => {
	const { data: projectUpdates } = await client.query({
		query: FETCH_PROJECT_UPDATES,
		variables: variables,
	});

	const { getProjectUpdates } = projectUpdates;
	if (!!getProjectUpdates) {
		return getProjectUpdates;
	}
};

const handler = async (req: any, res: any) => {
	const { query } = req;

	const pageSize: number = query.pageSize
		? parseInt(req.query.pageSize, 10)
		: 10;

	const page: number = query.page ? parseInt(query.page, 10) : 1;

	const projectId: number = query.projectId ? parseFloat(query.projectId) : 0;

	const variables: IQueries = {
		projectId: projectId,
		skip: (page - 1) * pageSize,
		take: pageSize,
	};

	try {
		res.status(200).json({
			projectUpdates: await fetchProjectUpdates(variables),
		});
	} catch (error) {
		res.status(500).json({ error });
	}
};

export default handler;
