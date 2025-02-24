import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';

import {
	IUserPublicProfileView,
	EOrderBy,
	IOrder,
} from '../UserPublicProfile.view';
import { EDirection } from '@/apollo/types/gqlEnums';
import { client } from '@/apollo/apolloClient';
import { FETCH_USER_DONATIONS } from '@/apollo/gql/gqlUser';
import { IUserDonations } from '@/apollo/types/gqlTypes';
import { IWalletDonation } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { Flex } from '@/components/styled-components/Flex';
import NothingToSee from '@/components/views/userPublicProfile/NothingToSee';
import DonationTable from '@/components/views/userPublicProfile/donationsTab/DonationsTable';

const itemPerPage = 10;

const PublicProfileDonationsTab: FC<IUserPublicProfileView> = ({
	myAccount,
	user,
}) => {
	const [loading, setLoading] = useState(false);
	const [donations, setDonations] = useState<IWalletDonation[]>([]);
	const [totalDonations, setTotalDonations] = useState<number>(0);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});

	const changeOrder = (orderBy: EOrderBy) => {
		if (orderBy === order.by) {
			setOrder({
				by: orderBy,
				direction:
					order.direction === EDirection.ASC
						? EDirection.DESC
						: EDirection.ASC,
			});
		} else {
			setOrder({
				by: orderBy,
				direction: EDirection.DESC,
			});
		}
	};

	useEffect(() => {
		if (!user) return;
		const fetchUserDonations = async () => {
			setLoading(true);
			const { data: userDonations } = await client.query({
				query: FETCH_USER_DONATIONS,
				variables: {
					userId: parseFloat(user.id || '') || -1,
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: order.by,
					direction: order.direction,
				},
			});
			setLoading(false);
			if (userDonations?.donationsByUserId) {
				const donationsByUserId: IUserDonations =
					userDonations.donationsByUserId;
				setDonations(donationsByUserId.donations);
				setTotalDonations(donationsByUserId.totalCount);
			}
		};
		fetchUserDonations().then();
	}, [user, page, order.by, order.direction]);

	return (
		<DonationsTab>
			<DonationTableWrapper>
				{!loading && totalDonations === 0 ? (
					<NothingWrapper>
						<NothingToSee
							title={`${
								myAccount ? "You haven't" : "This user hasn't"
							} donated to any projects yet!`}
						/>
					</NothingWrapper>
				) : (
					<DonationTable
						donations={donations}
						order={order}
						changeOrder={changeOrder}
					/>
				)}
				{loading && <Loading />}
			</DonationTableWrapper>
			<Pagination
				currentPage={page}
				totalCount={totalDonations}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
		</DonationsTab>
	);
};

const Loading = styled(Flex)`
	position: absolute;
	left: 0;
	right: 0;
	top: 42px;
	bottom: 0;
	background-color: ${neutralColors.gray[200]}aa;
`;

const DonationTableWrapper = styled.div`
	position: relative;
	overflow: auto;
	margin-bottom: 40px;
`;

const NothingWrapper = styled.div`
	position: relative;
	padding: 100px 0;
`;

const DonationsTab = styled.div`
	margin-bottom: 80px;
`;

export default PublicProfileDonationsTab;
