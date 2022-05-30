import { FETCH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';

const fetchProject = async (id: number) => {
	const { data: project } = await client.query({
		query: FETCH_PROJECT_BY_ID,
		variables: {
			id: id,
		},
	});
	const { projectById } = project;
	if (projectById) {
		return projectById;
	}
};

const handler = async (req: any, res: any) => {
	const { query } = req;
	const { id } = query;
	try {
		res.status(200).json({ project: await fetchProject(parseInt(id)) });
	} catch (error) {
		res.status(500).json({ error });
	}
};

export default handler;
