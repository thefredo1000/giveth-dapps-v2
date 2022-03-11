import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useCookies } from 'react-cookie';
import { useWeb3React } from '@web3-react/core';
import { BigNumberish } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';

import { initializeApollo } from '@/apollo/apolloClient';
import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import {
	compareAddresses,
	LocalStorageTokenLabel,
	signMessage,
} from '@/lib/helpers';
import * as Auth from '../services/auth';
import { getToken } from '@/services/token';
import User from '../entities/user';
import { getLocalStorageUserLabel } from '@/services/auth';
import useWallet from '@/hooks/walletHooks';
import { WelcomeSigninModal } from '@/components/modals/WelcomeSigninModal';
import { IUser } from '@/apollo/types/types';
import SignInModal from '@/components/modals/SignInModal';
import { CompleteProfile } from '@/components/modals/CompleteProfile';

interface IUserContext {
	state: {
		user?: IUser;
		balance?: string | null;
		isEnabled?: boolean;
		isSignedIn?: boolean;
	};
	actions: {
		signIn?: () => Promise<boolean | string>;
		signOut?: () => void;
		showSignModal: () => void;
		showCompleteProfile: () => void;
		reFetchUserData: () => void;
		incrementLikedProjectsCount: () => void;
		decrementLikedProjectsCount: () => void;
	};
}

const UserContext = createContext<IUserContext>({
	state: {
		user: undefined,
		isEnabled: false,
		isSignedIn: false,
	},
	actions: {
		signIn: async () => false,
		signOut: () => {},
		showSignModal: () => {},
		showCompleteProfile: () => {},
		reFetchUserData: () => {},
		incrementLikedProjectsCount: () => {},
		decrementLikedProjectsCount: () => {},
	},
});

const apolloClient = initializeApollo();

export const UserProvider = (props: { children: ReactNode }) => {
	const [cookie, setCookie, removeCookie] = useCookies(['giveth_user']);
	const { account, active, library, chainId, deactivate } = useWeb3React();
	useWallet();

	const [user, setUser] = useState<IUser | undefined>();
	const [balance, setBalance] = useState<string | null>(null);
	const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
	useWallet();
	const [showWelcomeSignin, setShowWelcomeSignin] = useState(false);
	const [showCompleteProfile, setShowCompleteProfile] = useState(false);

	const isEnabled = !!library?.getSigner() && !!account && !!chainId;
	const isSignedIn = isEnabled && !!user?.token;

	useEffect(() => {
		localStorage.removeItem(LocalStorageTokenLabel);
		if (!user) return;
		if (active && account) {
			if (compareAddresses(account, user?.walletAddress!)) {
				return;
			}
			fetchUser().then(setUser);
		} else {
			user && setUser(undefined);
		}
	}, [active, account]);

	useEffect(() => {
		library?.on('block', () => {
			getBalance();
		});
		return () => {
			library?.removeAllListeners('block');
		};
	}, []);

	const fetchLocalUser = (): User => {
		const localUser = Auth.getUser() as User;
		return new User(localUser);
	};

	const fetchUser = useCallback(() => {
		return apolloClient
			.query({
				query: GET_USER_BY_ADDRESS,
				variables: {
					address: account?.toLowerCase(),
				},
				fetchPolicy: 'network-only',
			})
			.then((res: any) => {
				return res.data?.userByAddress;
			})
			.catch(console.log);
	}, [account]);

	const signIn = useCallback(async () => {
		if (!library?.getSigner()) return false;

		const signedMessage = await signMessage(
			process.env.NEXT_PUBLIC_OUR_SECRET as string,
			account,
			chainId,
			library.getSigner(),
		);
		if (!signedMessage) return false;

		const token = await getToken(account, signedMessage, chainId, user);
		const localUser = fetchLocalUser();

		if (account !== localUser?.walletAddress) {
			Auth.logout();
			const DBUser = await fetchUser();
			const newUser = new User(DBUser);
			newUser.setToken(token);
			Auth.setUser(newUser, setCookie, 'giveth_user');
			await apolloClient.resetStore();
			setUser(newUser);
		} else {
			localUser.setToken(token);
			Auth.setUser(localUser, setCookie, 'giveth_user');
			await apolloClient.resetStore();
			setUser(localUser);
		}
		localStorage.setItem(getLocalStorageUserLabel() + '_token', token);
		return token;
	}, [account, chainId, fetchUser, library, setCookie, user]);

	const signOut = useCallback(() => {
		Auth.logout();
		window.localStorage.removeItem(getLocalStorageUserLabel() + '_token');
		removeCookie('giveth_user');
		apolloClient.resetStore().then();
		deactivate();
		setUser(undefined);
	}, []);

	const getBalance = () => {
		library
			.getBalance(account)
			.then((_balance: BigNumberish) => {
				setBalance(parseFloat(formatEther(_balance)).toFixed(3));
			})
			.catch(() => setBalance(null));
	};

	useEffect(() => {
		if (!!account && !!library) {
			getBalance();
		}
	}, [account, library, chainId]);

	const reFetchUserData = useCallback(() => {
		fetchUser()
			.then((res: any) => {
				if (res) {
					const newUser = new User(res);
					Auth.setUser(newUser, setCookie, 'giveth_user');
					if (user?.walletAddress === newUser.walletAddress) {
						setUser({ ...newUser, token: user?.token });
					}
				} else {
					const noUser = new User({} as User);
					setUser(noUser);
				}
			})
			.catch((e: Error) =>
				console.error('Error on refetching user info', e),
			);
	}, [fetchUser, setCookie, user?.token, user?.walletAddress]);

	useEffect(() => {
		if (account) {
			const _user = Auth.getUser();
			if (compareAddresses(account, _user?.walletAddress!)) {
				const newUser = new User(_user as User);
				setUser(newUser);
			} else {
				Auth.logout();
				reFetchUserData();
			}
		} else {
			if (user) setUser(undefined);
		}
	}, [account]);

	const incrementLikedProjectsCount = useCallback(() => {
		if (user) {
			setUser({
				...user,
				likedProjectsCount: (user.likedProjectsCount || 0) + 1,
			});
		}
	}, [user]);

	const decrementLikedProjectsCount = useCallback(() => {
		if (user) {
			setUser({
				...user,
				likedProjectsCount: (user.likedProjectsCount || 1) - 1,
			});
		}
	}, [user]);

	return (
		<UserContext.Provider
			value={{
				state: {
					user,
					balance,
					isEnabled,
					isSignedIn,
				},
				actions: {
					showSignModal: () => setShowWelcomeSignin(true),
					showCompleteProfile: () => setShowCompleteProfile(true),
					signIn,
					signOut,
					reFetchUserData,
					incrementLikedProjectsCount,
					decrementLikedProjectsCount,
				},
			}}
		>
			{showCompleteProfile && (
				<CompleteProfile
					closeModal={() => setShowCompleteProfile(false)}
				/>
			)}
			{showWelcomeSignin && (
				<WelcomeSigninModal
					showModal={showWelcomeSignin}
					setShowModal={() => setShowWelcomeSignin(false)}
				/>
			)}
			{showWalletModal && (
				<SignInModal
					showModal={showWalletModal}
					closeModal={() => setShowWalletModal(false)}
				/>
			)}
			{props.children}
		</UserContext.Provider>
	);
};

export default function useUser() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('Claim context not found!');
	}

	return context;
}
