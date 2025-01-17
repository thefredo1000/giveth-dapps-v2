import { brandColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

import FixedToast from '@/components/toasts/FixedToast';
import links from '@/lib/constants/links';
import ExternalLink from '@/components/ExternalLink';

const GIVBackToast = (props: {
	projectEligible?: boolean;
	tokenEligible?: boolean;
}) => {
	const { projectEligible, tokenEligible } = props;
	let message, color, boldColor, backgroundColor;
	if (!projectEligible) {
		message = 'This project is not eligible for GIVbacks.';
		color = brandColors.mustard[700];
		boldColor = brandColors.mustard[800];
		backgroundColor = brandColors.mustard[200];
	} else if (tokenEligible) {
		message = 'This token is eligible for GIVbacks.';
		color = brandColors.giv[300];
		boldColor = brandColors.giv[600];
		backgroundColor = brandColors.giv[100];
	} else {
		message = (
			<>
				This token is not eligible for GIVbacks. To create a request to
				add this token to our GIVbacks token list, please make a comment
				in{' '}
				<ExternalLink
					href={links.GIVBACK_TOKENS_FORUM}
					title='our forum'
				/>
				.
			</>
		);
		color = brandColors.mustard[700];
		boldColor = brandColors.mustard[800];
		backgroundColor = brandColors.mustard[200];
	}

	return (
		<ToastContainer>
			<FixedToast
				message={message}
				color={color}
				boldColor={boldColor}
				backgroundColor={backgroundColor}
				href={links.GIVBACK_DOC}
			/>
		</ToastContainer>
	);
};

const ToastContainer = styled.div`
	margin: 12px 0;
`;

export default GIVBackToast;
