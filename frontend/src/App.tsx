import { useState } from 'react';
import './App.css';
import MockPage from './components/mockPage/MockPage';
import LoginPage from './components/loginPage/LoginPage';


interface IUser {
	name: string;
	loggedIn: boolean;
}

export function App() {

	const noNameUser: IUser = {
		name: "noName",
		loggedIn: false
	}
	const [user, setUser] = useState<IUser>(noNameUser);

	return (
		<>
			{!user.loggedIn && <LoginPage />}
			{user.loggedIn && <MockPage />}
		</>
	);
}
