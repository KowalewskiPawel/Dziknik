import React, { useState } from 'react'
import dziknikLogo from "../../assets/logo_dark.png";

const MockPage = () => {

	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a href="#" target="_blank" rel="noreferrer">
					<img src={dziknikLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>DzikniK</h1>
			<div className="card">
				<button type="button" onClick={() => setCount((number) => number + 1)}>
					count is {count}
				</button>
			</div>
		</>
	)
}

export default MockPage;