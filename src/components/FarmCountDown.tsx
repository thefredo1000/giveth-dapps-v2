import { getNowUnixMS } from '@/helpers/time';
import { Lead, Subline } from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { durationToString } from '@/lib/helpers';
import { Flex } from './styled-components/Flex';

interface IFarmCountDown {
	startTime: number;
	setStarted: Dispatch<SetStateAction<boolean>>;
}

const FarmCountDown: FC<IFarmCountDown> = ({ startTime, setStarted }) => {
	const [timer, setTimer] = useState(-1000000);
	useEffect(() => {
		const interval = setInterval(() => {
			const diff = startTime - getNowUnixMS();
			setTimer(diff);
			if (diff < 0) setStarted(true);
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<FarmCountDownContainer
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
		>
			<Subline>Coming soon</Subline>
			<Timer>
				{timer < 0 ? '-- : -- : --' : durationToString(timer, 3)}
			</Timer>
		</FarmCountDownContainer>
	);
};

const FarmCountDownContainer = styled(Flex)`
	height: 132px;
	gap: 8px;
`;

const Timer = styled(Lead)`
	/* width: 132px; */
	& > span {
		width: 1ch;
		display: inline-block;
		text-align: center;
	}
`;

export default FarmCountDown;
