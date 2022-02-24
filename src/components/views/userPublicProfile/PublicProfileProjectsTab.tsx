import { client } from '@/apollo/apolloClient';
import { FETCH_USER_PROJECTS } from '@/apollo/gql/gqlUser';
import { IUserProjects } from '@/apollo/types/gqlTypes';
import { IProject } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import ProjectCard from '@/components/project-card/ProjectCard';
import ContributeCard from './PublicProfileContributeCard';
import { Row } from '@/components/styled-components/Grid';
import { ETheme } from '@/context/general.context';
import { mediaQueries } from '@/lib/helpers';
import {
	brandColors,
	Container,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	IUserPublicProfileView,
	EOrderBy,
	EDirection,
	IOrder,
} from './UserPublicProfile.view';
import ProjectsTable from './ProjectsTable';

const itemPerPage = 10;

const PublicProfileProjectsTab: FC<IUserPublicProfileView> = ({
	user,
	myAccount,
}) => {
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<IProject[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [page, setPage] = useState(0);

	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});

	const orderChangeHandler = (orderby: EOrderBy) => {
		if (orderby === order.by) {
			setOrder({
				by: orderby,
				direction:
					order.direction === EDirection.ASC
						? EDirection.DESC
						: EDirection.ASC,
			});
		} else {
			setOrder({
				by: orderby,
				direction: EDirection.DESC,
			});
		}
	};

	useEffect(() => {
		if (!user) return;
		const fetchUserProjects = async () => {
			setLoading(true);
			const { data: userProjects } = await client.query({
				query: FETCH_USER_PROJECTS,
				variables: {
					userId: parseFloat(user.id) || -1,
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: order.by,
					direction: order.direction,
				},
			});
			setLoading(false);
			console.log({ userProjects });
			if (userProjects?.projectsByUserId) {
				const projectsByUserId: IUserProjects =
					userProjects.projectsByUserId;
				setProjects(projectsByUserId.projects);
				setTotalCount(projectsByUserId.totalCount);
			}
		};
		fetchUserProjects();
	}, [user, page, order.by, order.direction]);
	return (
		<>
			<UserContributeInfo>
				<ContributeCard user={user} />
			</UserContributeInfo>
			<ProjectsContainer>
				{myAccount ? (
					<ProjectsTableWrapper>
						<ProjectsTable
							projects={projects}
							orderChangeHandler={orderChangeHandler}
							order={order}
						/>
					</ProjectsTableWrapper>
				) : (
					projects.map(project => (
						<ProjectCard key={project.id} project={project} />
					))
				)}
				{loading && <Loading />}
			</ProjectsContainer>
			<Pagination
				currentPage={page}
				totalCount={totalCount}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
		</>
	);
};

export default PublicProfileProjectsTab;

export const ProjectsContainer = styled(Container)`
	display: grid;
	position: relative;
	gap: 24px;
	margin-bottom: 64px;
	padding: 0;
	${mediaQueries['lg']} {
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaQueries['xl']} {
		grid-template-columns: repeat(3, 1fr);
	}

	${mediaQueries['xxl']} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const ProjectsTableWrapper = styled.div`
	margin-left: 35px;
`;

const UserContributeInfo = styled.div`
	padding: 40px 0 60px;
`;

export const Loading = styled(Row)`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[800]
			: neutralColors.gray[200]}aa;
`;
