import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Arc } from '@/components/styled-components/Arc';
import FlowerIcon from '/public/images/flower.svg';
import AboutMission from './AboutMission';
import {
	H1,
	Lead,
	brandColors,
	P,
	Button,
	neutralColors,
	D3,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

const tabTitles = ['Mission & Vision', 'History', 'Team'];

const AboutHistory = dynamic(() => import('./AboutHistory'));
const AboutTeam = dynamic(() => import('./AboutTeam'));

const AboutIndex = () => {
	const [activeTab, setActiveTab] = useState(tabTitles[0]);

	const changeTab = (tab: string) => setActiveTab(tab);

	return (
		<>
			<Upper>
				<ArcMustard />
				<DotMustard />
				<TeamImageWrapper>
					<img
						width='100%'
						src='/images/giveth-team.jpg'
						alt='giveth team'
					/>
				</TeamImageWrapper>
				<UpperTitle>Building the Future of Giving</UpperTitle>
				<UpperCaption>
					Giveth is a community focused on Building the Future of
					Giving using blockchain technology. Our vision is to make
					giving effortless, to reward people all over the world for
					creating positive change.
				</UpperCaption>
				<UpperButton label='SUPPORT GIVETH'></UpperButton>
			</Upper>

			<Middle>
				<Flower>
					<Image src={FlowerIcon} alt='flower icon' />
				</Flower>
				<MiddleBody>
					<H1>About us</H1>
					<br />
					<Lead>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Vitae purus, quis sit pretium, a nunc. Volutpat euismod
						semper porttitor eleifend. Elementum dui orci enim, nam
						diam mattis tempus. Et scelerisque dolor bibendum turpis
						enim, convallis senectus nulla suscipit.
					</Lead>
					<br />
					<Lead>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Vitae purus, quis sit pretium, a nunc. Volutpat euismod
						semper porttitor eleifend. Elementum dui orci enim, nam
						diam mattis tempus. Et scelerisque dolor bibendum turpis
						enim, convallis senectus nulla suscipit.
					</Lead>
				</MiddleBody>
			</Middle>

			<End>
				<EndMustardArc />
				<EndPurpleArc />
				<Tabs>
					{tabTitles.map(i => (
						<TabItem
							onClick={() => changeTab(i)}
							className={activeTab === i ? 'active' : ''}
							key={i}
						>
							{i}
						</TabItem>
					))}
				</Tabs>
				<TabContent>
					{activeTab === tabTitles[0] && <AboutMission />}
				</TabContent>
				<TabContent>
					{activeTab === tabTitles[1] && <AboutHistory />}
				</TabContent>
				<TabContent>
					{activeTab === tabTitles[2] && <AboutTeam />}
				</TabContent>
			</End>
		</>
	);
};

const TeamImageWrapper = styled.div`
	margin-top: 120px;
`;

const TabContent = styled.div`
	margin-top: 90px;
	color: ${brandColors.giv[700]};
`;

const TabItem = styled(P)`
	background: white;
	border-radius: 54px;
	width: 176px;
	height: 45px;
	color: ${brandColors.deep[500]};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	&.active {
		background: ${brandColors.giv[600]};
		color: white;
	}
`;

const Tabs = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
`;

const EndPurpleArc = styled(Arc)`
	border-width: 40px;
	border-color: ${brandColors.giv[600]} ${brandColors.giv[600]} transparent
		transparent;
	bottom: 0;
	left: -180px;
	width: 260px;
	height: 260px;
	transform: rotate(45deg);
	z-index: 0;
`;

const EndMustardArc = styled(Arc)`
	border-width: 40px;
	border-color: ${`transparent transparent ${brandColors.mustard[500]} ${brandColors.mustard[500]}`};
	top: 300px;
	right: -130px;
	width: 260px;
	height: 260px;
	transform: rotate(45deg);
	z-index: 0;
`;

const End = styled.div`
	background-image: url('/images/curves_about_us.svg');
	padding: 90px 150px;
	overflow: hidden;
	position: relative;
`;

const Flower = styled.div`
	position: absolute;
	margin-top: 5px;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
`;

const MiddleBody = styled.div`
	max-width: 800px;
	position: relative;
`;

const Middle = styled.div`
	position: relative;
	padding: 135px 0 185px 150px;
	background: ${brandColors.giv[500]};
	color: white;
`;

const UpperButton = styled(Button)`
	margin: 50px auto 180px auto;
`;

const UpperCaption = styled(Lead)`
	color: ${neutralColors.gray[900]};
	text-align: center;
	max-width: 950px;
	margin: 0 auto;
`;

const UpperTitle = styled(D3)`
	margin-top: 120px;
	margin-bottom: 32px;
	text-align: center;
	color: ${brandColors.giv[700]};
`;

const ArcMustard = styled(Arc)`
	border-width: 90px;
	border-color: transparent transparent ${brandColors.mustard[500]}
		transparent;
	top: 130px;
	right: -230px;
	width: 500px;
	height: 500px;
	transform: rotate(31deg);
	z-index: 1;
`;

const DotMustard = styled(Arc)`
	border-width: 45px;
	border-color: ${brandColors.mustard[500]};
	top: 300px;
	right: 200px;
	width: 87px;
	height: 87px;
	z-index: 1;
`;

const Upper = styled.div`
	background-image: url('/images/GIV_light.svg');
	overflow: hidden;
	position: relative;
`;

export default AboutIndex;