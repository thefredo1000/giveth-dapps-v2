// import transakSDK from '@transak/transak-sdk'
import { captureException } from '@sentry/nextjs';
import {
	CREATE_DONATION,
	UPDATE_DONATION_STATUS,
} from '@/apollo/gql/gqlDonations';
import { client } from '@/apollo/apolloClient';
import { IConfirmDonation } from '@/components/views/donate/helpers';

interface IOnTxHash extends IConfirmDonation {
	txHash: string;
	nonce: number;
}

export const updateDonation = (donationId: number, status: string) => {
	client
		.mutate({
			mutation: UPDATE_DONATION_STATUS,
			variables: { donationId, status },
		})
		.catch((err: unknown) =>
			captureException(err, {
				tags: {
					section: 'updateDonation',
				},
			}),
		);
};

export async function saveDonation(props: IOnTxHash) {
	const { web3Context, txHash, amount, token, project, anonymous, nonce } =
		props;

	const { chainId } = web3Context;
	const { address, symbol } = token;
	const projectId = Number(project.id);

	let donationId = 0;
	try {
		const { data } = await client.mutate({
			mutation: CREATE_DONATION,
			variables: {
				transactionId: txHash,
				transactionNetworkId: chainId,
				nonce,
				amount,
				token: symbol,
				projectId,
				tokenAddress: address,
				anonymous,
			},
		});
		donationId = data.createDonation;
	} catch (error) {
		captureException(error, {
			tags: {
				section: 'createDonation',
			},
		});
		throw error;
	}
	console.log('DONATION SUCCESS: ', { donationId });
	return donationId;
}

// export async function startTransakDonation({ project, setSuccess }) {
//   const request = await fetch(`/api/transak`)
//   const response = await request.json()
//   const apiKey = response?.apiKey
//   const transak = new transakSDK({
//     apiKey: apiKey, // Your API Key
//     environment: process.env.NEXT_PUBLIC_ENVIRONMENT == 'live' ? 'PRODUCTION' : 'STAGING', // STAGING/PRODUCTION
//     defaultCryptoCurrency: 'DAI',
//     walletAddress: project.walletAddress, // Your customer's wallet address
//     themeColor: '000000', // App theme color
//     // fiatCurrency: 'USD', // INR/GBP
//     // defaultFiatAmount: amount,
//     cryptoCurrencyList: 'DAI,USDT',
//     email: '', // Your customer's email address
//     redirectURL: '',
//     hostURL: window.location.origin,
//     widgetHeight: '550px',
//     widgetWidth: '450px',
//     exchangeScreenTitle: `Donate to ${project.title}`,
//     hideMenu: true
//   })

//   transak.init()

//   transak.on(transak.ALL_EVENTS, async data => {
//     if (data?.eventName === 'TRANSAK_ORDER_SUCCESSFUL') {
//       transak.close()
//       setSuccess(data.status.walletLink)
//     }
//     if (data?.eventName === 'TRANSAK_ORDER_CREATED') {
//       // data.status
//       await saveDonationFromTransak(
//         data.status.fromWalletAddress,
//         data.status.walletAddress,
//         data.status.cryptoAmount,
//         data.status.cryptoCurrency,
//         parseFloat(project.id),
//         data.status.id,
//         data.status.status
//       )
//     }
//   })
// }
